import React, { useState, useEffect } from 'react';
import { Layout, Button, Card, Space, Typography, Row, Col, Modal } from 'antd';
import axiosClient from "../../axios";

const { Text } = Typography;
const { Title } = Typography;

const MyClocks = () => {
  const [user, setUser] = useState('');
  const [clocks, setClocks] = useState([]);

  useEffect(() => {
    getClocks();
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

  return (
    <Layout className='h-screen'>
        <Row>
            <Text>Mis fichajes</Text>
        </Row>
        <Row>
        </Row>
    </Layout>
  );
};

export default MyClocks;
