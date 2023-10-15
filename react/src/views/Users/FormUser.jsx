import React, { useState } from "react";
import { Row, Col, Form, Input, Select, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios";
import "./User.css";

const FormUser = ({ user }) => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        axiosClient({
            url: "/user",
            method: "POST",
            data: values,
        })
            .then((response) => {
                if (response.data.success) {
                    navigate(-1);
                }
            })
            .catch((error) => {});
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <>
            <Template onFinish={onFinish} onCancel={handleCancel} user={user} />
        </>
    );
};

const Template = ({ onFinish, onCancel, user }) => {
    const [form] = Form.useForm();

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

    return (
        <>
            <h1 className="pb-4 text-2xl">Nuevo Usuario</h1>
            <div>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="Nombre" name="name">
                                <Input
                                    className="input-antd-custom"
                                    placeholder="Nombre"
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
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} sm={24} lg={12}>
                            <Form.Item label="Documento" name="dni">
                                <Input
                                    className="input-antd-custom"
                                    placeholder="DNI"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} lg={{ span: 11, offset: 1 }}>
                            <Form.Item label="Telefono" name="mobile">
                                <Input
                                    className="input-antd-custom"
                                    placeholder="Telefono"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="Email" name="email">
                                <Input
                                    className="input-antd-custom"
                                    placeholder="Email"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="Contraseña" name="password">
                                <Input.Password
                                    placeholder="input password"
                                    iconRender={(visible) =>
                                        visible ? (
                                            <EyeTwoTone />
                                        ) : (
                                            <EyeInvisibleOutlined />
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="Tipo de usuario" name="role">
                                <Select
                                    defaultValue="Usuario"
                                    options={[
                                        {
                                            value: "USER",
                                            label: "Empleado",
                                        },
                                        { value: "ADMIN", label: "Admin" },
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
