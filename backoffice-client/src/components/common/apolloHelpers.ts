import {OperationVariables, QueryResult} from "react-apollo";

export function queryHandler<T, V = OperationVariables> (callback: (result: QueryResult<T, V>) => JSX.Element | null) {
    return (result: QueryResult<T, V>) => {
        console.log ('query data', result.data);
        if (result.loading || !result.data) {
            if (result.error) return `Error! ${result.error.message}`;
            else return "Loading...";
        } else {
            return callback(result);
        }
    }
}
