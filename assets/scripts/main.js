async function fetchIP() {
  await fetch("http://localhost:3000/api/nodes")
    .then((response) => response.json())
    .then((data) => {
      // parcours des résultats et ajout à la liste
      data.map((item) => {
        const option = document.createElement("option");
        option.innerHTML = item.ip;
        option.value = item.ip;
        document.querySelector("#nodes").appendChild(option);
      });
    });
}
async function fetchNodes() {
  await fetch("http://localhost:3000/api/nodestype")
    .then((response) => response.json())
    .then((data) => {
      // parcours des résultats et ajout à la liste
      data.map((item) => {
        const option = document.createElement("option");
        option.innerHTML = item;
        option.value = item;
        document.querySelector("#nodestype").appendChild(option);
      });
    });
}

fetchIP();
fetchNodes();

// Empêche le formulaire de s'envoyer
const handleSubmit = (event) => { // https://docs.netlify.com/forms/setup/#submit-html-forms-with-ajax
  event.preventDefault();

  const myForm = event.target;
  const formData = new FormData(myForm);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => console.log("Form successfully submitted"))
    .catch((error) => alert(error));
};

document.querySelector("form").addEventListener("submit", handleSubmit);
