import * as React from 'react';
import {Button, Table, Tag} from "antd";
import {Role, User} from "../common/consts";
import {AdminRoleSwitch} from "./AdminRoleSwitch";

const {Column} = Table;

interface AdminUserTableProps {
    users: User[]
}

export function AdminUserTable(props: AdminUserTableProps)
{
    return <Table dataSource={props.users} rowKey="_id">
        <Column title="Nom" dataIndex="displayName" />
        <Column title="Login" dataIndex="username" />
        <Column title="Roles" dataIndex="roles" render={renderRolesCell}/>
        <Column title="Actions" render={renderActionsCell}/>
    </Table>
}

function renderRolesCell (roles: Role[], user: User) {
    return <AdminRoleSwitch user={user} />
}

function renderActionsCell (_: undefined, user: User) {
    return <span>
        <Button type="danger">Danger</Button>
    </span>
}
