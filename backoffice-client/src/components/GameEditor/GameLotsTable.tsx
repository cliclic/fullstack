import * as React from 'react';
import {Button, Table, Tag} from "antd";
import {Game, GameLot} from "../common/consts";
import {ApolloQueryResult} from "apollo-client";
import {DELETE_GAME_LOT, DeleteGameLotResponse, DeleteGameLotVariables, GetGameLotsResponse} from "../common/apolloQueries";
import {Mutation} from "react-apollo";

const {Column} = Table;

interface GameLotsTableProps {
    games: Game[],
    reloadGameLots: () => Promise<ApolloQueryResult<GetGameLotsResponse>>
}

export function GameLotsTable(props: GameLotsTableProps) {
    return <Table dataSource={props.games} rowKey="_id">
        <Column title="Titre" dataIndex="title" />
        <Column title="Description" dataIndex="text" />
        <Column title="Gagné" dataIndex="winnerShot" />
        <Column title="Gagnant" dataIndex="winnerShot" />
        <Column title="Actions" render={ActionsCell} />
    </Table>
}

function ActionsCell (_: undefined, gameLot: GameLot) {

    return <span>
        { gameLot.winnerShot &&
            <Mutation<DeleteGameLotResponse, DeleteGameLotVariables> mutation={DELETE_GAME_LOT}>{
                (deleteGameLot) => {
                    async function onDeleteClicked()
                    {
                        await deleteGameLot({variables: {id: gameLot._id}});
                    }

                    return <Button type="danger" onClick={onDeleteClicked}>Supprimer</Button>;
                }
            }
            </Mutation>
        }
    </span>
}
