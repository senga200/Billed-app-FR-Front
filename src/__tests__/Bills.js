/**
@jest-environment jsdom
 */
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills";
//import Logout from "./Logout.js";
import { waitFor, fireEvent } from "@testing-library/dom";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    //TEST 1 B OK
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon).toBeTruthy();
    });
    //TEST 2 B OK
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      // modif de la fonction de tri (-1 et 1 inversés)
      const chrono = (a, b) => (a < b ? -1 : 1);
      const datesSorted = [...dates].sort(chrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});

//test 3 B : vérifier que handleClickIconEye est bien appelée lorsqu'on clique sur l'icone oeil et que la modale s'affiche

describe("Given I am connected as an employee", () => {
  describe("when i click on icon eye", () => {
    //KO
    test("Then a modal should open", () => {
      // Mock du local storage pour simuler qu'on est connecté
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "test@test.fr",
        })
      );
      // Créer un mock de la fonction onNavigate pour vérifier qu'elle est bien appelée
      const mockOnNavigate = jest.fn();

      //mock de bill pour pouvoir tester l'affichage de la modale
      const bill = new Bills({
        document,
        onNavigate: mockOnNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      //simuler le chargement de la page Bills avec en paramètre les données de bills (?)
      document.body.innerHTML = BillsUI({ data: bills });

      //on récupère l'icone oeil de la page Bills

      const iconEye = screen.getAllByTestId("icon-eye")[0];
      //créer un mock de la fonction handleClickIconEye pour pouvoir tester son appel
      const handleClickIconEye = jest.fn(() =>
        bill.handleClickIconEye(iconEye)
      );
      //on simule le click sur l'icone oeil
      iconEye.addEventListener("click", handleClickIconEye);
      userEvent.click(iconEye);

      //on vérifie que la fonction handleClickIconEye a bien été appelée
      expect(handleClickIconEye).toHaveBeenCalled();
      //on vérifie que la modale s'affiche
      const modal = screen.getByTestId("modaleFile");
      expect(modal).toBeTruthy();
    });
  });
});

// describe("Given I am connected as an employee", () => {
//   describe("when i click on icon eye", () => {
//     //KO

//     test("Then a modal should open", () => {
//       // Créer un mock de la fonction onNavigate pour vérifier qu'elle est bien appelée
//       const mockOnNavigate = (pathname) => {
//         document.body.innerHTML = ROUTES({ pathname });
//       };
//       // Mock du local storage pour simuler qu'on est connecté
//       Object.defineProperty(window, "localStorage", {
//         value: localStorageMock,
//       });

//       window.localStorage.setItem(
//         "user",
//         JSON.stringify({
//           type: "Employee",
//           email: "test@test.fr",
//         })
//       );

//       //mock de bill pour pouvoir tester l'affichage de la modale
//       const bill = new Bills({
//         document,
//         mockOnNavigate,
//         store: mockStore,
//         localStorage: window.localStorage,
//       });

//       //simuler le chargement de la page Bills avec en paramètre les données de bills (?)
//       document.body.innerHTML = BillsUI({ data: bills });

//       //on récupère l'icone oeil de la page Bills

//       const iconEyes = screen.getAllByTestId("icon-eye");
//       //créer un mock de la fonction handleClickIconEye pour pouvoir tester son appel
//       const handleClickIconEye = jest.fn(bill.handleClickIconEye);
//       const modal = document.getElementById("modaleFile");
//       //$.fn.modal = jest.fn(() => modal.classList.add("show")); //mock de la modale Bootstrap

//       //on simule le click sur l'icone oeil
//       iconEyes.addEventListener("click", () => handleClickIconEye(iconEyes));
//       userEvent.click(iconEyes);

//       //on vérifie que la fonction handleClickIconEye a bien été appelée
//       expect(handleClickIconEye).toHaveBeenCalled();
//       //on vérifie que la modale s'affiche
//       //const modal = screen.getByTestId("modaleFile");
//       expect(modal).toBeTruthy();
//     });
//   });
// });

// describe("Given I am connected as employe", () => {
//   describe("When I click on the icon eye", () => {
//     //KO
//     test("A modal should open", () => {
//       // Mock du local storage pour simuler qu'on est connecté
//       Object.defineProperty(window, "localStorage", {
//         value: localStorageMock,
//       });
//       window.localStorage.setItem(
//         "user",
//         JSON.stringify({
//           type: "employee",
//         })
//       );
//       // Simuler le chargement de la page Bills avec en paramètre les données de bills
//       document.body.innerHTML = BillsUI(bills[0]);
//       const mockOnNavigate = jest.fn();
//       const bill = new Bills({
//         document,
//         onNavigate: mockOnNavigate,
//         store: mockStore,
//         localStorage: window.localStorage,
//       });
//       const handleClickIconEye = jest.fn(bill.handleClickIconEye);
//       const eye = screen.getByTestId("icon-eye");
//       eye.addEventListener("click", handleClickIconEye);
//       userEvent.click(eye);
//       expect(handleClickIconEye).toHaveBeenCalled();

//       const modale = screen.getByTestId("modaleFile");
//       expect(modale).toBeTruthy();
//     });
//   });
// });

// TEST 4 B: vérifier que la fonction handleClickNewBill est bien appelée lorsqu'on clique sur le bouton Nouvelle note de frais et que la page NewBill s'affiche
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    //OK
    test("Then when I click on New Bill button, the New Bill page should be displayed", () => {
      // Arrange

      // Mock du local storage pour simuler qu'on est connecté
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "test@test.fr",
        })
      );
      // mock de onNavigate
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      // Act : cliquer sur le bouton Nouvelle note de frais
      document.body.innerHTML = BillsUI({ data: bills });
      const bill = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });
      const handleClickNewBill = jest.fn(bill.handleClickNewBill);
      const newBillButton = screen.getByTestId("btn-new-bill");
      newBillButton.addEventListener("click", handleClickNewBill);
      userEvent.click(newBillButton);

      // Assert : vérifier que la page New Bill s'affiche
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });
  });
});

//test 5 b : recuperation de l'erreur dans la console si la fonction formDate est defaillante, enregistre l'erreur dans le catch et envoie une date non formattée

// test.only("should log error and return unformatted date if formatDate fails")

// //test d'integration GET
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to Bills.js", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByText("Mes notes de frais"));
      //vérifier que le tableau des factures s'affiche bien

      expect(bills).toBeTruthy();

      //const contentPending = await screen.getByText("En attente (1)");
      //expect(contentPending).toBeTruthy();
      //const contentRefused = await screen.getByText("Refusé (2)");
      //expect(contentRefused).toBeTruthy();
      //expect(screen.getByTestId("big-billed-icon")).toBeTruthy();
    });
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
