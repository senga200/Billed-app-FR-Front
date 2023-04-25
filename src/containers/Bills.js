import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

//gere l'affichage et la navigation de la page Bills
//onNavigate est une fonction qui permet de naviguer entre les pages
export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document; //DOM
    this.onNavigate = onNavigate; //Navigation entre les pages
    this.store = store; //contient les données de l'utilisateur
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    ); //bouton pour créer une nouvelle facture
    if (buttonNewBill)
      buttonNewBill.addEventListener("click", this.handleClickNewBill); //si le bouton existe, on lui ajoute un event listener pour qu'il appelle la fonction handleClickNewBill
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`); // icone oeil
    if (iconEye)
      iconEye.forEach((icon) => {
        // si l'icone existe, on lui ajoute un event listener pour qu'il appelle la fonction handleClickIconEye
        icon.addEventListener("click", () => this.handleClickIconEye(icon));
      });
    new Logout({ document, localStorage, onNavigate }); // on appelle la classe Logout pour gérer la déconnexion
  }

  handleClickNewBill = () => {
    // fonction qui permet de naviguer vers la page NewBill
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  handleClickIconEye = (icon) => {
    // fonction qui permet d'afficher la facture dans une modale
    const billUrl = icon.getAttribute("data-bill-url"); // on récupère l'url de la facture
    const imgWidth = Math.floor($("#modaleFile").width() * 0.5); // on récupère la largeur de la modale et on la divise par 2
    $("#modaleFile")
      .find(".modal-body")
      .html(
        `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      ); // on affiche la facture dans la modale
    $("#modaleFile").modal("show"); // on affiche la modale
  };

  getBills = () => {
    // fonction qui permet de récupérer les factures de l'utilisateur
    if (this.store) {
      // si l'utilisateur est connecté et que le store existe on formate les données récupérées et on les renvoie
      //et renvoie un tableau contenant les factures de formatées.
      return this.store
        .bills() // on récupère les factures
        .list() // on appelle la fonction list pour récupérer la liste des factures
        .then((snapshot) => {
          // on récupère le résultat dans snapshot
          const bills = snapshot // on stocke le résultat dans bills
            .map((doc) => {
              // on parcourt la liste des factures et on les formate pour l'affichage dans la page Bills (date et status) avec date et status (format.js)
              try {
                return {
                  ...doc, // on récupère les données de la facture avec ... pour créer un nouvel objet
                  date: formatDate(doc.date),
                  status: formatStatus(doc.status),
                };
              } catch (e) {
                // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                // log the error and return unformatted date in that case
                console.log(e, "for", doc);
                return {
                  ...doc,
                  date: doc.date,
                  status: formatStatus(doc.status),
                };
              }
            });
          console.log("length", bills.length);
          return bills;
        });
    }
  };
}
