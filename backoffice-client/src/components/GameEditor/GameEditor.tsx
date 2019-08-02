import * as React from 'react';
import {Query, QueryResult} from "react-apollo";
import {GamesTable} from "./GamesTable";
import {GameLotsTable} from "./GameLotsTable";
import {GET_GAMES_AND_LOTS, GetGamesAndLotsResponse} from "../common/apolloQueries";
import {Button, Icon, PageHeader, Tabs} from "antd";
import {useState} from "react";
import {GameEditorModal } from "./GameEditorModal";
import {GameLotEditorModal } from "./GameLotEditorModal";
import {RouteProps} from "react-router";
import {Game, GameLot} from "../common/consts";

const GameEditor:React.FunctionComponent<RouteProps> = function (props) {
    const activeTab = props.location && props.location.hash === "#lots" ? "lots" : "games";
    const [showGameEditorModal, setShowGameEditorModal] = useState(false)
    const [showGameLotEditorModal, setShowGameLotEditorModal] = useState(false)
    const [editedGameLot, setEditedGameLot] = useState<GameLot>();
    const [editedGame, setEditedGame] = useState<Game>();

    function openGameEditorModal (game?: Game) {
        setEditedGame(game || undefined);
        setShowGameEditorModal(true);
        window.location.hash = 'games';
    }

    function closeGameEditorModal () {
        setShowGameEditorModal(false);
        setEditedGame(undefined);
    }

    function openGameLotEditorModal (gameLot?: GameLot) {
        setEditedGameLot(gameLot || undefined);
        setShowGameLotEditorModal(true);
        window.location.hash = 'lots';
    }

    function closeGameLotEditorModal () {
        setShowGameLotEditorModal(false);
        setEditedGameLot(undefined);
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
                        <Button key="1" onClick={() => openGameEditorModal()} type="primary"><Icon type="plus" /> Jeu</Button>,
                        <Button key="2" onClick={() => openGameLotEditorModal()} type="primary"><Icon type="plus" /> Lot</Button>,
                    ]}
                    footer={
                        <Tabs activeKey={activeTab} animated={false} onChange={onTabChange}>
                            <Tabs.TabPane tab="Jeux" key="games">
                                <GamesTable result={result} reloadGames={refetch} editGame={openGameEditorModal} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Lots" key="lots">
                                <GameLotsTable result={result} reloadGameLots={refetch} editLot={openGameLotEditorModal} />
                            </Tabs.TabPane>
                        </Tabs>
                    }
                />
                {!loading && !error && data &&
                    <React.Fragment>
                        <GameEditorModal close={closeGameEditorModal} visible={showGameEditorModal} reloadGames={refetch} editedGame={editedGame} />
                        <GameLotEditorModal close={closeGameLotEditorModal} visible={showGameLotEditorModal} reloadLots={refetch} poolId={data.lotPool._id} editedLot={editedGameLot} />
                    </React.Fragment>
                }
            </React.Fragment>
        }
    }</Query>
}

export default GameEditor;
