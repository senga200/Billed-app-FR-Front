import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  //class NewBill qui gère la création d'une nouvelle facture
  // paramètres : doc HTML, onNavigate navigation entre les pages, store qui stocke les données de l'utilisateur, localStorage qui stocke les données localement
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]` //formulaire de création de facture
      // on lui ajoute un event listener pour qu'il appelle la fonction handleSubmit lors de la soumission du formulaire
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`); //input de type file pour ajouter une image de la facture et on lui ajoute un event listener pour qu'il appelle la fonction handleChangeFile lors du changement de fichier
    file.addEventListener("change", this.handleChangeFile);
    // pas de valeur par défaut pour les champs du formulaire au départ
    // variables qui seront utilisées pour stocker les données du formulaire
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate }); // on appelle la classe Logout pour pouvoir se déconnecter
  }
  // fonction qui gére le téléchargement du fichier et l'envoi des données du formulaire au serveur
  //test 2
  handleChangeFile = (e) => {
    e.preventDefault();
    const file = this.document.querySelector(`input[data-testid="file"]`)
      .files[0]; // on récupère le fichier 0 (le premier) qui a été ajouté

    const filePath = e.target.value.split(/\\/g); // on récupère le chemin du fichier avec e.target.value, split permet de découper le chemin en string
    const fileName = filePath[filePath.length - 1]; // permet de récupérer le dernier élément du tableau filePath, qui correspond au nom du fichier avec son extension.
    const formData = new FormData(); // ajoute le fichier
    const email = JSON.parse(localStorage.getItem("user")).email; //ajoute le mail
    formData.append("file", file); // ajoute le fichier file au formulaire formData
    formData.append("email", email); // idem mail

    //bug fichier : accepter uniquement les fichiers jpg, jpeg et png
    if (
      !(
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
      )
    ) {
      alert(
        "Veuillez choisir un fichier ayant une extension jpg, jpeg ou png."
      );
      // empeche l'envoi du formulaire si le fichier n'est pas au bon format
      e.target.value = "";
      return false;
    }
    //FIN bug fichier
    // on envoie le fichier au serveur
    this.store
      // on appelle la fonction bills du store pour créer une nouvelle facture
      .bills()
      // on appelle la fonction create du store pour créer une nouvelle facture
      .create({
        data: formData,
        headers: {
          noContentType: true,
        },
      }) // on récupère l'url du fichier et la clé de la facture
      .then(({ fileUrl, key }) => {
        console.log(fileUrl); // on affiche l'url du fichier dans la console
        this.billId = key; // on stocke la clé de la facture
        this.fileUrl = fileUrl; // on stocke l'url du fichier
        this.fileName = fileName; // on stocke le nom du fichier
      })
      .catch((error) => console.error(error)); // si erreur, on affiche l'erreur dans la console
  };

  //TEST 1 : vérifie que le formulaire est bien soumis
  //fonction appelée lors de la soumission du formulaire
  handleSubmit = (e) => {
    e.preventDefault(); // empeche le "rafraichissement" de la page lors de la soumission du formulaire
    console.log(
      'e.target.querySelector(`input[data-testid="datepicker"]`).value',
      e.target.querySelector(`input[data-testid="datepicker"]`).value
    );
    const email = JSON.parse(localStorage.getItem("user")).email;
    //récup mail, et bill contient toutes les données ci dessous
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    this.updateBill(bill); // bill en parametres pour mettre à jour la facture
    this.onNavigate(ROUTES_PATH["Bills"]); // on se redirige vers la page des bills
  };

  // not need to cover this function by tests
  /*istanbul ignore next*/
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}
