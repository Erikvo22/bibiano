import { createBrowserRouter } from "react-router-dom";
import Login from "./views/login.jsx";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    }
])

export default router;