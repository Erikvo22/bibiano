import React, { useState } from "react";
import { Table, Row, Col, Button } from "antd";
import { DocumentTextIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import axiosClient from "../../axios";
const ListUsersClocks = () => {
    const [filters, setFilters] = useState({
        page: 0,
        limit: 10,
        filters: {},
    });

    const downloadHistoryClocks = () => {
        axiosClient({
            url: "/clocks/history",
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al descargar el informe");
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Controlhorario.xlsx";
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    const data = [
        {
            id: 1,
            date: "2021-10-01",
            userName: "John Doe",
            entryTime: "08:00",
            exitTime: "17:00",
            workedTime: "09:00",
        },
        {
            id: 2,
            date: "2021-10-02",
            userName: "Jane Smith",
            entryTime: "09:00",
            exitTime: "18:00",
            workedTime: "09:00",
        },
    ];

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            className: "hidden",
        },
        {
            title: "Fecha",
            dataIndex: "date",
        },
        {
            title: "Empleado",
            dataIndex: "userName",
        },
        {
            title: "Hora entrada",
            dataIndex: "entryTime",
        },
        {
            title: "Hora salida",
            dataIndex: "exitTime",
        },
        {
            title: "Tiempo trabajado",
            dataIndex: "workedTime",
        },
    ];
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
            <Table columns={columns} dataSource={data} />
        </>
    );
};

export default ListUsersClocks;
