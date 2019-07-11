import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'

interface AuthenticatedRouteProps extends RouteProps {
  props?: any
}

export default function AuthenticatedRoute({
  component: C,
  props: cProps,
  ...rest
}: AuthenticatedRouteProps) {
  return (
    <Route
      {...rest}
      render={props =>
        cProps && cProps.isAuthenticated ? (
          // @ts-ignore
          <C {...props} {...cProps} />
        ) : (
          <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`} />
        )
      }
    />
  )
}
