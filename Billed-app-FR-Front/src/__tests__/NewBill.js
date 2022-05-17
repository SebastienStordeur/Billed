/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage";
import Router from "../app/Router";
import mockedBills from "../__mocks__/store";
import { bills } from "../fixtures/bills";

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

		//check if image format is ok

		//on submit, check if the bill is created

		test("When i submit the form, it should redirect the user to the bill page", () => {});
	});
});
