import { createBrowserRouter } from "react-router-dom";
import Login from "./views/login.jsx";
import Home from "./views/Home/Home.jsx";
import ListUsers from "./views/Users/ListUsers.jsx";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <Home />,
        children: [
            {
                path: '/Users',
                element: <ListUsers />
            }
        ]
    },
])

export default router;