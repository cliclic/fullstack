import React from 'react'
import {Route, Redirect, RouteProps} from 'react-router-dom'
import {Cookies, withCookies} from "react-cookie";

interface AuthenticatedRouteProps extends RouteProps {
    props?: any
    cookies?: Cookies
}

export default withCookies(function AuthenticatedRoute({component: C, props: cProps, cookies, ...rest }: AuthenticatedRouteProps) {
    return (
        <Route
            {...rest}
            render={props =>
                cookies && cookies.get('authenticated') ? (
                    // @ts-ignore
                    <C {...props} {...cProps} />
                ) : (
                    <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`}/>
                )
            }
        />
    )
})
