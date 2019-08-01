import {Modal} from "antd";
import * as React from "react";
import {FunctionComponent} from "react";
import {Mutation} from "react-apollo";
import {CREATE_GAME, CREATE_GAME_LOT, CreateGameLotInput, CreateGameLotResponse, CreateGameLotVariables} from "../common/apolloQueries";
import {CreateGameLotForm, CreateGameLotFormControls} from "./CreateGameLotForm";

interface CreateGameLotModalProps {
    visible: boolean
    close: () => void
    onSuccess?: () => void
    reloadLots: () => void
    poolId: string
}

export const CreateGameLotModal: FunctionComponent<CreateGameLotModalProps> = function (props) {

    return <Mutation<CreateGameLotResponse, CreateGameLotVariables>
        mutation={CREATE_GAME_LOT}
        onCompleted={() => {
            props.reloadLots();
            props.close();
        }}
    >{
        (createGameLot) => {

            const formControls: CreateGameLotFormControls = {};

            function submitGame (input: CreateGameLotInput) {
                console.log ('create game lot', input);
                createGameLot({variables: {poolId: props.poolId, input}});
            }

            function handleOk () {
                if (formControls.submit) formControls.submit();
            }

            return <Modal
                title="Nouveau lot"
                visible={props.visible}
                onOk={handleOk}
                onCancel={props.close}
            >
                <CreateGameLotForm onSubmit={submitGame} formControls={formControls} />
            </Modal>
        }}
    </Mutation>
}
