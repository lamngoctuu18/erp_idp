import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./_setup/router/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css"; // CSS bảng MRT — bắt buộc import 1 lần ở app root
//import "@mantine/carousel/styles.css";

function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
