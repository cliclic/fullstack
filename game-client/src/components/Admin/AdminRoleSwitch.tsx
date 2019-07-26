import * as React from 'react';
import {Role, User} from "../common/consts";
import {Tag} from "antd";
import {useState} from "react";
import {Mutation} from "react-apollo";
import {GET_USER_ROLES, SET_USER_ROLES, SetUserRolesResponse, SetUserRolesVariables} from "../common/apolloQueries";

interface AdminRoleSwitchProps {
    user: User
}

export function AdminRoleSwitch(props: AdminRoleSwitchProps) {
    const {user} = props;
    const [checked, setChecked] = useState(user.roles.indexOf(Role.Admin) > -1);

    return <Mutation<SetUserRolesResponse, SetUserRolesVariables>
        mutation={SET_USER_ROLES}
        update={(cache, { data }) => {
            if (data) {
                const {updateUser} = data;
                user.roles = updateUser.roles;
                cache.writeQuery({
                    query: GET_USER_ROLES,
                    variables: {id: updateUser._id},
                    data: { user },
                });
                setChecked(updateUser.roles.indexOf(Role.Admin) > -1);
            }
        }}
    >{
        (setUserRoles) => {

            function onCheckChange(checked: boolean) {
                if (checked) {
                    setUserRoles({variables: {id: user._id, roles: [Role.Admin, Role.User]}});
                } else {
                    setUserRoles({variables: {id: user._id, roles: [Role.User]}});
                }
            }

            return <Tag.CheckableTag checked={checked} onChange={onCheckChange}>Admin</Tag.CheckableTag>
        }
    }</Mutation>
}
