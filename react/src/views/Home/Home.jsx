import React, {useState}from 'react';
import './home.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { UserIcon, ClockIcon, ChevronRightIcon, MenuAlt3Icon} from '@heroicons/react/outline'; 

const items = [
    {
      key: '1',
      label: 'Usuarios',
      target: '/Users',
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      key: '2',
      label: 'Historial de fichajes',
      icon: <ClockIcon className="w-5 h-5" />,
    },
];

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  const { Header, Sider, Content } = Layout;
  const navigate = useNavigate();

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
