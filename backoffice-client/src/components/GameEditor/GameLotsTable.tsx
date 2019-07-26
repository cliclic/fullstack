import * as React from 'react';
import {Button, Table, Tag} from "antd";
import {GameLotPool, GameLot} from "../common/consts";
import {ApolloQueryResult} from "apollo-client";
import {DELETE_GAME_LOT, DeleteGameLotResponse, DeleteGameLotVariables, GetGameLotsResponse} from "../common/apolloQueries";
import {Mutation} from "react-apollo";

const {Column} = Table;

interface GameLotsTableProps {
    pool: GameLotPool,
    reloadGameLots: () => Promise<ApolloQueryResult<GetGameLotsResponse>>
}

export function GameLotsTable(props: GameLotsTableProps) {

    function renderActionsCell (_: undefined, gameLot: GameLot) {
        return <span>
        { gameLot.winnerShot &&
        <Mutation<DeleteGameLotResponse, DeleteGameLotVariables> mutation={DELETE_GAME_LOT}>{
            (deleteGameLot) => {
                async function onDeleteClicked()
                {
                    await deleteGameLot({variables: {poolId: props.pool._id, id: gameLot._id}});
                }

                return <Button type="danger" onClick={onDeleteClicked}>Supprimer</Button>;
            }
        }
        </Mutation>
        }
    </span>
    }

    return <Table dataSource={props.pool.lots} rowKey="_id">
        <Column title="Titre" dataIndex="title" />
        <Column title="Description" dataIndex="text" />
        <Column title="Gagné" dataIndex="winnerShot" />
        <Column title="Gagnant" dataIndex="winnerShot" />
        <Column title="Actions" render={renderActionsCell} />
    </Table>
}
