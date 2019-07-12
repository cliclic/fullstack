import {QueryResult} from "react-apollo";

export function queryHandler<T> (callback: (data: T) => JSX.Element | null) {
    return ({ loading, error, data } : QueryResult<T>) => {
        if (!data || loading) return "Loading...";
        if (error) return `Error! ${error.message}`;

        return callback(data);
    }
}
