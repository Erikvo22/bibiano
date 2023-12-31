import { createBrowserRouter } from "react-router-dom";
import Login from "./views/login.jsx";
import Home from "./views/Home/Home.jsx";
import ListUsers from "./views/Users/ListUsers.jsx";
import Dashboard from "./views/Dashboard/Dashboard.jsx";
import FormUser from "./views/Users/FormUser.jsx";
import MyClocks from "./views/MyClocks/MyClocks.jsx";
import ListUsersClocks from "./views/Users/ListUsersClocks.jsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/my-clocks",
                element: <MyClocks />,
            },
            {
                path: "/users",
                element: <ListUsers />,
            },
            {
                path: "/history-clocks",
                element: <ListUsersClocks />,
            },
            {
                path: "/user/:user_id",
                element: <FormUser />,
            },
        ],
    },
]);

export default router;
