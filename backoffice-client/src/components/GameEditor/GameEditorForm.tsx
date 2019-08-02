import React, {FormEvent, FunctionComponent, useState} from "react";
import {Button, Form, Input, DatePicker} from "antd";
import {FormComponentProps} from "antd/es/form";
import {UpdateGameInput} from "../common/apolloQueries";
import {Game, GameTimeSlot} from "../common/consts";
import {GameTimeSlotsFormItem} from "./GameTimeSlotsFormItem";
import moment from "moment";

const {RangePicker} = DatePicker;

export interface GameEditorFormControls {
    submit?: () => void;
}

interface GameEditorFormProps extends FormComponentProps {
    onSubmit(values: UpdateGameInput): void
    formControls?: GameEditorFormControls
    editedGame?: Game
}

const rangeSize = 86400000;

const GameEditorFormBase: FunctionComponent<GameEditorFormProps> = function (props) {
    const {form, formControls} = props;
    const {getFieldDecorator} = form;
    const {editedGame} = props;

    const [timeSlots, setTimeSlots] = useState<GameTimeSlot[]>(editedGame && editedGame.timeSlots ? editedGame.timeSlots : [{
        startTime: 0,
        endTime: rangeSize,
        data: {
            winningDelay: 30000
        }
    }]);

    console.log ('time slots', editedGame)

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
                console.log({
                    title: values.title,
                    startAt: values.startEndAt[0].startOf('day'),
                    endAt: values.startEndAt[1].endOf('day'),
                    timeSlots
                });
                props.onSubmit({
                    title: values.title,
                    startAt: values.startEndAt[0].startOf('day'),
                    endAt: values.startEndAt[1].endOf('day'),
                    timeSlots
                })
            }
        })
    }

    function onTimeSlotsChange(newTimeSlots: GameTimeSlot[]) {
        setTimeSlots(newTimeSlots);
    }

    return (
        <Form onSubmit={handleSubmit} className="create-game-form tight" layout="horizontal">
            <Form.Item
                label="Titre"
                {...formItemLayout}
            >
                {getFieldDecorator('title', {
                    rules: [{required: true, message: 'Veuillez renseigner un nom'}],
                    initialValue: editedGame ? editedGame.title: ''
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item
                label="Début - Fin"
                {...formItemLayout}
            >
                {getFieldDecorator('startEndAt', {
                    rules: [{required: true, message: 'Veuillez renseigner une date de début'}],
                    initialValue: editedGame ? [moment(editedGame.startAt), moment(editedGame.endAt)]: ''
                })(
                    <RangePicker />
                )}
            </Form.Item>
            <GameTimeSlotsFormItem formItemLayout={formItemLayout} form={form} onChange={onTimeSlotsChange} value={timeSlots} rangeSize={rangeSize} />
            <Button style={{display: 'none'}} type="primary" htmlType="submit" className="login-form-button" />
        </Form>
    )
}

export const GameEditorForm = Form.create<GameEditorFormProps>({onFieldsChange(props, changedFields, allFields) {
    const {displayName} = changedFields;
    if (displayName) {
        props.form.setFieldsValue({gamename: displayName.value});
    }
}})(GameEditorFormBase);
