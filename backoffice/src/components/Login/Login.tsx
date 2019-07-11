import './Login.scss'

import React, { FormEvent } from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Card, Form, Icon, Input, Button, Checkbox } from 'antd'
import { Col, Row } from 'antd/es/grid'
import { restClient } from '../../utils/rest'

export default function Login() {
  return (
    <Row className="Login" type="flex" justify="start">
      <Col className="loginCol" sm={{ span: 24 }} md={{ span: 12, push: 6 }}>
        <Card className="loginCard" title="Authentification">
          <WrappedLoginForm />
        </Card>
      </Col>
    </Row>
  )
}

class LoginForm extends React.Component<FormComponentProps> {
  handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const params = new URLSearchParams()
        params.append('u', values.username)
        params.append('c', values.password)
        try {
          await restClient.post('/login', params)
        } catch (e) {
          console.error(e)
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Veuillez renseigner votre login' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Login"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Veuillez renseigner votre mot de passe' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
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

const WrappedLoginForm = Form.create({})(LoginForm)
