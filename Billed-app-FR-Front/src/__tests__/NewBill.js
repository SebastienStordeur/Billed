/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage";
import Router from "../app/Router";
import mockedBills from "../__mocks__/store";

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
			const newBill = new NewBill({});
			const mockHandleChangeFile = jest.fn((e) =>
				newBill.handleChangeFile(e)
			);
		});

		//check if image format is ok

		//on submit, check if the bill is created

		test("When i submit the form, it should redirect the user to the bill page", () => {});
	});
});
