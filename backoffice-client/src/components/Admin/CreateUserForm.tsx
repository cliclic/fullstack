import React, {FormEvent, FocusEvent, FunctionComponent, useState} from "react";
import {Button, Radio, Form, Input} from "antd";
import {FormComponentProps, ValidationRule} from "antd/es/form";
import {CreateUserInput} from "../common/apolloQueries";
import diacritics from 'diacritics';
import {Role} from "../common/consts";

export interface CreateUserFormControls {
    submit?: () => void;
}

interface CreateUserFormProps extends FormComponentProps {
    onSubmit(values: CreateUserInput): void,
    formControls?: CreateUserFormControls
}

const CreateUserFormBase: FunctionComponent<CreateUserFormProps> = function (props) {
    const [confirmPasswordDirty, setConfirmPasswordDirty] = useState(false);
    const {form, formControls} = props;
    const {getFieldDecorator} = form;

    if (formControls) {
        console.log ('add form controls')
        formControls.submit = handleSubmit;
    }

    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    function handlePasswordConfirmBlur (e: FocusEvent<HTMLInputElement>) {
        const { value } = e.target;
        setConfirmPasswordDirty(confirmPasswordDirty || !!value );
    }

    function handleSubmit (e?: FormEvent) {
        console.log ('yo');
        if (e) e.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                switch (values.roles)
                {
                    case Role.User:
                        values.roles = [Role.User];
                    break;
                    case Role.Admin:
                        values.roles = [Role.User, Role.Admin];
                    break;
                }
                delete values.confirm;
                props.onSubmit(values)
            }
        })
    }

    function compareToFirstPassword (rule: ValidationRule, value: string, callback: any) {
        if (value && value !== form.getFieldValue('password')) {
            callback('Les mots de passes ne correspondent pas');
        } else {
            callback();
        }
    }

    function validateToNextPassword (rule: ValidationRule, value: string, callback: any) {
        if (value && confirmPasswordDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    return (
        <Form onSubmit={handleSubmit} className="create-user-form tight" layout="horizontal">
            <Form.Item
                label="Nom"
                {...formItemLayout}
            >
                {getFieldDecorator('displayName', {
                    rules: [{required: true, message: 'Veuillez renseigner un nom'}]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item
                label="Login"
                {...formItemLayout}
            >
                {getFieldDecorator('username', {
                    rules: [{required: true, message: 'Veuillez renseigner un login'}],
                    normalize: normalizeLogin
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item
                label="Password"
                hasFeedback
                {...formItemLayout}
            >
                {getFieldDecorator('password', {
                    rules: [{
                            required: true,
                            message: 'Veuillez renseigner un mot de passe',
                        },
                        {
                            validator: validateToNextPassword,
                        },
                    ],
                })(<Input.Password autoComplete="new-password"/>)}
            </Form.Item>
            <Form.Item
                label="Confirm Password"
                hasFeedback
                {...formItemLayout}
            >
                {getFieldDecorator('confirm', {
                    rules: [
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            validator: compareToFirstPassword,
                        },
                    ],
                })(<Input.Password onBlur={handlePasswordConfirmBlur} />)}
            </Form.Item>
            <Form.Item
                label="Role"
                {...formItemLayout}
            >
                {getFieldDecorator('roles', {
                    initialValue: Role.User,
                rules: [],
            })(<Radio.Group buttonStyle="solid">
                    <Radio.Button value={Role.User}>Utilisateur</Radio.Button>
                    <Radio.Button value={Role.Admin}>Administrateur</Radio.Button>
                </Radio.Group>)}
            </Form.Item>
            <Button style={{display: 'none'}} type="primary" htmlType="submit" className="login-form-button" />
        </Form>
    )
}

function normalizeLogin (login?: string) {
    return login ? diacritics.remove(login).replace(/[^a-z0-9.]+/ig, '.').toLowerCase() : '';
}

export const CreateUserForm = Form.create<CreateUserFormProps>({onFieldsChange(props, changedFields, allFields) {
    const {displayName} = changedFields;
    if (displayName) {
        props.form.setFieldsValue({username: displayName.value});
    }
}})(CreateUserFormBase);
