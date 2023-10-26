import React, {useState} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { UserIcon, ClockIcon, ChevronRightIcon, MenuAlt3Icon, HomeIcon, ArrowSmLeftIcon} from '@heroicons/react/outline'; 
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios";

import './home.css';

const Home = () => {
  const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Sider, Content } = Layout;
  const navigate = useNavigate();

  if (!userToken) {
    navigate('/login');
  }

  const logout = () => {
    axiosClient({
      url: "/logout",
      method: "GET"
    })
    .then((response) => {
      navigate('/login');
    })
    .catch((error) => {});
  }

  const items = [
    {
      key: '1',
      label: 'Inicio',
      target: '/dashboard',
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      key: '2',
      label: 'Mis fichajes',
      target: '/my-clocks',
      icon: <ClockIcon className="w-5 h-5" />,
    },
    {
      key: '3',
      label: 'Usuarios',
      target: '/users',
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      key: '4',
      label: 'Cerrar sesión',
      onClick: logout,
      icon: <ArrowSmLeftIcon className="w-5 h-5" />,
    }
  ];

  const handleMenuClick = ({ key }) => {
    const itemClicked = items.find((item) => item.key === key);
    itemClicked?.target && navigate(itemClicked.target);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }

  return (
    <Layout className='h-screen'>
      <Layout>
        <Sider 
          width={250} 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          onCollapse={(c,t) => toggleCollapsed()}
          breakpoint='lg'>
          <Layout 
            style={{backgroundColor: "#001529"}}
            className='h-16 flex justify-center items-center'>
              <span className='text-white'> Logotipo </span>
          </Layout>
          <Layout>
            <Layout className={ collapsed 
              ? 'flex items-center justify-center' 
              : 'flex items-end justify-center'}>           
              <Button
                style={{border: "none", backgroundColor: 'none', boxShadow: 'none'}}
                onClick={toggleCollapsed}>
                  {collapsed 
                    ? <ChevronRightIcon className="w-4 h-4" /> 
                    : <MenuAlt3Icon className="w-4 h-4" />}
              </Button>
            </Layout>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['0']}
              items={items}
              onClick={handleMenuClick}
              inlineCollapsed={collapsed}
            />
          </Layout>
        </Sider>
        <Layout>
          <Header style={{backgroundColor: "whitesmoke", padding:0}}></Header>
          <Content className='pr-8 pl-8 m-0'>
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
