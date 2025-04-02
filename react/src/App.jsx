import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import router from './router';
import { UserProvider } from "../contexts/UserContext";
function App() {
  return (
    <>
    <UserProvider>
      <RouterProvider router={router} />
      <ToastContainer/>
    </UserProvider>
    </>
  );
}

export default App;
