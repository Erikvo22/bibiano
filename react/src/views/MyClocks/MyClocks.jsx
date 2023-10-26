import React, { useState, useEffect, useRef } from 'react';
import { Layout, Input, Typography, Row, Table, Col } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { ArrowSmRightIcon, ArrowSmLeftIcon } from '@heroicons/react/outline';
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../axios";
import moment from 'moment';

const { Text } = Typography;
const { Title } = Typography;

const MyClocks = () => {
  const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [user, setUser] = useState('');
  const [clocks, setClocks] = useState([]);
  const navigate = useNavigate();

  if (!userToken) {
    navigate('/login');
  }

  useEffect(() => {
    if (userToken) {
      getClocks();
    }
  }, []);

  const getClocks = () => {
    axiosClient({
      url: "/clocks/all",
      method: "GET"
    })
      .then((response) => {
          setClocks(response.data.data);
          setUser(response.data.user);
      })
      .catch((error) => {});
  }

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
        title: "Día",
        dataIndex: "day",
        sorter: (a, b) => a.day.localeCompare(b.day),
        render: (day) => (
          <p>{moment(day).format('dddd, DD/MM/YYYY')}</p>
        ),
    },
    {
        title: "Fichajes",
        dataIndex: "dates",
        render: (dates) => (
          <div>
            {dates.map((date, index) => (
                <div key={index}>
                    <p className='inline-flex'>
                      {date.type == 1 ? 
                      <ArrowSmRightIcon className="w-5 h-5" style={ {color: 'green'} }/> : 
                      <ArrowSmLeftIcon className="w-5 h-5" style={ {color: 'red'} } />} 

                      {date.type == 1 ? 'Entrada ' : 'Salida '}

                      {moment(date.day).format('HH:mm:ss')}
                    </p>
                </div>
            ))}
          </div>
        ),
    },
    {
        title: "Tiempo trabajado",
        dataIndex: "total",
        render: (total) => (
          <p>{total} horas</p>
      ),
    }
  ];

  return (
    <Layout className='h-screen'>
        <Row>
          <h1 className="pb-4 text-2xl">Mis fichajes</h1>
        </Row>
        <Row justify="center" className='mt-4' gutter={24}>
          <Col span={24}>
            <Table columns={columns} dataSource={clocks} rowKey="id" />
          </Col>
        </Row>
    </Layout>
  );
};

export default MyClocks;
