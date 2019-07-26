import './Login.scss'

import React, {FormEvent} from 'react'
import {FormComponentProps} from 'antd/es/form'
import {Card, Form, Icon, Input, Button, Checkbox} from 'antd'
import {Col, Row} from 'antd/es/grid'
import {restClient} from '../../utils/rest'
import { withCookies, Cookies, ReactCookieProps } from 'react-cookie';
import {instanceOf} from "prop-types";
import * as qs from 'qs';
import {Redirect} from "react-router-dom";
import {API_PATH, GRAPHQL_PATH} from "../../utils/env";


declare global {
    interface Window { cookies: any; }
}

export interface AccessToken {
    token: string
    createdAt: string
}

export default function Login() {
    return (
        <Row className="Login" type="flex" justify="start">
            <Col className="loginCol" sm={{span: 24}} md={{span: 12, push: 6}}>
                <Card className="loginCard" title="Authentification">
                    <WrappedLoginForm/>
                </Card>
            </Col>
        </Row>
    )
}

type LoginFormProps = FormComponentProps & ReactCookieProps;
interface LoginFormState {
    loggedIn: boolean
}

interface LoginResponseData {
    accessToken: AccessToken
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState>
{
    constructor(props: LoginFormProps) {
        super(props);
        this.state = {
            // loggedIn: props.cookies && props.cookies.get('authenticated')
            loggedIn: false
        }
    }

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err)
            {
                const params = new URLSearchParams()
                params.append('u', values.username)
                params.append('c', values.password)
                try {
                    const {data}: {data: LoginResponseData} = await restClient.post('/login', params);
                    const {cookies} = this.props;
                    if (cookies) {
                        const expires = new Date(Date.now() + 99999999999999);
                        console.log ('set cookie c', data.accessToken.token, {
                            path: '/',
                            expires,
                            httpOnly: false
                        });
                        cookies.set('c', data.accessToken.token, {
                            path: GRAPHQL_PATH,
                            expires,
                            httpOnly: false,
                            secure: false
                        });
                        cookies.set('c', data.accessToken.token, {
                            path: API_PATH,
                            expires,
                            httpOnly: false,
                            secure: false
                        });
                        cookies.set('authenticated', 1, {
                            path: '/',
                            expires
                        });
                        this.setState({loggedIn: true});
                    }
                } catch (e) {
                    console.error(e);
                    const {cookies} = this.props;
                    if (cookies) {
                        cookies.remove('c', {
                            path: GRAPHQL_PATH,
                            httpOnly: false,
                            secure: false
                        });
                        cookies.remove('c', {
                            path: API_PATH,
                            httpOnly: false,
                            secure: false
                        });
                        cookies.remove('authenticated', {
                            path: '/',
                        });
                    }
                }
            }
        })
    }

    render()
    {
        const {getFieldDecorator} = this.props.form;
        const {redirect} = qs.parse(window.location.search.slice(1));

        window.cookies = this.props.cookies;

        if (this.state.loggedIn) {
            return <Redirect to={redirect} />
        } else {
            return (
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: 'Veuillez renseigner votre login'}],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                autoComplete="username"
                                placeholder="Login"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: 'Veuillez renseigner votre mot de passe'}],
                        })(
                            <Input.Password
                                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                autoComplete="current-password"
                                placeholder="Mot de passe"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>Rester connecter</Checkbox>)}
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Se connecter
                        </Button>
                    </Form.Item>
                </Form>
            )
        }
    }
}

const WrappedLoginForm = Form.create({})(withCookies(LoginForm));
