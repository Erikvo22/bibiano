import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Form, Input, Select, Button, Alert } from "antd";
import { useForm } from "antd/lib/form/Form";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

import axiosClient from "../../axios";

import "./User.css";

const FormUser = () => {
    const navigate = useNavigate();
    const [form] = useForm();
    const location = useLocation();

    if (location.state?.user) {
        form.setFieldsValue({
            ...location.state.user,
        });
    } else {
        form.setFieldsValue({
            name: "",
            firstname: "",
            secondname: "",
            dni: "",
            mobile: "",
            email: "",
            password: "",
            role: "USER",
        });
    }

    const onFinish = (value) => {
        const esNuevoUsuario = location.pathname.includes("/nuevo");
        axiosClient({
            url: esNuevoUsuario ? "/user" : `/user/${value.id}`,
            method: esNuevoUsuario ? "POST" : "PUT",
            data: value,
        })
            .then((response) => {
                if (response.data.success) {
                    navigate("/users", { state: { success: true } });
                } else {
                    let message = "";
                    const errors = response.data.errors;
                    for (let key in errors) {
                        message += `${key}: ${errors[key]} `;
                    }
                    toast.error(message);
                }
            })
            .catch((error) => {
                toast.error(error);
            });
    };

    return (
        <>
            <h1 className="pb-4 text-2xl">Nuevo Usuario</h1>
            <div>
                <ToastContainer />
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row>
                        <Form.Item name="id" noStyle>
                            <Input type="hidden" />
                        </Form.Item>
                    </Row>
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
                            <Form.Item label="Teléfono" name="mobile">
                                <Input
                                    className="input-antd-custom"
                                    placeholder="Teléfono"
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
                                    placeholder="Introduce la contraseña"
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
                                onClick={() => {
                                    navigate("/users");
                                }}
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
