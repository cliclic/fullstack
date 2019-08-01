import React, {FormEvent, FocusEvent, FunctionComponent, useState} from "react";
import {Button, Radio, Form, Icon, Input, DatePicker} from "antd";
import {FormComponentProps, ValidateCallback, ValidationRule} from "antd/es/form";
import {CreateGameLotInput} from "../common/apolloQueries";
import diacritics from 'diacritics';
import {GameTimeSlot, Role} from "../common/consts";
import {GameTimeSlotsFormItem} from "./GameTimeSlotsFormItem";

const {RangePicker} = DatePicker;

export interface CreateGameLotFormControls {
    submit?: () => void;
}

interface CreateGameLotFormProps extends FormComponentProps {
    onSubmit(values: CreateGameLotInput): void,
    formControls?: CreateGameLotFormControls
}

const rangeSize = 86400000;

const CreateGameLotFormBase: FunctionComponent<CreateGameLotFormProps> = function (props) {
    const {form, formControls} = props;
    const {getFieldDecorator} = form;

    const [timeSlots, setTimeSlots] = useState<GameTimeSlot[]>([{
        startTime: 0,
        endTime: rangeSize,
        data: {
            winningDelay: 30000
        }
    }]);

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
                    text: values.text ? values.text : values.title + ' à gagner !',
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
                    rules: [{required: true, message: 'Veuillez renseigner un titre'}]
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item
                label="Texte"
                {...formItemLayout}
            >
                {getFieldDecorator('text')(
                    <Input placeholder={form.getFieldValue('title') ? form.getFieldValue('title') + ' à gagner !' : ''} />
                )}
            </Form.Item>
            <Button style={{display: 'none'}} type="primary" htmlType="submit" className="login-form-button" />
        </Form>
    )
}

export const CreateGameLotForm = Form.create<CreateGameLotFormProps>()(CreateGameLotFormBase);
