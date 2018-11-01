import * as _ from 'underscore';
import {IReduxAction} from '../../../utils/ReduxUtils';
import {ITableHeaderAddPayload, ITableHeaderRemovePayload, ITableHeaderSortPayload, TableHeaderActionsType} from '../actions/TableHeaderActions';

export interface ITableWithSortState {
    id: string;
    tableId: string;
    isAsc: boolean;
}

const addTableHeaderReducer = (state: ITableWithSortState[], action: IReduxAction<ITableHeaderAddPayload>) => {
    return [
        ...state,
        {
            id: action.payload.id,
            tableId: action.payload.tableId,
            isAsc: action.payload.isDefault === true ? true : undefined,
        },
    ];
};

const removeTableHeaderReducer = (state: ITableWithSortState[], action: IReduxAction<ITableHeaderRemovePayload>) => {
    return _.reject(state, (header: ITableWithSortState) => header.id === action.payload.id);
};

const sortTableHeaderReducer = (state: ITableWithSortState[], action: IReduxAction<ITableHeaderSortPayload>) => {
    const current = _.findWhere(state, {id: action.payload.id});
    if (current) {
        return _.map(state, (header: ITableWithSortState) => {
            if (header.id === current.id) {
                return {
                    ...header,
                    isAsc: !header.isAsc,
                };
            }
            return header.tableId === current.tableId ? {...header, isAsc: undefined} : header;
        });
    }
    return state;
};

const TableWithSortActionReducers: {[key: string]: (...args: any[]) => any} = {
    [TableHeaderActionsType.add]: addTableHeaderReducer,
    [TableHeaderActionsType.remove]: removeTableHeaderReducer,
    [TableHeaderActionsType.sort]: sortTableHeaderReducer,
};

type ITableHeaderPayload = ITableHeaderAddPayload | ITableHeaderRemovePayload | ITableHeaderSortPayload;
export const TableWithSortReducers = (state: ITableWithSortState[] = [], action: IReduxAction<ITableHeaderPayload>) => {
    if (!_.isUndefined(TableWithSortActionReducers[action.type])) {
        return TableWithSortActionReducers[action.type](state, action);
    }
    return state;
};
