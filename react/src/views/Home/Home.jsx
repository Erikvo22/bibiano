import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Image, Modal } from "antd";
import {
    UserIcon,
    ClockIcon,
    ChevronRightIcon,
    MenuAlt3Icon,
    HomeIcon,
    ArrowSmLeftIcon,
    DocumentIcon,
} from "@heroicons/react/outline";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios";

import "./home.css";

const Home = () => {
    const { currentUser, userToken, setCurrentUser, setUserToken } =
        useStateContext();
    const [collapsed, setCollapsed] = useState(true);
    const { Header, Sider, Content } = Layout;
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient({
            url: "/user/getInfoUser",
            method: "GET",
        })
            .then((response) => {
                setCurrentUser(response.data.data);
            })
            .catch((error) => {
                Modal.error({
                    title: "Ha ocurrido un error inesperado",
                    content:
                        "Inténtalo más tarde o contacta con el administrador",
                    okButtonProps: {
                        style: { background: "green", color: "white" },
                    },
                });
            });
    }, []);

    const logout = () => {
        axiosClient({
            url: "/logout",
            method: "POST",
        })
            .then((response) => {
                setUserToken(null);
                navigate("/login");
            })
            .catch((error) => {
                Modal.error({
                    title: "Ha ocurrido un error inesperado",
                    content:
                        "Inténtalo más tarde o contacta con el administrador",
                    okButtonProps: {
                        style: { background: "green", color: "white" },
                    },
                });
            });
    };

    const itemsAdmin = [
        {
            key: "1",
            label: "Inicio",
            target: "/dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
        },
        {
            key: "2",
            label: "Mis fichajes",
            target: "/my-clocks",
            icon: <ClockIcon className="w-5 h-5" />,
        },
        {
            key: "3",
            label: "Usuarios",
            target: "/users",
            icon: <UserIcon className="w-5 h-5" />,
        },
        {
            key: "4",
            label: "Informes",
            target: "/history-clocks",
            icon: <DocumentIcon className="w-5 h-5" />,
        },
        {
            key: "5",
            label: "Cerrar sesión",
            onClick: logout,
            icon: <ArrowSmLeftIcon className="w-5 h-5" />,
        },
    ];

    const itemsUser = [
        {
            key: "1",
            label: "Inicio",
            target: "/dashboard",
            icon: <HomeIcon className="w-5 h-5" />,
        },
        {
            key: "2",
            label: "Mis fichajes",
            target: "/my-clocks",
            icon: <ClockIcon className="w-5 h-5" />,
        },
        {
            key: "3",
            label: "Cerrar sesión",
            onClick: logout,
            icon: <ArrowSmLeftIcon className="w-5 h-5" />,
        },
    ];

    const handleMenuClick = ({ key }) => {
        const items = currentUser.role == "ADMIN" ? itemsAdmin : itemsUser;
        const itemClicked = items.find((item) => item.key === key);
        itemClicked?.target && navigate(itemClicked.target);
    };

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout className="min-h-screen">
            <Sider
                width={250}
                trigger={null}
                collapsible
                collapsed={collapsed}
                onCollapse={(c, t) => toggleCollapsed()}
                className="ant-side-custom"
            >
                <Layout className="h-16 flex justify-center items-center green-app">
                    <Image
                        src="/logotipo.svg"
                        preview={false}
                        style={{ width: "6em", height: "4em", padding: "6px" }}
                    />
                </Layout>
                <Layout>
                    <Layout
                        className={
                            collapsed
                                ? "flex items-center justify-center green-app"
                                : "flex items-end justify-center green-app"
                        }
                    >
                        <Button
                            style={{
                                border: "none",
                                backgroundColor: "none",
                                boxShadow: "none",
                                color: "white",
                            }}
                            onClick={toggleCollapsed}
                        >
                            {collapsed ? (
                                <ChevronRightIcon className="w-4 h-4" />
                            ) : (
                                <MenuAlt3Icon className="w-4 h-4" />
                            )}
                        </Button>
                    </Layout>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={["0"]}
                        items={
                            currentUser.role == "ADMIN" ? itemsAdmin : itemsUser
                        }
                        onClick={handleMenuClick}
                        inlineCollapsed={collapsed}
                    />
                </Layout>
            </Sider>
            <Layout>
                <Header
                    style={{ backgroundColor: "whitesmoke", padding: 0 }}
                ></Header>
                <Content className="pr-8 pl-8 m-0 ml-20">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
