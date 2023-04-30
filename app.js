import express from "express";
import { createReadStream } from "node:fs";
import neo4j from "neo4j-driver"; // https://neo4j.com/docs/api/javascript-driver/current/
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const { db_url, db_user, db_password, database } = process.env;

const driver = neo4j.driver(db_url, neo4j.auth.basic(db_user, db_password));

app.get("/api/nodes", async (req, res) => {
  const session = driver.session(database);
  const query = await session.executeRead((tx) => {
    return tx.run(`MATCH (n:Interface) RETURN n LIMIT 20`);
  });
  const result = query.records.map((item) => item.get("n").properties);
  res.json(result);
  await session.close();
});
app.get("/api/nodestype", async (req, res) => {
  const session = driver.session(database);
  const query = await session.executeRead(async (tx) => {
    return await tx.run(`CALL db.labels()`);
  });
  const result = query.records.map((item) => item.get("label"));
  res.json(result);
  await session.close();
});

// SEND HTML FILE
app.use(express.static("./assets"));

app.get("/", (req, res) => {
  const file = createReadStream("index.html");
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  file.pipe(res);
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});