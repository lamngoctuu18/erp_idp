import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { registerLicense } from "@syncfusion/ej2-base";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import "./index.css";

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  fontFamilyMonospace: "Consolas, Monaco, Courier New, monospace",
  headings: {
    fontFamily: "Inter, sans-serif",
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Registering Syncfusion license key
registerLicense(
  "Mgo+DSMBMAY9C3t2UVhhQlVFfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5RdERiXXtfc3BVQmFV"
);

// MjM5MkAzMjM0MkUzMTJFMzlZRnNmeEdKa0haRGU0S0MyZUR3b05vcDJFNURBbnFRTi9STUVidExydWswPQ==
// ORg4AjUWIQA/Gnt2UVhhQlVFfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5Qd0ViWH1ecnJQRWJd
// Mgo+DSMBMAY9C3t2UVhhQlVFfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5RdERiXXtfc3BVQmFV

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications position="top-center" autoClose={3000} />
        <App />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
reportWebVitals();
