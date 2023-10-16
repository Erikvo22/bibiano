import React, { useState } from "react";
import { Row, Col, Form, Input, Select, Button, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../../axios";
import "./User.css";

const FormUser = ({ user }) => {
    const navigate = useNavigate();
    const [userCreatedError, setUserCreatedError] = useState({});

    const onFinish = (values) => {
        axiosClient({
            url: "/user",
            method: "POST",
            data: values,
        })
            .then((response) => {
                if (response.data.success) {
                    navigate("/users", {
                        state: {
                            success: response.data.success,
                            message: response.data.message,
                        },
                    });
                } else {
                    let message = "";
                    const errors = response.data.errors;
                    for (let key in errors) {
                        message += `${key}: ${errors[key]} `;
                    }
                    setUserCreatedError({
                        success: false,
                        message: message,
                    });
                }
            })
            .catch((error) => {
                setUserCreatedError({
                    success: false,
                    message: error,
                });
            });
    };

    const handleCancel = () => {
        navigate("/users", { state: { success: false } });
    };

    return (
        <>
            {userCreatedError.success !== undefined &&
                !userCreatedError.success && (
                    <Alert message={userCreatedError.message} type="error" />
                )}
            <Template onFinish={onFinish} onCancel={handleCancel} user={user} />
        </>
    );
};

const Template = ({ onFinish, onCancel, user }) => {
    const [form] = Form.useForm();
    const location = useLocation();
    debugger;
    if (location.state?.user) {
        form.setFieldsValue({
            ...location.state.user,
        });
    } else {
        if (user !== undefined) {
            form.setFieldsValue({
                name: user?.name,
                firstname: user?.firstname,
                secondname: user?.secondname,
                dni: user?.dni,
                mobile: user?.mobile,
                email: user?.email,
                password: user?.password,
                role: user?.role,
            });
        }
    }

    return (
        <>
            <h1 className="pb-4 text-2xl">Nuevo Usuario</h1>
            <div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={user}
                >
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Nombre"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "El nombre es requerido",
                                    },
                                ]}
                            >
                                <Input
                                    className="input-antd-custom"
                                    placeholder="Nombre"
                                    pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+"
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} sm={24} lg={{ span: 12 }}>
                            <Form.Item label="Primer Apellido" name="firstname">
                                <Input
                                    className="input-antd-custom"
                                    placeholder="Primer Apellido"
                                    pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+"
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} lg={{ span: 11, offset: 1 }}>
                            <Form.Item
                                label="Segundo Apellido"
                                name="secondname"
                            >
                                <Input
                                    className="input-antd-custom"
                                    placeholder="Segundo Apellido"
                                    pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+"
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} sm={24} lg={12}>
                            <Form.Item
                                label="Documento"
                                name="dni"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor introduzca su DNI",
                                    },
                                ]}
                            >
                                <Input
                                    className="input-antd-custom"
                                    placeholder="DNI"
                                    pattern="[0-9]{8}[A-Za-z]{1}"
                                    maxLength={9}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} lg={{ span: 11, offset: 1 }}>
                            <Form.Item label="Telefono" name="mobile">
                                <Input
                                    className="input-antd-custom"
                                    placeholder="Telefono"
                                    pattern="[0-9]+"
                                    maxLength={14}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "El correo electrónico es requerido",
                                    },
                                    {
                                        type: "email",
                                        message:
                                            "El correo electrónico no es válido",
                                    },
                                ]}
                            >
                                <Input
                                    className="input-antd-custom"
                                    placeholder="Email"
                                    maxLength={128}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Contraseña"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "La contraseña es requerida",
                                    },
                                    {
                                        min: 6,
                                        message:
                                            "La contraseña debe tener al menos 8 caracteres",
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="input password"
                                    iconRender={(visible) =>
                                        visible ? (
                                            <EyeTwoTone />
                                        ) : (
                                            <EyeInvisibleOutlined />
                                        )
                                    }
                                    maxLength={128}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Tipo de usuario"
                                name="role"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor seleccione un rol",
                                    },
                                ]}
                            >
                                <Select
                                    options={[
                                        {
                                            value: "USER",
                                            label: "Empleado",
                                        },
                                        {
                                            value: "ADMIN",
                                            label: "Admin",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="full-width-row">
                        <Col span={24}>
                            <Button
                                className="button-antd-custom mr-2 full-width-button "
                                type="primary"
                                htmlType="submit"
                            >
                                Guardar
                            </Button>
                            <Button
                                className="full-width-button"
                                type="default"
                                onClick={onCancel}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default FormUser;
