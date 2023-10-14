import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Typography, Row, Col } from 'antd';
import { PlayIcon, PauseIcon } from '@heroicons/react/outline';

const { Text } = Typography;

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
    if (isWorking) {
      setIsWorking(false);
      setElapsedTime(0);
    } else {
      setIsWorking(true);
      setStartTime(Date.now());
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={18} md={12} lg={8} xl={6}>
        <Card>
          <Space direction="vertical">
            <Text>¡Hola {userName}!</Text>
            <Text>Fecha actual: {new Date().toLocaleDateString()}</Text>
            <Text>Tiempo de trabajo: {formatTime(elapsedTime)}</Text>
            <Button
              type={isWorking ? 'dashed' : 'primary'}
              onClick={toggleWork}
              icon={isWorking ? <PauseIcon /> : <PlayIcon />}
            >
              {isWorking ? 'Pausar jornada laboral' : 'Empezar jornada laboral'}
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
};

export default App;
