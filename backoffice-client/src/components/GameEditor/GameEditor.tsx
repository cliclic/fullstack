import * as React from 'react';
import {Query, QueryResult} from "react-apollo";
import {queryHandler} from "../common/apolloHelpers";
import {GamesTable} from "./GamesTable";
import {GameLotsTable} from "./GameLotsTable";
import {GET_GAMES_AND_LOTS, GetGamesAndLotsResponse} from "../common/apolloQueries";
import {Button, Icon, Modal, PageHeader, Tabs} from "antd";
import {useState} from "react";
import {CreateGameModal } from "./CreateGameModal";
import {CreateGameLotModal } from "./CreateGameLotModal";
import {RouteProps, RouterProps} from "react-router";

const GameEditor:React.FunctionComponent<RouteProps> = function (props) {
    const activeTab = props.location && props.location.hash === "#lots" ? "lots" : "games";
    const [showCreateGameModal, setShowCreateGameModal] = useState(false)
    const [showCreateGameLotModal, setShowCreateGameLotModal] = useState(false)

    function openCreateGameModal () {
        setShowCreateGameModal(true);
        window.location.hash = 'games';
    }

    function closeCreateGameModal () {
        setShowCreateGameModal(false);
    }

    function openCreateGameLotModal () {
        setShowCreateGameLotModal(true);
        window.location.hash = 'lots';
    }

    function closeCreateGameLotModal () {
        setShowCreateGameLotModal(false);
    }

    function onTabChange(activeKey: string) {
        window.location.hash =  activeKey;
    }

    return <Query query={GET_GAMES_AND_LOTS} pollInterval={10000}>{
        (result: QueryResult<GetGamesAndLotsResponse>) => {
            const {data, refetch, loading, error} = result;
            return <React.Fragment>
                    <PageHeader
                    onBack={() => window.history.back()}
                    title="Gestion des jeux"
                    subTitle={activeTab === 'games' ? 'Jeux' : 'Lots'}
                    backIcon={false}
                    extra={[
                        <Button key="1" onClick={openCreateGameModal}><Icon type="plus" /> Jeu</Button>,
                        <Button key="2" onClick={openCreateGameLotModal}><Icon type="plus" /> Lot</Button>,
                    ]}
                    footer={
                        <Tabs activeKey={activeTab} animated={false} onChange={onTabChange}>
                            <Tabs.TabPane tab="Jeux" key="games">
                                <GamesTable result={result} reloadGames={refetch} createGame={openCreateGameModal} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Lots" key="lots">
                                <GameLotsTable result={result} reloadGameLots={refetch} createLot={openCreateGameLotModal} />
                            </Tabs.TabPane>
                        </Tabs>
                    }
                />
                {!loading && !error && data &&
                    <React.Fragment>
                        <CreateGameModal close={closeCreateGameModal} visible={showCreateGameModal} reloadGames={refetch} />
                        <CreateGameLotModal close={closeCreateGameLotModal} visible={showCreateGameLotModal} reloadLots={refetch} poolId={data.lotPool._id} />
                    </React.Fragment>
                }
            </React.Fragment>
        }
    }</Query>
}

export default GameEditor;
