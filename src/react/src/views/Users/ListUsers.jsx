import { ConfigProvider, Table, Switch, Input, Row, Button, Modal } from "antd";
import es_ES from "antd/es/locale/es_ES";
import { useEffect, useState, useRef } from "react";
import axiosClient from "../../axios";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../../contexts/ContextProvider";

const onAvailabilityChange = (record, checked) => {
    axiosClient({
        url: `/user/active`,
        method: "POST",
        data: {
            active: checked,
            id: record.id,
        },
    })
        .then((response) => {
            record.active = checked;
            toast.success(response.data.message);
        })
        .catch((error) => {
            record.active = !checked;
            toast.error(error.data.message);
        });
};

const ListUsers = () => {
    const { currentUser } = useStateContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        const userId = userSelected.id;
        setUserPassword(resetUserPassword, userId);
    };
    const handleCancel = () => {
        setResetUserPassword("");
        setIsModalOpen(false);
    };

    const [userSelected, setUserSelected] = useState(null);
    const [resetUserPassword, setResetUserPassword] = useState("");
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const setUserPassword = (newPassword, userId) => {
        axiosClient({
            url: "/user/reset-password",
            method: "POST",
            data: {
                id: userId,
                newPassword: newPassword,
            },
        })
            .then((response) => {
                toast.success("Se ha actualizado la contraseña correctamente");
            })
            .catch((error) => {
                toast.error(error.meesage);
            })
            .finally(() => {
                setIsModalOpen(false);
                setResetUserPassword("");
            });
    };

    useEffect(() => {
        axiosClient({
            url: "/users/list",
        })
            .then((response) => {
                const usersSerialized = response.data.data.map((user) => {
                    user.active = user.active === 1 ? true : false;
                    user.mobile = user.mobile === null ? "" : user.mobile;
                    user.role_description =
                        user.role === "ADMIN" ? "Admin" : "Empleado";
                    return {
                        ...user,
                        surname: user.firstname + " " + user.secondname,
                    };
                });
                setData(usersSerialized);
                if (location.state?.success) {
                    toast.success(location.state.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleClick = () => {
        navigate("/user/nuevo");
    };

    const handleDoubleClick = (record) => {
        navigate(`/user/${record.id}`, { state: { user: record } });
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
            <Input
                refix={<SearchOutlined />}
                ref={searchInput}
                placeholder={"Buscar por ..."}
                value={selectedKeys[0]}
                onChange={(e) =>
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() =>
                    handleSearch(selectedKeys, confirm, dataIndex)
                }
                style={{ border: 0 }}
            />
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? "#1677ff" : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            className: "hidden",
        },
        {
            title: "Nombre",
            dataIndex: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Apellidos",
            dataIndex: "surname",
            ...getColumnSearchProps("surname"),
            sorter: (a, b) => a.surname.localeCompare(b.surname),
        },
        {
            title: "DNI",
            dataIndex: "dni",
            ...getColumnSearchProps("dni"),
            sorter: (a, b) => a.dni.localeCompare(b.dni),
            className: "hidden lg:table-cell",
        },
        {
            title: "Email",
            dataIndex: "email",
            ...getColumnSearchProps("email"),
            sorter: (a, b) => a.email.localeCompare(b.email),
            className: "hidden lg:table-cell",
        },
        {
            title: "Movil",
            dataIndex: "mobile",
            ...getColumnSearchProps("mobile"),
            sorter: (a, b) => a.mobile - b.mobile,
            className: "hidden lg:table-cell",
        },
        {
            title: "Rol",
            dataIndex: "role_description",
            filters: [
                {
                    text: "ADMIN",
                    value: "ADMIN",
                },
                {
                    text: "EMPLEADO",
                    value: "USER",
                },
            ],
            sorter: (a, b) => a.role.localeCompare(b.role),
            onFilter: (value, record) => record.role.indexOf(value) === 0,
            className: "hidden lg:table-cell",
        },
        {
            title: "Activo",
            filters: [
                {
                    text: "ACTIVO",
                    value: true,
                },
                {
                    text: "INACTIVO",
                    value: false,
                },
            ],
            sorter: (a, b) => a.active !== b.active,
            onFilter: (value, record) => record.active === value,
            render: (record) => (
                <Switch
                    defaultChecked={record.active}
                    onChange={(checked) =>
                        onAvailabilityChange(record, checked)
                    }
                />
            ),
        },
        {
            title: "Acciones",
            key: "icon",
            align: "center",
            render: (record) => (
                <img
                    src="/icon/password-icon.png"
                    style={{ width: "20px", height: "20px", margin: "auto" }}
                    onClick={() => {
                        showModal();
                        setUserSelected(record);
                    }}
                />
            ),
        },
    ];

    return (
        <ConfigProvider locale={es_ES}>
            <Modal
                title="Resetear contraseña"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Resetear contraseña"
                cancelText="Cancelar"
                okButtonProps={{
                    style: {
                        backgroundColor: "#1677ff",
                        color: "#fff",
                        boxShadow: "0 2px 0 rgba(5,145,255,.1)",
                    },
                }}
            >
                <Input
                    placeholder={"Nueva contraseña"}
                    className="input-antd-custom"
                    onChange={(e) => {
                        setResetUserPassword(e.target.value);
                    }}
                    value={resetUserPassword}
                />
            </Modal>
            {data.length > 0 && (
                <>
                    <ToastContainer />
                    <h1 className="pb-4 text-2xl">Listado de usuarios</h1>
                    <Row className="mb-4" justify="end">
                        <Button
                            icon={<PlusOutlined />}
                            className="button-antd-custom"
                            type="primary"
                            onClick={handleClick}
                        >
                            Nuevo Usuario
                        </Button>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={data}
                        onDoubleClick
                        onRow={(record) => ({
                            onDoubleClick: () => {
                                handleDoubleClick(record);
                            },
                        })}
                        rowKey="id"
                    />
                </>
            )}
        </ConfigProvider>
    );
};

export default ListUsers;
