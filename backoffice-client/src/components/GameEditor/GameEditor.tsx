import * as React from 'react';
import {Query} from "react-apollo";
import {queryHandler} from "../common/apolloHelpers";
import {GamesTable} from "./GamesTable";
import {GET_GAMES, GetGamesResponse} from "../common/apolloQueries";
import {Button, Icon, Modal, PageHeader} from "antd";
import {useState} from "react";
import {CreateGameModal } from "./CreateGameModal";

export default function GameEditor () {
    const [showCreateGameModal, setShowCreateGameModal] = useState(false)

    function openCreateGameModal () {
        setShowCreateGameModal(true);
    }

    function closeCreateUserModal () {
        setShowCreateGameModal(false);
    }

    return <Query query={GET_GAMES} pollInterval={30000}>{
        queryHandler<GetGamesResponse>(({data, refetch}) => {
            return <React.Fragment>
                    <PageHeader
                    onBack={() => window.history.back()}
                    title="Gestion des jeux"
                    subTitle="Jeux"
                    extra={[
                        <Button key="1" onClick={openCreateGameModal}><Icon type="plus" /> Jeu</Button>,
                    ]}
                />
                <GamesTable games={data!.games} reloadGames={refetch} />
                <CreateGameModal close={closeCreateUserModal} visible={showCreateGameModal} reloadGames={refetch} />
            </React.Fragment>
        })
    }</Query>
}
