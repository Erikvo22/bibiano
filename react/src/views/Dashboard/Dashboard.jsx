import React, { useState, useEffect } from 'react';
import { Layout, Button, Card, Space, Typography, Row, Col, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { CalendarIcon, PlayIcon, PauseIcon } from '@heroicons/react/outline';

const { Text } = Typography;
const { Title } = Typography;
const { confirm } = Modal;

const App = () => {
  const [userName, setUserName] = useState('NOMBRE_USUARIO');
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;

    if (isWorking) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isWorking, startTime]);

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
          setElapsedTime(0);
        } else {
          setIsWorking(true);
          setStartTime(Date.now());
        }
      },
      onCancel() {
      },
    });
  };

  return (
    <Layout className='h-screen'>
      <Row>
        <Text>¡Hola <b>{userName}!</b></Text>
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
                {formatTime(elapsedTime)}
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

const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
};

export default App;
