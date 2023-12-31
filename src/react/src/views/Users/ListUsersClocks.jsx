import { useEffect, useState } from "react";
import {
    Table,
    Row,
    Col,
    Button,
    DatePicker,
    Select,
    ConfigProvider,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import {
    DocumentTextIcon,
    AdjustmentsIcon,
    ChartSquareBarIcon,
} from "@heroicons/react/outline";
import axiosClient from "../../axios";
import es_ES from "antd/es/locale/es_ES";
import dayjs from "dayjs";
import moment from "moment";

const DATE_FORMAT = "DD/MM/YYYY";

const ListUsersClocks = () => {
    const [showFilters, setShowFilters] = useState(null);
    const [users, setUsers] = useState([
        {
            value: "todos",
            label: "Todos",
        },
    ]);
    const [filters, setFilters] = useState({
        page: 0,
        limit: 10,
        startDate: dayjs().subtract(1, "month").format(DATE_FORMAT),
        endDate: dayjs().format(DATE_FORMAT),
    });
    const [dataFormated, setDataFormated] = useState([]);
    const [selectedUser, setSelectedUser] = useState("todos");
    const [selectedDates, setSelectedDates] = useState([
        dayjs().subtract(1, "month").format(DATE_FORMAT),
        dayjs().format(DATE_FORMAT),
    ]);

    const handleDefaultValue = () => [dayjs().subtract(1, "month"), dayjs()];
    const handleUserChange = (value) => setSelectedUser(value);
    const handleDateChange = (dates, dateString) => {
        setSelectedDates(dateString);
    };

    const { RangePicker } = DatePicker;

    const downloadHistoryClocksPdf = () => {
        axiosClient({
            url: "/clocks/history/pdf",
            method: "GET",
            responseType: "blob",
            params: filters,
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Error al descargar el informe");
                }
                return response.data;
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download =
                    "informe_fichajes_" + moment().format("DDMMYYYY") + ".pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const downloadHistoryClocksCsv = () => {
        axiosClient({
            url: "/clocks/history/csv",
            method: "GET",
            responseType: "blob",
            params: filters,
        })
            .then((response) => {
                console.log(response);
                const blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download =
                    "informe_fichajes_" + moment().format("DDMMYYYY") + ".csv";
                link.click();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        const dataFormated = [];

        axiosClient({
            url: "/clocks/history/list",
            method: "GET",
            responseType: "json",
            params: filters,
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Error al obtener los datos");
                }

                let idCounter = 1;

                const data = response.data.data;
                for (const userName in data) {
                    const userEntries = data[userName];

                    for (const date in userEntries) {
                        const entries = userEntries[date].hour;

                        entries.forEach((entry) => {
                            const entryTime = entry.E && entry.E.split(" ")[1];
                            const exitTime = entry.S && entry.S.split(" ")[1];
                            const workedTime = entry.TOTAL;

                            dataFormated.push({
                                id: idCounter,
                                date,
                                userName,
                                entryTime,
                                exitTime,
                                workedTime,
                            });

                            idCounter++;
                        });
                    }
                }
                setDataFormated(dataFormated);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [filters]);

    useEffect(() => {
        axiosClient({
            url: "/users/list",
        })
            .then((response) => {
                const usersSerialized = response.data.data.map((user) => {
                    return {
                        value: user.id,
                        label: `${user.name} ${user.firstname} ${user.secondname}`,
                    };
                });
                setUsers([...users, ...usersSerialized]);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            className: "hidden",
            key: "id",
        },
        {
            title: "Fecha",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Empleado",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "Hora entrada",
            dataIndex: "entryTime",
            key: "entryTime",
            className: "hidden lg:table-cell",
        },
        {
            title: "Hora salida",
            dataIndex: "exitTime",
            key: "exitTime",
            className: "hidden lg:table-cell",
        },
        {
            title: "Tiempo trabajado",
            dataIndex: "workedTime",
            key: "workedTime",
        },
    ];

    return (
        <ConfigProvider locale={es_ES}>
            <h1 className="pb-4 text-2xl">Historial de fichajes</h1>
            <Row className="mb-2">
                <Col span={12} className="flex items-center justify-start">
                    {!showFilters && (
                        <Button
                            onClick={() => {
                                setShowFilters(!showFilters);
                            }}
                            icon={
                                <SettingOutlined
                                    className="w-5 h-5"
                                    style={{ color: "green" }}
                                />
                            }
                            className="border-0 bg-transparent"
                        ></Button>
                    )}
                    {showFilters && (
                        <Button
                            onClick={() => {
                                setShowFilters(!showFilters);
                            }}
                            icon={
                                <AdjustmentsIcon
                                    className="w-5 h-5"
                                    style={{ color: "green" }}
                                />
                            }
                            className="border-0 bg-transparent"
                        ></Button>
                    )}
                </Col>
                <Col span={12} className="flex items-center justify-end">
                    <Button
                        onClick={downloadHistoryClocksPdf}
                        icon={
                            <DocumentTextIcon
                                className="w-5 h-5"
                                style={{ color: "green" }}
                            />
                        }
                        className="border-0 bg-transparent"
                    ></Button>
                    <Button
                        onClick={downloadHistoryClocksCsv}
                        icon={
                            <ChartSquareBarIcon
                                className="w-5 h-5"
                                style={{ color: "green" }}
                            />
                        }
                        className="border-0 bg-transparent"
                    ></Button>
                </Col>
            </Row>

            {showFilters && (
                <Row className="mb-4">
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={{ span: 8 }}
                        className="flex flex-col justify-start mb-2 mr-2"
                    >
                        <label className="mb-1">Buscador entre fechas:</label>
                        <RangePicker
                            showNow={true}
                            format={DATE_FORMAT}
                            onChange={handleDateChange}
                            defaultValue={handleDefaultValue}
                            style={{ width: "100%" }}
                        />
                    </Col>

                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={{ span: 8 }}
                        className="flex flex-col justify-start mb-2 mr-2"
                    >
                        <label className="mb-1">Empleado:</label>
                        <Select
                            showSearch
                            placeholder="Selecciona un empleado"
                            optionFilterProp="children"
                            options={users}
                            onChange={handleUserChange}
                            className="min-w-[200px]"
                            defaultValue="todos"
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={{ span: 6 }}
                        className="flex flex-col justify-start mb-2"
                    >
                        <label className="mb-1"> </label>
                        <Button
                            type="primary"
                            className="button-antd-custom lg:max-w-lg md:mt-5"
                            onClick={() => {
                                let sendFilters = {};
                                let updatedFiltersUser =
                                    selectedUser === "todos"
                                        ? (({ ...rest }) => rest)(filters)
                                        : { ...filters, user: selectedUser };

                                if (selectedDates[0] !== "") {
                                    sendFilters.startDate = selectedDates[0];
                                }

                                if (selectedDates[1] !== "") {
                                    sendFilters.endDate = selectedDates[1];
                                }

                                if (Object.keys(sendFilters).length > 0) {
                                    setFilters({
                                        ...updatedFiltersUser,
                                        ...sendFilters,
                                    });
                                } else {
                                    setFilters(updatedFiltersUser);
                                }
                            }}
                        >
                            Buscar
                        </Button>
                    </Col>
                </Row>
            )}

            <Table columns={columns} dataSource={dataFormated} scroll={{ x: 500 }} />
        </ConfigProvider>
    );
};

export default ListUsersClocks;
