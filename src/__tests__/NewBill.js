/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
//ajout de :
import userEvent from "@testing-library/user-event";
import DashboardFormUI from "../views/DashboardFormUI.js";
import DashboardUI from "../views/DashboardUI.js";
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js";
import { bills } from "../fixtures/bills";
import Logout from "./Logout.js";
import { waitFor, fireEvent } from "@testing-library/dom";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     test("Then ...", () => {
//       const html = NewBillUI()
//       document.body.innerHTML = html
//       //to-do write assertion
//     })
//   })
// })

jest.mock("../app/store", () => mockStore);

////////////////////////////////////////////////

describe("I am an employee and I create a new bill", () => {
  beforeEach(() => {
    // Réinitialisation du local storage
    window.localStorage.clear();

    // Suppression du contenu du body
    document.body.innerHTML = "";
  });

  // TEST 1 : Comportement attendu lorsque l'utilisateur remplit le formulaire de création d'une nouvelle note de frais avec des données valides et qu'il clique sur le bouton de validation
  test("Then it should create a new bill when all is correct", () => {
    // Mock du local storage pour simuler qu'on est connecté
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "e-mail@test.fr",
      })
    );

    // Simuler le chargement de la page NewBill avec la fonction NewBillUI
    document.body.innerHTML = NewBillUI();

    // Créer un mock de la fonction onNavigate pour vérifier qu'elle est bien appelée
    const mockOnNavigate = jest.fn();

    // Créer un mock de NewBill
    const newBill = new NewBill({
      document,
      onNavigate: mockOnNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    // Simuler la saisie des champs obligatoires
    fireEvent.change(screen.getByTestId("expense-type"), {
      target: { value: "Transports" },
    });
    fireEvent.change(screen.getByTestId("expense-name"), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByTestId("datepicker"), {
      target: { value: "2023-04-11" },
    });
    fireEvent.change(screen.getByTestId("amount"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByTestId("vat"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByTestId("pct"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByTestId("commentary"), {
      target: { value: "" },
    });

    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

    // Récupérer le formulaire et ajouter un event listener sur le submit pour appeler la fonction handleSubmit
    const form = screen.getByTestId("form-new-bill");
    form.addEventListener("submit", handleSubmit);

    // Submit du formulaire
    fireEvent.submit(form);

    // On s'attend à ce que la fonction handleSubmit soit appelée
    expect(handleSubmit).toHaveBeenCalled();

    // On s'attend à ce que la fonction onNavigate soit appelée avec la bonne route
    expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
  });

  // TEST 2 : Comportement attendu lorsque l'utilisateur essaye de créer une note de frais avec un fichier ayant une extension invalide
  test("Then it should not create a new bill when the file is wrong ext", () => {
    // Mock du local storage pour simuler qu'on est connecté en tant qu'employé
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "mail@test.fr",
      })
    );

    // On ajoute un div root
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    // On charge le router pour naviguer ensuite
    router();

    // On se place sur la page de création d'une note de frais
    window.onNavigate(ROUTES_PATH.NewBill);

    // On crée un fichier avec une extension invalide
    const fileWithInvalidExt = new File(["file.invalid"], "file.invalid", {
      type: "image/gif",
    });

    // On crée un mock pour vérifier que la fonction d'alerte est bien appelée
    const alerting = jest.spyOn(window, "alert").mockImplementation(() => {});

    // On récupère le champ de fichier et on déclenche l'upload
    const fileField = screen.getByTestId("file");
    userEvent.upload(fileField, fileWithInvalidExt);

    // On vérifie que l'alerte est bien appelée avec le message approprié
    expect(alerting).toBeCalledWith(
      "Veuillez choisir un fichier ayant une extension jpg, jpeg ou png."
    );

    // On vérifie que le champ est bien vide (puisque pas le bon format)
    expect(fileField.value).toBe("");
  });

  // TEST 3 : test si erreur, error est bien appelée
});

//test 4 : test de la fonction create() de NewBill.js (fonction qui permet de créer une note de frais)
