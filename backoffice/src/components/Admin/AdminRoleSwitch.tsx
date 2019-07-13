import * as React from 'react';
import {Role, User} from "../common/consts";
import {Tag} from "antd";
import {useState} from "react";
import {gql} from "apollo-boost";
import {Mutation} from "react-apollo";

interface AdminRoleSwitchProps {
    user: User
}

const GET_USER = gql`
    query ReadUserRole($id: ID) {
        user(id: $id) {
            _id
            roles
        }
    }
`

const SET_USER_ROLES = gql`
    mutation SetUserRoles($id: ID, $roles: [Role]) {
        updateUser(id: $id, input: {roles: $roles}) {
            _id
            roles
        }
    }
`;

export function AdminRoleSwitch(props: AdminRoleSwitchProps) {
    const {user} = props;
    const [checked, setChecked] = useState(user.roles.indexOf(Role.Admin) > -1);

    return <Mutation<any>
        mutation={SET_USER_ROLES}
        update={(cache, { data: { updateUser } }) => {
            user.roles = updateUser.roles;
            cache.writeQuery({
                query: GET_USER,
                variables: {id: updateUser._id},
                data: { user },
            });
            setChecked(updateUser.roles.indexOf(Role.Admin) > -1);
        }}
    >{
        (setUserRoles) => {

            function onCheckChange(checked: boolean) {
                if (checked) {
                    setUserRoles({variables: {id: user._id, roles: ['admin', 'user']}});
                } else {
                    setUserRoles({variables: {id: user._id, roles: ['user']}});
                }
            }

            return <Tag.CheckableTag checked={checked} onChange={onCheckChange}>Admin</Tag.CheckableTag>
        }
    }</Mutation>
}
