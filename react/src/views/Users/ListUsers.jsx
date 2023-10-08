import { Table, Switch} from 'antd';

const columns = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Apellidos',
    dataIndex: 'surname',
    key: 'surname',
  },
  {
    title: 'DNI',
    dataIndex: 'dni',
    key: 'dni',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Movil',
    dataIndex: 'movil',
    key: 'movil',
  },
  {
    title: 'Rol',
    dataIndex: 'rol',
    key: 'rol',
  },
  {
    title: 'Activo',
    key: 'action',
    render: (record) => (
      <Switch defaultChecked={record.activo} onClick={() => onAvailabilityChange(record)}/>
    ),
  },
];
const data = [
  {
    id: '1',
    name: 'Antonio',
    surname: 'Arjonilla',
    rol: 'Empleado',
    email: 'aarjones@arjonilla.com',
    movil: '1234567890',
    dni: '43106145X',
    activo: true,
    key: 1
  },
  {
    id: '1',
    name: 'John',
    surname: 'Brown',
    rol: 'Administrador',
    email: 'aarjones@arjonilla.com',
    movil: '1234567890',
    dni: '12345678C',
    activo: false,
    key : 2
  },
];

const onAvailabilityChange = (record) => {
  record.activo = !record.activo;
}
const ListUsers = () => {
  return (
    <>
      <h2 className='pb-4'>Listado de usuarios</h2>
      <Table
        columns={columns}
        dataSource={data}/>
    </>
  );
};

export default ListUsers;