import {Modal} from "antd";
import * as React from "react";
import {FunctionComponent} from "react";
import {Mutation} from "react-apollo";
import {CREATE_USER, CreateGameInput, CreateGameResponse, CreateGameVariables} from "../common/apolloQueries";
import {CreateGameForm, CreateGameFormControls} from "./CreateGameForm";

interface CreateGameModalProps {
    visible: boolean
    close: () => void
    onSuccess?: () => void
    reloadGames: () => void
}

export const CreateGameModal: FunctionComponent<CreateGameModalProps> = function (props) {

    return <Mutation<CreateGameResponse, CreateGameVariables>
        mutation={CREATE_USER}
        update={() => {
            props.reloadGames();
        }}
    >{
        (createGame) => {

            const formControls: CreateGameFormControls = {};

            function submitGame (input: CreateGameInput) {
                createGame({variables: {input}});
            }

            function handleOk () {
                if (formControls.submit) formControls.submit();
            }

            return <Modal
                title="Nouveau jeu"
                visible={props.visible}
                onOk={handleOk}
                onCancel={props.close}
            >
                <CreateGameForm onSubmit={submitGame} formControls={formControls} />
            </Modal>
        }}
    </Mutation>
}
