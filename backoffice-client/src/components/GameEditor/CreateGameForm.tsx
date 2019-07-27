import React, {FormEvent, FocusEvent, FunctionComponent, useState} from "react";
import {Button, Radio, Form, Icon, Input, DatePicker} from "antd";
import {FormComponentProps, ValidateCallback, ValidationRule} from "antd/es/form";
import {CreateGameInput} from "../common/apolloQueries";
import diacritics from 'diacritics';
import {Role} from "../common/consts";
import {GameTimeSlotsFormItem} from "./GameTimeSlotsFormItem";

const {RangePicker} = DatePicker;

export interface CreateGameFormControls {
    submit?: () => void;
}

interface CreateGameFormProps extends FormComponentProps {
    onSubmit(values: CreateGameInput): void,
    formControls?: CreateGameFormControls
}

const CreateGameFormBase: FunctionComponent<CreateGameFormProps> = function (props) {
    const {form, formControls} = props;
    const {getFieldDecorator} = form;

    if (formControls) {
        formControls.submit = handleSubmit;
    }

    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    function handleSubmit (e?: FormEvent) {
        if (e) e.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                props.onSubmit({
                    title: values.title,
                    startAt: values.startEndAt[0],
                    endAt: values.startEndAt[1],
                    timeSlots: []
                })
            }
        })
    }

    return (
        <Form onSubmit={handleSubmit} className="create-game-form tight" layout="horizontal">
            <Form.Item
                label="Titre"
                {...formItemLayout}
            >
                {getFieldDecorator('title', {
                    rules: [{required: true, message: 'Veuillez renseigner un nom'}]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item
                label="Début - Fin"
                {...formItemLayout}
            >
                {getFieldDecorator('startEndAt', {
                    rules: [{required: true, message: 'Veuillez renseigner une date de début'}]
                })(
                    <RangePicker />
                )}
            </Form.Item>
            <GameTimeSlotsFormItem formItemLayout={formItemLayout} form={form} />
            <Button style={{display: 'none'}} type="primary" htmlType="submit" className="login-form-button" />
        </Form>
    )
}

export const CreateGameForm = Form.create<CreateGameFormProps>({onFieldsChange(props, changedFields, allFields) {
    const {displayName} = changedFields;
    if (displayName) {
        props.form.setFieldsValue({gamename: displayName.value});
    }
}})(CreateGameFormBase);
