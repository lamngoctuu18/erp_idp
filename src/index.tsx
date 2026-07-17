import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { registerLicense } from "@syncfusion/ej2-base";
import { MantineColorsTuple, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import "./index.css";

// Bảng màu xanh thương hiệu Tấn Phát (khớp màu logo) — dùng làm màu chính.
// Nền mặc định vẫn là trắng → toàn hệ thống 2 tông: trắng + xanh.
const brandBlue: MantineColorsTuple = [
  "#eef4ff",
  "#dce7fb",
  "#b6ccf3",
  "#8daeec",
  "#6a95e6",
  "#5385e2",
  "#437ce1", // shade 6 — tông xanh chủ đạo của logo
  "#3269c8",
  "#295db4",
  "#1a4fa0",
];

const theme = createTheme({
  primaryColor: "brand",
  primaryShade: 6,
  white: "#ffffff",
  colors: {
    brand: brandBlue,
  },
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
