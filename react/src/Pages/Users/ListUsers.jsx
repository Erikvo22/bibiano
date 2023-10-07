import React from 'react';
import { Space, Table} from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Surname',
    dataIndex: 'surname',
    key: 'surname',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Rol',
    dataIndex: 'rol',
    key: 'rol',
  },
  {
    title: 'Movil',
    dataIndex: 'movil',
    key: 'movil',
  },
  {
    title: 'DNI',
    dataIndex: 'dni',
    key: 'dni',
  },
  {
    title: 'Accion',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Desactivar</a>
      </Space>
    ),
  },
];
const data = [
  {
    id: '1',
    name: 'Antonio',
    surname: 'Arjonilla',
    rol: 'EMPLOYEE',
    dni: '43106145X',
  },
  {
    id: '1',
    name: 'John',
    surname: 'Brown',
    rol: 'ADMIN',
    dni: '12345678C',
  },
];
const ListUsers = () => {
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}/>
    </div>
  );
};

export default ListUsers;