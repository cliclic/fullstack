import React, {FormEvent, FunctionComponent} from "react";
import {Button, Form, Input} from "antd";
import {FormComponentProps} from "antd/es/form";
import {UpdateGameLotInput} from "../common/apolloQueries";
import {GameLot} from "../common/consts";

export interface GameLotEditorFormControls {
    submit?: () => void;
}

interface GameLotEditorFormProps extends FormComponentProps {
    onSubmit(values: UpdateGameLotInput): void,
    formControls?: GameLotEditorFormControls
    editedLot?: GameLot;
}

const GameLotEditorFormBase: FunctionComponent<GameLotEditorFormProps> = function (props) {
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
                    text: values.text ? values.text : values.title + ' à gagner !',
                })
            }
        })
    }

    const {editedLot} = props;

    return (
        <Form onSubmit={handleSubmit} className="create-game-form tight" layout="horizontal">
            <Form.Item
                label="Titre"
                {...formItemLayout}
            >
                {getFieldDecorator('title', {
                    rules: [{required: true, message: 'Veuillez renseigner un titre'}],
                    initialValue: editedLot ? editedLot.title : undefined
                })(
                    <Input />
                )}
            </Form.Item>
            <Form.Item
                label="Texte"
                {...formItemLayout}
            >
                {getFieldDecorator('text', {
                    initialValue: editedLot ? editedLot.text: undefined
                })(
                    <Input placeholder={form.getFieldValue('title') ? form.getFieldValue('title') + ' à gagner !' : ''} />
                )}
            </Form.Item>
            <Button style={{display: 'none'}} type="primary" htmlType="submit" className="login-form-button" />
        </Form>
    )
}

export const GameLotEditorForm = Form.create<GameLotEditorFormProps>()(GameLotEditorFormBase);
