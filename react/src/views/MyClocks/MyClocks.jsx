import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Row, Table, Col, DatePicker, Button, Modal } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import { ArrowSmRightIcon, ArrowSmLeftIcon } from '@heroicons/react/outline';
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../axios";
import moment from 'moment';
import 'moment/locale/es';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

moment.locale('es');
dayjs.locale('es');

const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';

const MyClocks = () => {
  const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
  const [user, setUser] = useState('');
  const [clocks, setClocks] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      getClocks();
    }
  }, []);

  const getClocks = () => {
    axiosClient({
      url: "/clocks/all",
      method: "POST",
      data: {'startDate': startDate, 'endDate': endDate}
    })
      .then((response) => {
          setClocks(response.data.data);
          setUser(response.data.user);
      })
      .catch((error) => {
        Modal.error({
          title: 'Ha ocurrido un error inesperado',
          content: 'Inténtalo más tarde o contacta con el administrador',
          okButtonProps: {
            style: { background: 'green', color: 'white' }
          },
        });
      });
  }

  const handleDateChange = (dates, dateString) => {
   if(dateString.length == 2)
   {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
   }else{
    setStartDate(null);
    setEndDate(null);
   }
  };

  const handleSearch = () => {
    getClocks();
  };

  const columns = [
    {
        title: "Día",
        dataIndex: "day",
        render: (day) => (
          <p>{day}</p>
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
    <ConfigProvider locale={es_ES}>
    <Layout className='min-h-screen'>
        <Row>
          <h1 className="pb-4 text-2xl">Mis fichajes</h1>
        </Row>
        <Row justify="left" className='mt-4' gutter={24}>
          <Col span={24} className='inline-flex'>
            <RangePicker format={dateFormat} onChange={handleDateChange} />
            <Button className="button-antd-custom ml-2"
                    type="primary"
                    onClick={handleSearch}>
              Buscar
            </Button>
          </Col>
        </Row>
        <Row justify="center" className='mt-4' gutter={24}>
          <Col span={24}>
            <Table pagination={{ pageSize: 7}} 
                   columns={columns} 
                   dataSource={clocks} 
                   scroll={{ x: 500 }}
                   rowKey="id" />
          </Col>
        </Row>
    </Layout>
    </ConfigProvider>
  );
};

export default MyClocks;
