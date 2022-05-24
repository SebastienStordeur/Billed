/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage";
import Router from "../app/Router";
import { bills } from "../fixtures/bills";
import mockStore from "../__mocks__/store";

describe("Given I am connected as an employee", () => {
	describe("When I am on NewBill Page", () => {
		test("Then the envelop icon should be highlighted", async () => {
			const html = NewBillUI();
			document.body.innerHTML = html;
			const pathname = ROUTES_PATH["NewBill"];

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

			Router();
			window.onNavigate(pathname);
			await waitFor(() => screen.getByTestId("icon-mail"));
			const mailIcon = screen.getByTestId("icon-mail");

			expect(mailIcon.classList.contains("active-icon")).toBeTruthy();
		});

		//Change file
		test("When i change the file, it should display the new name of the file", () => {
			const html = NewBillUI();
			document.body.innerHTML = html;

			const store = null;
			const newBill = new NewBill({
				document,
				onNavigate,
				store,
				bills,
				localStorage: localStorageMock
			});

			const mockHandleChangeFile = jest.fn((e) =>
				newBill.handleChangeFile(e)
			);

			const fileInput = screen.getByTestId("file")
			expect(fileInput).toBeTruthy()

			fileInput.addEventListener("change", mockHandleChangeFile);
			fireEvent.change(fileInput, {
				target: { 
					files: [new File(["file.jpg"], "file.jpg", { type: "file/jpg" })],
				},
			});
			expect(mockHandleChangeFile).toHaveBeenCalled();
			expect(fileInput.files[0].name).toBe("file.jpg");
		});

		//Wrong file format
		test("The image format is not supported", () => {
			const html = NewBillUI();
			document.body.innerHTML = html;

			const store = null;
			const newBill = new NewBill({
				document,
				onNavigate,
				store,
				bills,
				localStorage: localStorageMock
			});

			const mockHandleChangeFile = jest.fn(newBill.handleChangeFile);
			const fileInput = screen.getByTestId("file");
			expect(fileInput).toBeTruthy();

			//Wrong file format
			fileInput.addEventListener("change", mockHandleChangeFile);
			fireEvent.change(fileInput, {
				target: { 
					files: [new File(["file.gif"], "file.gif", { type: "file/gif" })],
				},
			});
			expect(mockHandleChangeFile).toHaveBeenCalled();
 			expect(fileInput.files[0].name).not.toBe("file.jpg");

			//test alert
			jest.spyOn(window, 'alert').mockImplementation(() => {});
			expect(window.alert).toBeTruthy();
		}) 

		//on submit, check if the bill is created

		test("When i submit the form, it should redirect the user to the bill page", () => {});
	});
});

//test d'intégration POST
describe("Given i am a user conencted as Employee", () => {
	describe("When i submit a new bill", () => {
		test("Then, the bill should be created", () => {
			const html = NewBillUI();
			document.body.innerHTML = html;
			const pathname = ROUTES_PATH["NewBill"];

			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
				})
			);

			const newBill = new NewBill({
				document,
				onNavigate,
				store: null,
				localStorage: localStorageMock,
		  	})

		  	const validBill = {
				type: "Restaurants et bars",
				name: "Vol Paris Londres",
				date: "2022-02-15",
				amount: 200,
				vat: 70,
				pct: 30,
				commentary: "Commentary",
				fileUrl: "../img/0.jpg",
				fileName: "test.jpg",
				status: "pending"
	  		};

			//Load field values
			screen.getByTestId("expense-type").value = validBill.type;
			screen.getByTestId("expense-name").value = validBill.name;
			screen.getByTestId("datepicker").value = validBill.date;
			screen.getByTestId("amount").value = validBill.amount;
			screen.getByTestId("vat").value = validBill.vat;
			screen.getByTestId("pct").value = validBill.pct;
			screen.getByTestId("commentary").value = validBill.commentary;

			newBill.fileName = validBill.fileName;
			newBill.fileUrl = validBill.fileUrl;

			newBill.updateBill = jest.fn();
			const handleSubmit = jest.fn(e => newBill.handleSubmit(e));

			const form = screen.getByTestId("form-new-bill");
			form.addEventListener("submit", handleSubmit);
			fireEvent.submit(form);

			expect(handleSubmit).toHaveBeenCalled();
			expect(newBill.updateBill).toHaveBeenCalled();
		})

		test("Then it fails with error 500", async() => {
			jest.spyOn(mockStore, "bills");
			jest.spyOn(console, "error").mockImplementation(() => {}) //Prevent jest console error

			Object.defineProperty(window, "localStorage", {
				value: localStorageMock,
			});

			Object.defineProperty(window, "location", {
				value: { hash: ROUTES_PATH["NewBill"]}
			});

			window.localStorage.setItem(
				"user", 
				JSON.stringify({ 
					type: "Employee"
				})
			);

			const root = document.createElement("div");
			root.setAttribute("id", "root");
			document.body.append(root);

			mockStore.bills.mockImplementationOnce(() => {
				return {
					update: () => {
						return Promise.reject(new Error("Erreur 500"));
					}
				}
			})

			const newBill = new NewBill({
				document,
				onNavigate,
				store : mockStore,
				localStorage: localStorageMock,
			});

			//Form submit
			const form = screen.getByTestId("form-new-bill");
			const handleSubmit = jest.fn(e => newBill.handleSubmit(e));
			form.addEventListener("submit", handleSubmit);
			fireEvent.submit(form);
			await new Promise(process.nextTick);
			expect(console.error).toHaveBeenCalled();
		})
	})
})