import { IReduxAction, ReduxUtils } from '../../utils/ReduxUtils';
import { IReduxActionsPayload, IReactVaporState } from '../../ReactVapor';
import { ITableHeadingRowOwnProps, TableHeadingRow, ITableHeadingRowProps } from './TableHeadingRow';
import { ITableRowState } from './TableRowReducers';
import { toggleRow, addRow, removeRow } from './TableRowActions';
import { connect } from 'react-redux';
import * as React from 'react';
import * as _ from 'underscore';

const mapStateToProps = (state: IReactVaporState, ownProps: ITableHeadingRowOwnProps) => {
  let item: ITableRowState = _.findWhere(state.rows, { id: ownProps.id });

  return {
    opened: item && item.opened
  };
};

const mapDispatchToProps = (dispatch: (action: IReduxAction<IReduxActionsPayload>) => void,
  ownProps: ITableHeadingRowOwnProps) => ({
    onClick: () => {
      if (ownProps.isCollapsible) {
        dispatch(toggleRow(ownProps.id));
      }
    },
    onRender: () => {
      if (ownProps.isCollapsible) {
        dispatch(addRow(ownProps.id));
      }
    },
    onDestroy: () => {
      if (ownProps.isCollapsible) {
        dispatch(removeRow(ownProps.id));
      }
    }
  });

export const TableHeadingRowConnected: React.ComponentClass<ITableHeadingRowProps> =
  connect(mapStateToProps, mapDispatchToProps, ReduxUtils.mergeProps)(TableHeadingRow);