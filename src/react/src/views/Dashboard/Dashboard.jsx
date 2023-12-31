import { useState, useEffect } from "react";
import {
    Layout,
    Button,
    Card,
    Space,
    Typography,
    Row,
    Col,
    Modal,
    Input,
    Radio,
} from "antd";
import { CalendarIcon, PlayIcon, PauseIcon } from "@heroicons/react/outline";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios";

const { Text } = Typography;
const { Title } = Typography;

const App = () => {
    const { userToken } = useStateContext();
    const [userName, setUserName] = useState("");
    const [clocks, setClocks] = useState([]);
    const [worked, setWorked] = useState(0);
    const [isWorking, setIsWorking] = useState(false);
    const [count, setCount] = useState(0);
    const [newType, setNewType] = useState(1);
    const [newComment, setNewComment] = useState("");
    const [open, setOpen] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const navigate = useNavigate();

    if (!userToken) {
        navigate("/login");
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

        if (clocks.length % 2 !== 0) {
            setIsWorking(true);
            setTitleModal("Seleccione el motivo de la parada");
        } else {
            setIsWorking(false);
            setTitleModal("¿Está seguro de realizar el fichaje de entrada?");
        }

        let total = 0;
        for (let i = 0; i < clocks.length; i += 2) {
            const input = clocks[i] ? new Date(clocks[i].date) : null;
            const output = clocks[i + 1] ? new Date(clocks[i + 1].date) : null;

            if (input && output) {
                const auxCalc = output - input;
                total += auxCalc;
            } else if (input) {
                total += Date.now() - input;
            }
        }

        const seconds = Math.floor(total / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsRestants = seconds % 60;
        const formatedTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}:${String(secondsRestants).padStart(2, "0")}`;

        setWorked(formatedTime);
        return () => clearInterval(intervalId);
    }, [count]);

    const getClocks = () => {
        axiosClient({
            url: "/clocks/list",
            method: "GET",
        })
            .then((response) => {
                setClocks(response.data.data);
                setUserName(response.data.username);
            })
            .catch(() => {
                Modal.error({
                    title: "Ha ocurrido un error inesperado",
                    content:
                        "Inténtalo más tarde o contacta con el administrador",
                    okButtonProps: {
                        style: { background: "green", color: "white" },
                    },
                });
            });
    };

    const onChange = (e) => {
        setNewType(e.target.value);
    };

    const onChangeComment = (e) => {
        setNewComment(e.target.value);
    };

    const handleOkStart = () => {
        setOpen(false);
        setIsWorking(true);
        saveClock(1, "");
    };

    const handleOkStop = () => {
        setOpen(false);
        setIsWorking(false);
        saveClock(newType, newComment);
        setNewType(1);
        setNewComment("");
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const showModal = () => {
        setOpen(true);
    };

    const toggleWork = () => {
        showModal();
    };

    const saveClock = (type_id, comments) => {
        axiosClient({
            url: "/clocks/save",
            method: "POST",
            data: { type_id: type_id, comments: comments },
        })
            .then(() => {
                getClocks();
            })
            .catch(() => {
                Modal.error({
                    title: "Ha ocurrido un error inesperado",
                    content:
                        "Inténtalo más tarde o contacta con el administrador",
                    okButtonProps: {
                        style: { background: "green", color: "white" },
                    },
                });
            });
    };

    return (
        <Layout className="min-h-screen">
            <Row>
                <h1 className="pb-4 text-2xl">
                    ¡Hola <b>{userName}</b>!
                </h1>
            </Row>
            <Row justify="center" className="mt-4" gutter={24}>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Text className="inline-flex">
                                <CalendarIcon
                                    color="green"
                                    className="w-5 h-5"
                                />
                                <p className="ml-2">
                                    Tu trabajo durante el{" "}
                                    {new Date().toLocaleDateString()}
                                </p>
                            </Text>

                            <Title
                                level={2}
                                className="flex justify-center items-center"
                            >
                                {worked != 0 ? worked : "00:00:00"}
                            </Title>
                        </Space>
                    </Card>
                </Col>
            </Row>
            <Row justify="center" className="mt-2" gutter={24}>
                <Col
                    span={24}
                    className="flex justify-center align-items-center"
                >
                    <Button
                        type="primary"
                        onClick={toggleWork}
                        style={
                            isWorking
                                ? { background: "red" }
                                : { background: "green" }
                        }
                    >
                        {isWorking ? (
                            <p className="inline-flex">
                                <PauseIcon className="w-5 h-5" />{" "}
                                <p className="ml-2">Pausar jornada laboral</p>
                            </p>
                        ) : (
                            <p className="inline-flex">
                                <PlayIcon className="w-5 h-5" />{" "}
                                <p className="ml-2">Empezar jornada laboral</p>
                            </p>
                        )}
                    </Button>
                </Col>
            </Row>

            <Modal
                open={open}
                title={titleModal}
                onCancel={handleCancel}
                footer={[
                    <div key="footer" className="mt-4">
                        <Button onClick={handleCancel}>Cancelar</Button>
                        <Button
                            hidden={isWorking}
                            style={{ background: "green", color: "white" }}
                            onClick={handleOkStart}
                        >
                            Fichar entrada
                        </Button>
                        <Button
                            hidden={!isWorking}
                            disabled={newType == 1}
                            style={{
                                background: newType == 1 ? "grey" : "green",
                                color: "white",
                            }}
                            onClick={handleOkStop}
                        >
                            Fichar
                        </Button>
                    </div>,
                ]}
            >
                <div hidden={!isWorking}>
                    <Radio.Group onChange={onChange} value={newType}>
                        <Space direction="vertical">
                            <Radio value={2}>Finalizar la jornada</Radio>
                            <Radio value={3}>Comida</Radio>
                            <Radio value={4}>Médico</Radio>
                            <Radio value={5}>Permiso</Radio>
                            <Radio value={6}>
                                Otro...
                                {newType === 6 ? (
                                    <Input
                                        value={newComment}
                                        onChange={onChangeComment}
                                        style={{ width: 100, marginLeft: 10 }}
                                    />
                                ) : null}
                            </Radio>
                        </Space>
                    </Radio.Group>
                </div>
            </Modal>
        </Layout>
    );
};

export default App;
