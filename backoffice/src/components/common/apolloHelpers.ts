import {QueryResult} from "react-apollo";
import ApolloClient from "apollo-client";
import {LocalCache} from "./consts";

export function queryHandler<T> (callback: (data: T, client: ApolloClient<LocalCache>) => JSX.Element | null) {
    return ({ loading, error, data, client } : QueryResult<T>) => {
        if (!data || loading) return "Loading...";
        if (error) return `Error! ${error.message}`;

        return callback(data, client);
    }
}
