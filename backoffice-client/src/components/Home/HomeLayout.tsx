import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import React, {useState, Suspense} from "react";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router";
import ApolloClient from "apollo-client";
import {LocalCache, User} from "../common/consts";
import Admin from "../Admin";
import GameEditor from "../GameEditor";
import {SelectParam} from "antd/es/menu";
import {LoadingMessage} from "../common/LoadingMessage";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface HomeLayoutProps extends RouteComponentProps {
    client: ApolloClient<LocalCache>
    me: User
}

function HomeLayout (props: HomeLayoutProps) {
    const [siderCollapsed, setSiderCollapsed] = useState(false);

    function onCollapse (collapsed: boolean) {
        setSiderCollapsed(collapsed);
    }

    function onMenuItemSelect (param: SelectParam) {
        props.history.push(param.key);
    }

    const path = '/' + window.location.pathname.split('/')[1];

    return <Layout style={{ minHeight: '100vh' }} className="Home">
        <Sider collapsible collapsed={siderCollapsed} onCollapse={onCollapse}>
            <div className="logo" />
            <div className="username">{props.me.displayName}</div>
            <Menu theme="dark" selectedKeys={[path]} mode="inline" onSelect={onMenuItemSelect}>
                <Menu.Item key="/admin">
                    <Icon type="setting" />
                    <span>Administration</span>
                </Menu.Item>
                <Menu.Item key="/">
                    <Icon type="control" />
                    <span>Gestion des jeux</span>
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout>
            <Content style={{ margin: '0' }}>
                <Suspense fallback={<LoadingMessage />}>
                    <Switch>
                        <Route path="/admin" component={Admin} />
                        <Route path="/" component={GameEditor} />
                    </Switch>
                </Suspense>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2019 Created by CliCliC</Footer>
        </Layout>
    </Layout>
}

export default withRouter(HomeLayout);
