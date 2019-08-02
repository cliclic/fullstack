import {Modal} from "antd";
import * as React from "react";
import {FunctionComponent} from "react";
import {Mutation} from "react-apollo";
import {UpdateGameLotInput, UpdateGameLotResponse, UpdateGameLotVariables, UPDATE_GAME_LOT} from "../common/apolloQueries";
import {GameLotEditorForm, GameLotEditorFormControls} from "./GameLotEditorForm";
import {GameLot} from "../common/consts";

interface GameLotEditorModalProps {
    visible: boolean
    close: () => void
    onSuccess?: () => void
    reloadLots: () => void
    poolId: string
    editedLot?: GameLot
}

export const GameLotEditorModal: FunctionComponent<GameLotEditorModalProps> = function (props) {

    return <Mutation<UpdateGameLotResponse, UpdateGameLotVariables>
        mutation={UPDATE_GAME_LOT}
        onCompleted={() => {
            props.reloadLots();
            props.close();
        }}
    >{
        (updateGameLot) => {

            const formControls: GameLotEditorFormControls = {};

            function submitGame (input: UpdateGameLotInput) {
                console.log ('create game lot', input);
                if (props.editedLot) {
                    input._id = props.editedLot._id;
                }
                updateGameLot({variables: {poolId: props.poolId, input}});
            }

            function handleOk () {
                if (formControls.submit) formControls.submit();
            }

            return <Modal
                title="Nouveau lot"
                visible={props.visible}
                onOk={handleOk}
                onCancel={props.close}
                destroyOnClose={true}
                cancelText="Annuler"
                okText="Enregistrer"
            >
                <GameLotEditorForm onSubmit={submitGame} formControls={formControls} editedLot={props.editedLot} />
            </Modal>
        }}
    </Mutation>
}
