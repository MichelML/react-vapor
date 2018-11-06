import * as React from 'react';
import {ITableHOCOwnProps} from './TableHOC';

export interface ITableWithActionsConfig {}

export interface ITableWithActionsProps extends ITableHOCOwnProps {}

type TableWithActionsComponent = React.ComponentClass<ITableWithActionsProps>;

export const tableWithActions = (config: ITableWithActionsConfig = {}) => (Component: TableWithActionsComponent): TableWithActionsComponent => {

    class TableWithActions extends React.Component<ITableWithActionsProps> {

        render() {
            return (
                <Component {...this.props} hasActionButtons>
                    {this.props.children}
                </Component>
            );
        }
    }

    return TableWithActions;
};
