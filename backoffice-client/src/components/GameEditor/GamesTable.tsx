import './GamesTable.scss'
import * as React from 'react';
import {Button, Icon, Table} from "antd";
import {Game} from "../common/consts";
import {ApolloQueryResult} from "apollo-client";
import {DELETE_GAME, DeleteGameResponse, DeleteGameVariables, GetGamesAndLotsResponse} from "../common/apolloQueries";
import {Mutation, QueryResult} from "react-apollo";

const {Column} = Table;

interface GamesTableProps {
    result: QueryResult<GetGamesAndLotsResponse>,
    createGame: () => void,
    reloadGames: () => Promise<ApolloQueryResult<GetGamesAndLotsResponse>>
}

export function GamesTable(props: GamesTableProps) {
    const {result} = props;
    const {data, loading} = result;
    const games = data && data.games ? data.games : [];

    const locale = {
        emptyText: (<div className="no-data" onClick={props.createGame}><Icon type="plus" /><br />Créer un jeu</div>)
    };

    return <Table className="gamesTable" loading={loading} dataSource={games} rowKey="_id" locale={locale}>
        <Column title="Titre" dataIndex="title" />
        <Column title="Description" dataIndex="text" />
        <Column title="Début" dataIndex="startAt" />
        <Column title="Fin" dataIndex="endAt" />
        <Column title="Décompte à" dataIndex="winningDelay" />
        <Column title="Actions" render={ActionsCell} />
    </Table>
}

function ActionsCell (_: undefined, game: Game) {

    return <span>
        <Mutation<DeleteGameResponse, DeleteGameVariables> mutation={DELETE_GAME}>{
            (deleteGame) => {
                async function onDeleteClicked() {
                    await deleteGame({variables: {id: game._id}});
                }
                return <Button icon="delete" shape="circle" type="danger" size="small" onClick={onDeleteClicked}></Button>;
            }
        }
        </Mutation>
    </span>
}
