import { getValue } from "../helpers";
import { addListenerFor } from "./listeners";

const Transporter = getValue("simcapi.Transporter", window);

const VIEWER = "VIEWER";
const AUTHOR = "AUTHOR";

const setBooleanIn = capiModel => ({ key, to: value }) => {
  capiModel.set(key, value);
};

const toggleContext = capiModel => () => {
  console.log(Transporter);
  if (Transporter) {
    capiModel.set("simContext", Transporter.getConfig().context);
  }

  console.log("Toggle Context");

  switch (capiModel.get("simContext")) {
    case VIEWER:
      setBooleanIn(capiModel)({ to: true, key: "studentMode" });
      setBooleanIn(capiModel)({ to: false, key: "authorMode" });
      setBooleanIn(capiModel)({ to: false, key: "reviewMode" });
      break;
    case AUTHOR:
      setBooleanIn(capiModel)({ to: true, key: "authorMode" });
      setBooleanIn(capiModel)({ to: false, key: "studentMode" });
      setBooleanIn(capiModel)({ to: false, key: "reviewMode" });
      break;
    default:
      console.log("Unsupported context received");
  }
};

export const bindEvents = capiModel => {
  addListenerFor({
    key: "toggleContext",
    action: toggleContext(capiModel),
    capiModel
  });
};
