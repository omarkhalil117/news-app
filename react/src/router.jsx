import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Sources from "./pages/Sources/Sources";
import Register from "./pages/Register/Register";
import { Outlet, createBrowserRouter } from "react-router-dom";
import TopSources from "./pages/TopSources/TopSources";
import Logs from "./pages/Logs/Logs";

function Layout() {
    return (
        <>
        <Navbar/>
        <Outlet/>
        <Footer/>
        </>
    )
}


const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: '/home',
                element: <Home/>
            },
            {
                path: '/sources',
                element: <Sources/>
            },
            {
                path: '/top-sources',
                element: <TopSources/>
            },
            {
                path: '/logs',
                element: <Logs/>
            }
        ]
    },
    {
        path:'/',
        element: <Login/> 
    },
    {
        path:'/register',
        element:<Register/>
    },
]);

export default router;