import React, { useState, useEffect } from 'react';
import { Layout, Button, Card, Space, Typography, Row, Col, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { CalendarIcon, PlayIcon, PauseIcon } from '@heroicons/react/outline';
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from 'react-router-dom';
import axiosClient from "../../axios";

const { Text } = Typography;
const { Title } = Typography;
const { confirm } = Modal;

const App = () => {
  const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
  const [userName, setUserName] = useState('');
  const [clocks, setClocks] = useState([]);
  const [worked, setWorked] = useState(0); 
  const [isWorking, setIsWorking] = useState(false);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  if (!userToken) {
    navigate('/login');
  }

  useEffect(() => {
    if (userToken) {
      getClocks();
    }
  }, []);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1);
    }, 100);

    if (clocks.length % 2 !== 0){
      setIsWorking(true);
    }else{
      setIsWorking(false);
    }

    let total = 0;
    for (let i = 0; i < clocks.length; i += 2) {
      const input = clocks[i] ? new Date(clocks[i].date) : null;
      const output = clocks[i + 1] ? new Date(clocks[i + 1].date) : null;

      if (input && output) {
        const auxCalc = output - input;
        total += auxCalc;
      }else if(input){
        total += Date.now() - input;
      }
    }

    const seconds = Math.floor(total / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRestants = seconds % 60;

    const formatedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsRestants).padStart(2, '0')}`;
    setWorked(formatedTime);
    return () => clearInterval(intervalId);
  }, [count]);

  const getClocks = () => {
    axiosClient({
      url: "/clocks/list",
      method: "GET"
    })
      .then((response) => {
          setClocks(response.data.data);
          setUserName(response.data.username);
      })
      .catch((error) => {});
  }

  const toggleWork = () => {
    confirm({
      title: '¿Está seguro de realizar el fichaje?',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Sí',
      cancelText: 'Cancelar',
      okButtonProps: {
        style: { background: 'green', color: 'white' }
      },
      onOk() {
        if (isWorking) {
          setIsWorking(false);
        } else {
          setIsWorking(true);
        }
        saveClock(isWorking ? 2 : 1);
      },
      onCancel() {
      },
    });
  }

  const saveClock = (type) => {
    axiosClient({
      url: "/clocks/save",
      method: "POST",
      data: {'type': type}
    })
      .then((response) => {
        getClocks();
      })
      .catch((error) => {});
  }

  return (
    <Layout className='min-h-screen'>
      <Row>
        <h1 className="pb-4 text-2xl">¡Hola <b>{userName}</b>!</h1>
      </Row>
      <Row justify="center" className='mt-4' gutter={24}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text className='inline-flex'> 
                <CalendarIcon color='green' className="w-5 h-5"/> 
                <p className='ml-2'>Tu trabajo durante el {new Date().toLocaleDateString()}</p>
              </Text>

              <Title level={2} className='flex justify-center items-center'>
                {worked != 0 ? worked : '00:00:00'}
              </Title>
            </Space>
          </Card>
        </Col>
      </Row>
      <Row justify="center" className='mt-2' gutter={24}>
        <Col span={24} className='flex justify-center align-items-center'>
          <Button
              type='primary'
              onClick={toggleWork}
              style={isWorking ? { background: "red" } : {background: "green"}}>
              {isWorking ? 
              (<p className='inline-flex'><PauseIcon className="w-5 h-5"/> <p className='ml-2'>Pausar jornada laboral</p></p>) 
              : (<p className="inline-flex"><PlayIcon className="w-5 h-5"/> <p className='ml-2'>Empezar jornada laboral</p></p>)
              }
          </Button>
        </Col>
      </Row>
    </Layout>
  );
};

export default App;
