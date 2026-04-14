import { Module } from "asab_webui_components";

import { TableScreen } from "./TableScreen.jsx";
import { DetailScreen } from "./DetailScreen.jsx";
import { CustomScreen } from "./CustomScreen.jsx";

export default class TableApplicationModule extends Module {
  constructor(app, name) {
    super(app, "TableApplicationModule");

    app.Router.addRoute({
      path: "/",
      end: false,
      name: "Table",
      component: TableScreen,
    });

    app.Navigation.addItem({
      name: "Table",
      icon: "bi bi-table",
      url: "/",
    });

    app.Router.addRoute({
      path: "/detail/:id",
      name: "Detail",
      component: DetailScreen,
    });

	app.Router.addRoute({
      path: "/custom",
      name: "Space",
      component: CustomScreen,
    });

    app.Navigation.addItem({
      name: "Custom",
      icon: "bi bi-star",
      url: "/custom",
    });
  }
}
