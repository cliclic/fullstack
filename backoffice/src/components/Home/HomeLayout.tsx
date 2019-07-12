import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import React, {useState} from "react";
import {Route, Switch} from "react-router";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function HomeLayout () {
    const [siderCollapsed, setSiderCollapsed] = useState(false);

    return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={siderCollapsed} onCollapse={setSiderCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1">
                    <Icon type="setting" />
                    <span>Administration</span>
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout>
            <Header style={{ background: '#fff', padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <Switch>
                    <Route />
                </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    </Layout>
}
