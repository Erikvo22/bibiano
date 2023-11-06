import React, { useEffect, useState, useRef } from "react";
import { Table, Row, Col, Button, DatePicker, Select } from "antd";
import { DocumentTextIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import axiosClient from "../../axios";
import moment from "moment";
const ListUsersClocks = () => {
    const rangePickerRef = useRef();
    const [users, setUsers] = useState([
        {
            value: "todos",
            label: "Todos",
        },
    ]);
    const [filters, setFilters] = useState({
        page: 0,
        limit: 10,
    });
    const [dataFormated, setDataFormated] = useState([]);
    const [selectedUser, setSelectedUser] = useState("todos");
    const [selectedDates, setSelectedDates] = useState([null, null]);

    const downloadHistoryClocks = () => {
        axiosClient({
            url: "/clocks/history",
            method: "GET",
            responseType: "blob",
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
                a.download = "clocking_report.pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
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
                            const entryTime = entry.E.split(" ")[1];
                            const exitTime = entry.S.split(" ")[1];
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
                // usersSerialized.unshift({
                //     value: "todos",
                //     label: "Todos",
                // });
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
        },
        {
            title: "Hora salida",
            dataIndex: "exitTime",
            key: "exitTime",
        },
        {
            title: "Tiempo trabajado",
            dataIndex: "workedTime",
            key: "workedTime",
        },
    ];

    const handleUserChange = (value) => setSelectedUser(value);
    const handleDateChange = (dates, dateString) => {
        setSelectedDates(dateString);
    };
    const dateFormat = "YYYY/MM/DD";
    const { RangePicker } = DatePicker;
    return (
        <>
            <h1 className="pb-4 text-2xl">Historial de fichajes</h1>
            <Row className="mb-2">
                <Col span={12} className="flex items-center justify-start">
                    <Button
                        onClick={() => {}}
                        icon={
                            <AdjustmentsIcon
                                className="w-5 h-5"
                                style={{ color: "green" }}
                            />
                        }
                        className="border-0 bg-transparent"
                    ></Button>
                </Col>
                <Col span={12} className="flex items-center justify-end">
                    <Button
                        onClick={downloadHistoryClocks}
                        icon={
                            <DocumentTextIcon
                                className="w-5 h-5"
                                style={{ color: "green" }}
                            />
                        }
                        className="border-0 bg-transparent"
                    ></Button>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col span={24} className="flex items-center justify-start">
                    <RangePicker
                        showNow
                        format={dateFormat}
                        onChange={handleDateChange}
                        className="mr-4"
                    />
                    <Select
                        showSearch
                        placeholder="Selecciona un empleado"
                        optionFilterProp="children"
                        options={users}
                        onChange={handleUserChange}
                        className="mr-4 min-w-[100px] max-w-[300px]"
                        defaultValue="todos"
                    />
                    <Button
                        type="primary"
                        className="button-antd-custom mr-2 full-width-button"
                        onClick={() => {
                            let sendFilters = {};

                            if (selectedUser !== "todos") {
                                sendFilters.user = selectedUser;
                            }

                            if (selectedDates[0] !== null) {
                                sendFilters.startDate =
                                    selectedDates[0].replace(/\//g, "-");
                            }
                            if (selectedDates[1] !== null) {
                                sendFilters.endDate = selectedDates[1].replace(
                                    /\//g,
                                    "-"
                                );
                            }
                            if (Object.keys(sendFilters).length > 0) {
                                setFilters({ ...filters, ...sendFilters });
                            } else {
                                setFilters(filters);
                            }
                        }}
                    >
                        Buscar
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={dataFormated} />
        </>
    );
};

export default ListUsersClocks;
