import './GameLotsTable.scss'
import * as React from 'react';
import {Button, Divider, Icon, Popconfirm, Table} from "antd";
import {GameLot, GameLotPool} from "../common/consts";
import {ApolloQueryResult} from "apollo-client";
import {DELETE_GAME_LOT, DeleteGameLotResponse, DeleteGameLotVariables, GetGamesAndLotsResponse, MOVE_GAME_LOT, MoveGameLotVariables, MoveGameLotResponse} from "../common/apolloQueries";
import {Mutation, QueryResult} from "react-apollo";
import {gql} from "apollo-boost";

const {Column} = Table;

export const GET_LOT = gql`{
    lotPool {
        _id,
        lots {
            _id,
            title,
            text,
            winnerShot{
                _id,
                player{
                    _id,
                    originalId,
                    avatar,
                    fullName,
                    firstName,
                    lastName
                },
                message,
                createdAt
            }
        }
    }
}`;


interface GameLotsTableProps {
    result: QueryResult<GetGamesAndLotsResponse>,
    editLot: (gameLot?: GameLot) => void,
    reloadGameLots: () => Promise<ApolloQueryResult<GetGamesAndLotsResponse>>
}

interface GetLotResponse {
    lotPool: GameLotPool;
}

export function GameLotsTable(props: GameLotsTableProps) {

    const {result} = props;
    const {data, loading} = result;
    const lots = data && data.lotPool ? data.lotPool.lots : [];
    const poolId = data && data.lotPool ? data.lotPool._id : '';

    const locale = {
        emptyText: (<div className="no-data" onClick={() => props.editLot()}><Icon type="plus" /><br />Ajouter un lot</div>)
    };

    function ActionsCell (_: undefined, gameLot: GameLot, index: number) {
        return <span>
            <Mutation<MoveGameLotResponse, MoveGameLotVariables>
                mutation={MOVE_GAME_LOT}
                optimisticResponse={{moveGameLot: {success: true, __typename: "MutationResponse"}}}
                update={(proxy, response) => {
                 console.log ('reponse', response, proxy);
                 if (response.data && response.data.moveGameLot.success) {
                     const data = proxy.readQuery<GetLotResponse>({query: GET_LOT});
                     if (data) {
                         const index = data.lotPool.lots.findIndex(lot => lot._id === gameLot._id);
                         if (index > -1)
                         {
                             if (index > 0) {
                                 data.lotPool.lots.splice(index - 1, 0, data.lotPool.lots.splice(index, 1)[0]);
                             }
                         }
                         proxy.writeQuery({ query: GET_LOT, data });
                     }
                 }
                }}
            >{
                (moveUpGameLot) => {
                    async function onClicked() {
                        await moveUpGameLot({variables: {poolId, id: gameLot._id, direction: 'up'}});
                    }
                    return <Button disabled={index === 0} type="link" icon="arrow-up" onClick={onClicked} />;
                }
            }
        </Mutation>
        <Mutation<MoveGameLotResponse, MoveGameLotVariables>
            mutation={MOVE_GAME_LOT}
            optimisticResponse={{moveGameLot: {success: true, __typename: "MutationResponse"}}}
            update={(proxy, response) => {
             console.log ('reponse', response, proxy);
             if (response.data && response.data.moveGameLot.success) {
                 const data = proxy.readQuery<GetLotResponse>({query: GET_LOT});
                 if (data) {
                     const index = data.lotPool.lots.findIndex(lot => lot._id === gameLot._id);
                     if (index > -1)
                     {
                         if (index < data.lotPool.lots.length - 1) {
                             data.lotPool.lots.splice(index + 1, 0, data.lotPool.lots.splice(index, 1)[0]);
                         }
                     }
                     proxy.writeQuery({ query: GET_LOT, data });
                 }
             }
            }}
            >{
                (moveUpGameLot) => {
                    async function onClicked() {
                        console.log (gameLot);
                        await moveUpGameLot({variables: {poolId, id: gameLot._id, direction: 'down'}});
                    }
                    return <Button disabled={index === lots.length - 1} type="link" icon="arrow-down" onClick={onClicked} />;
                }
            }
        </Mutation>
        <Divider type="vertical" />
        <Button size="small" icon="edit" shape="circle" type="primary" onClick={() => props.editLot(gameLot)} />
        <Divider type="vertical" />
        <Mutation<DeleteGameLotResponse, DeleteGameLotVariables>
            mutation={DELETE_GAME_LOT}
            refetchQueries={['lotPool']}
            onCompleted={props.reloadGameLots}
        >{
            (deleteGameLot) => {
                async function confirm() {
                    await deleteGameLot({variables: {poolId, id: gameLot._id}});
                }
                return <Popconfirm
                        title="Êtes vous sûr de vouloir supprimer ce lot ?"
                        onConfirm={confirm}
                        okText="Oui"
                        cancelText="Non"
                        okType="danger"
                        icon={<Icon type="delete" />}
                    >
                    <Button size="small" icon="delete" shape="circle" type="danger" />
                </Popconfirm>
            }
        }
        </Mutation>
    </span>
    }

    return <Table className="gameLotsTable" dataSource={lots} loading={loading} rowKey="_id" locale={locale} size="small">
        <Column title="Titre" dataIndex="title" />
        <Column title="Texte" dataIndex="text" />
        <Column title="Actions" render={ActionsCell} width={250} />
    </Table>
}
