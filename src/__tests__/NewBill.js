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
//test 1 : vérifie que le formulaire est bien soumis
//TEST 1  comportement attendu lorsque l'utilisateur remplit le formulaire de création d'une nouvelle note de frais et clique sur le bouton de soumission
describe("When I click on the submit button", () => {
  test("then it should create a new bill", () => {
    // mock du local storage pour simuler qu'on est connecté
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
    // simuler le chargement de la page newBill avec la fonction NewBillUI
    document.body.innerHTML = NewBillUI();

    // créer un mock de la fonction onNavigate pour vérifier qu'elle est bien appelée
    const mockOnNavigate = jest.fn();

    const newBill = new NewBill({
      document,
      onNavigate: mockOnNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    // simuler la saisie des champs obligatoires
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
      target: { value: 10 },
    });
    fireEvent.change(screen.getByTestId("pct"), {
      target: { value: 20 },
    });
    fireEvent.change(screen.getByTestId("commentary"), {
      target: { value: "" },
    });

    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

    const form = screen.getByTestId("form-new-bill");
    form.addEventListener("submit", handleSubmit);

    // submit the form
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();

    expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
  });
});
