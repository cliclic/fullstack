import {Modal} from "antd";
import * as React from "react";
import {FunctionComponent} from "react";
import {Mutation} from "react-apollo";
import {UPDATE_GAME, UpdateGameInput, UpdateGameResponse, UpdateGameVariables} from "../common/apolloQueries";
import {GameEditorForm, GameEditorFormControls} from "./GameEditorForm";
import {Game} from "../common/consts";

interface GameEditorModalProps {
    visible: boolean
    close: () => void
    onSuccess?: () => void
    reloadGames: () => void
    editedGame?: Game
}

export const GameEditorModal: FunctionComponent<GameEditorModalProps> = function (props) {

    return <Mutation<UpdateGameResponse, UpdateGameVariables>
        mutation={UPDATE_GAME}
        update={() => {
            props.reloadGames();
        }}
        onCompleted={props.close}
    >{
        (updateGame) => {

            const formControls: GameEditorFormControls = {};

            function submitGame (input: UpdateGameInput) {
                if (props.editedGame) input._id = props.editedGame._id;
                updateGame({variables: {input}});
            }

            function handleOk () {
                if (formControls.submit) formControls.submit();
            }

            return <Modal
                title="Nouveau jeu"
                visible={props.visible}
                onOk={handleOk}
                onCancel={props.close}
                destroyOnClose={true}
                cancelText="Annuler"
                okText="Enregistrer"
            >
                <GameEditorForm onSubmit={submitGame} formControls={formControls} editedGame={props.editedGame}/>
            </Modal>
        }}
    </Mutation>
}
