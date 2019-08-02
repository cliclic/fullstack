import * as React from 'react';
import {Query} from "react-apollo";
import {queryHandler} from "../common/apolloHelpers";
import {AdminUserTable} from "./AdminUserTable";
import {GET_USERS, GetUsersResponse} from "../common/apolloQueries";
import {Button, Icon, PageHeader} from "antd";
import {useState} from "react";
import {CreateUserModal} from "./CreateUserModal";

export default function Admin () {
    const [showCreateUserModal, setShowCreateUserModal] = useState(false)

    function openCreateUserModal () {
        setShowCreateUserModal(true);
    }

    function closeCreateUserModal () {
        setShowCreateUserModal(false);
    }

    return <Query query={GET_USERS} pollInterval={30000}>{
        queryHandler<GetUsersResponse>(({data, refetch}) => {
            return <React.Fragment>
                    <PageHeader
                    title="Administration"
                    subTitle="Utilisateurs"
                    backIcon={false}
                    extra={[
                        <Button key="1" onClick={openCreateUserModal} type="primary"><Icon type="plus" /> Utilisateur</Button>,
                    ]}
                />
                <AdminUserTable users={data!.users} reloadUsers={refetch} />
                <CreateUserModal close={closeCreateUserModal} visible={showCreateUserModal} reloadUsers={refetch} />
            </React.Fragment>
        })
    }</Query>
}
