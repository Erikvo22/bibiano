import React from "react";
import { Table } from "antd";

const ListUsersClocks = () => {
    [filters, setFilters] = useState({
        page: 0,
        limit: 10,
        filters: {},
    });

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
        // ...
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
        <div>
            <h1>Listado de fichaje de usuarios</h1>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default ListUsersClocks;
