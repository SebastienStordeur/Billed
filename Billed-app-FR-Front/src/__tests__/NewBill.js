/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage";
import Router from "../app/Router";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the envelop icon should be highlighted", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const pathname = ROUTES_PATH["NewBill"];
      //to-do write assertion

      //Build DOM
      Object.defineProperty(window, "location", {
        value: {
          path: pathname,
        },
      });

      Router();

      expect(
        screen
          .getByTestId("icon-mail")
          .classList.contains("active-icon")
          .toBeTruthy()
      );
    });

    test("When i change the file, it should display the new name of the file", () => {});

    test("When i submit the form, it should redirect the user to the bill page", () => {});
  });
});
