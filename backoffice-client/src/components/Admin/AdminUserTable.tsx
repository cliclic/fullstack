import * as React from 'react';
import {Button, Table, Tag} from "antd";
import {Role, User} from "../common/consts";
import {AdminRoleSwitch} from "./AdminRoleSwitch";
import {ApolloQueryResult} from "apollo-client";
import {DELETE_USER, DeleteUserResponse, DeleteUserVariables, GetUsersResponse} from "../common/apolloQueries";
import {Mutation} from "react-apollo";

const {Column} = Table;

interface AdminUserTableProps {
    users: User[],
    reloadUsers: () => Promise<ApolloQueryResult<GetUsersResponse>>
}

export function AdminUserTable(props: AdminUserTableProps) {
    return <Table dataSource={props.users} rowKey="_id" size="small" pagination={false}>
        <Column title="Nom" dataIndex="displayName" />
        <Column title="Login" dataIndex="username" />
        <Column title="Roles" dataIndex="roles" render={renderRolesCell}/>
        <Column title="Actions" render={ActionsCell} width={250} />
    </Table>
}

function renderRolesCell (roles: Role[], user: User) {
    if (user.roles.indexOf(Role.Super) > -1) {
        return <Tag color="red">Super</Tag>
    } else {
        return <AdminRoleSwitch user={user} />
    }
}

function ActionsCell (_: undefined, user: User) {

    return <span>
        {user.roles.indexOf(Role.Super) === -1 &&
            <Mutation<DeleteUserResponse, DeleteUserVariables> mutation={DELETE_USER}>{
                (deleteUser) => {
                    async function onDeleteClicked() {
                        await deleteUser({variables: {id: user._id}});

                    }
                    return <Button type="danger" shape="circle" size="small" icon="delete" onClick={onDeleteClicked} />;
                }
            }
            </Mutation>
        }
    </span>
}
