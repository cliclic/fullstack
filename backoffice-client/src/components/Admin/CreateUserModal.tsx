import {Modal} from "antd";
import * as React from "react";
import {FunctionComponent} from "react";
import {Mutation} from "react-apollo";
import {CREATE_USER, CreateUserInput, CreateUserResponse, CreateUserVariables} from "../common/apolloQueries";
import {CreateUserForm, CreateUserFormControls} from "./CreateUserForm";

interface CreateUserModalProps {
    visible: boolean
    close: () => void
    onSuccess?: () => void
    reloadUsers: () => void
}

export const CreateUserModal: FunctionComponent<CreateUserModalProps> = function (props) {

    return <Mutation<CreateUserResponse, CreateUserVariables>
        mutation={CREATE_USER}
        update={() => {
            props.reloadUsers();
        }}
        onCompleted={props.close}
    >{
        (createUser) => {

            const formControls: CreateUserFormControls = {};

            function submitUser (input: CreateUserInput) {
                createUser({variables: {input}});
            }

            function handleOk () {
                if (formControls.submit) formControls.submit();
            }

            return <Modal
                title="Nouvel utilisateur"
                visible={props.visible}
                onOk={handleOk}
                onCancel={props.close}
                destroyOnClose={true}
                cancelText="Annuler"
                okText="Enregistrer"
            >
                <CreateUserForm onSubmit={submitUser} formControls={formControls} />
            </Modal>
        }}
    </Mutation>
}
