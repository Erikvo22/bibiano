import { createBrowserRouter } from "react-router-dom";
import Login from "./views/login.jsx";
import Home from "./views/Home/Home.jsx";
import ListUsers from "./views/Users/ListUsers.jsx";
import Dashboard from "./views/Dashboard/Dashboard.jsx";
import FormUser from "./views/Users/FormUser.jsx";

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
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/users',
                element: <ListUsers />
            },
            {
                path: '/user/:user_id',
                element: <FormUser />
            },
        ]
    },
])

export default router;