import React, { useState, useEffect } from 'react';
import { Layout, Button, Card, Space, Typography, Row, Col, Modal } from 'antd';
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../axios";

const { Text } = Typography;
const { Title } = Typography;

const MyClocks = () => {
  const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
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

  return (
    <Layout className='h-screen'>
        <Row>
          <h1 className="pb-4 text-2xl">Mis fichajes</h1>
        </Row>
        <Row>
        </Row>
    </Layout>
  );
};

export default MyClocks;
