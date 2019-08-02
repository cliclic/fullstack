import './GamesTable.scss'
import * as React from 'react';
import {Button, Divider, Icon, Table} from "antd";
import {Game} from "../common/consts";
import {ApolloQueryResult} from "apollo-client";
import {DELETE_GAME, DeleteGameResponse, DeleteGameVariables, GetGamesAndLotsResponse} from "../common/apolloQueries";
import {Mutation, QueryResult} from "react-apollo";
import moment from "moment";

const {Column} = Table;

interface GamesTableProps {
    result: QueryResult<GetGamesAndLotsResponse>,
    editGame: (game?: Game) => void,
    reloadGames: () => Promise<ApolloQueryResult<GetGamesAndLotsResponse>>
}

function displayDate (text: string) {
    return moment(text).format('DD/MM/YYYY');
}

export function GamesTable(props: GamesTableProps) {
    const {result} = props;
    const {data, loading} = result;
    const games = data && data.games ? data.games : [];

    const locale = {
        emptyText: (<div className="no-data" onClick={() => props.editGame()}><Icon type="plus" /><br />Créer un jeu</div>)
    };

    function ActionsCell (_: undefined, game: Game) {

        return <span>
        <Button size="small" icon="edit" shape="circle" type="primary" onClick={() => props.editGame(game)} />
        <Divider type="vertical" />
        <Mutation<DeleteGameResponse, DeleteGameVariables> mutation={DELETE_GAME}>{
            (deleteGame) => {
                async function onDeleteClicked() {
                    await deleteGame({variables: {id: game._id}});
                }
                return <Button icon="delete" shape="circle" type="danger" size="small" onClick={onDeleteClicked} />;
            }
        }
        </Mutation>
    </span>
    }

    return <Table className="gamesTable" loading={loading} dataSource={games} rowKey="_id" locale={locale} size="small">
        <Column title="Titre" dataIndex="title" />
        <Column title="Début" dataIndex="startAt" render={displayDate} />
        <Column title="Fin" dataIndex="endAt" render={displayDate} />
        <Column title="Décompte à" dataIndex="winningDelay" />
        <Column title="Actions" render={ActionsCell} width={250}/>
    </Table>
}
