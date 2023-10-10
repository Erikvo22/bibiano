import { Table, Switch, Button, Input, Space } from 'antd';
import { useEffect, useState, useRef} from 'react';
import axiosClient from '../../axios';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const onAvailabilityChange = (record) => {
  record.activo = !record.activo;
}

const ListUsers = () => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [data, setData] = useState([]);

  const handleSearch = (
    selectedKeys,
    confirm,
    dataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const getColumnSearchProps = (dataIndex)  => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <Input
          refix={<SearchOutlined/>}
          ref={searchInput}
          placeholder={'Buscar por ...'}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{border: 0}}
        />
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Apellidos',
      dataIndex: 'surname',
      ...getColumnSearchProps('surname'),
      sorter: (a, b) => a.surname.localeCompare(b.surname)
    },
    {
      title: 'DNI',
      dataIndex: 'dni',
      ...getColumnSearchProps('dni'),
      sorter: (a, b) => a.dni.localeCompare(b.dni),
      className: 'hidden lg:table-cell',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
      sorter: (a, b) => a.email.localeCompare(b.email),
      className: 'hidden lg:table-cell',
    },
    {
      title: 'Movil',
      dataIndex: 'movil',
      ...getColumnSearchProps('movil'),
      sorter: (a, b) => a.movil - b.movil,
      className: 'hidden lg:table-cell',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      filters: [ 
        {
          text: 'ADMIN',
          value: 'ADMIN',
        },
        {
          text: 'USER',
          value: 'USER',
        }
      ],
      sorter: (a, b) => a.role.localeCompare(b.role),
      onFilter: (value, record) => record.role.indexOf(value) === 0,
      className: 'hidden lg:table-cell',
    },
    {
      title: 'Activo',
      filters: [ 
        {
          text: 'ACTIVO',
          value: true,
        },
        {
          text: 'INACTIVO',
          value: false,
        }
      ],
      sorter: (a, b) => a.active !== b.active,
      onFilter: (value, record) => record.active === value,
      render: (record) => (
        <Switch defaultChecked={record.active} onClick={() => onAvailabilityChange(record)}/>
      ),
    },
  ];

  useEffect(() => {
    axiosClient({
      url: "/users/list",
    })
      .then((response) => {
        const usersSerialized = response.data.data.map((user) => { 
          user.active =  user.active === 1 ? true : false; 
          return {
            ...user,
            'surname': user.firstname+' '+user.secondname,
          };
        });
        setData(usersSerialized);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setData]);

  return (
    <>
      <h1 className='pb-4 text-2xl'>Listado de usuarios</h1>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"/>
    </>
  );
};

export default ListUsers;