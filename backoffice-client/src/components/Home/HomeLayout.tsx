import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import React, {useState} from "react";
import {Route, Switch} from "react-router";
import ApolloClient from "apollo-client";
import {LocalCache, User} from "../common/consts";
import Admin from "../Admin";
import GameEditor from "../GameEditor/GameEditor";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface HomeLayoutProps {
    client: ApolloClient<LocalCache>
    me: User
}

export default function HomeLayout (props: HomeLayoutProps) {
    const [siderCollapsed, setSiderCollapsed] = useState(false);

    function onCollapse (collapsed: boolean) {
        setSiderCollapsed(collapsed);
    }

    return <Layout style={{ minHeight: '100vh' }} className="Home">
        <Sider collapsible collapsed={siderCollapsed} onCollapse={onCollapse}>
            <div className="logo" />
            <div className="username">{props.me.displayName}</div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1">
                    <Icon type="setting" />
                    <span>Administration</span>
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="control" />
                    <span>Gestion des jeux</span>
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout>
            <Header style={{ background: '#fff', padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <Switch>
                    <Route path="/admin" component={Admin} />
                    <Route path="/" component={GameEditor} />
                </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2019 Created by CliCliC</Footer>
        </Layout>
    </Layout>
}
