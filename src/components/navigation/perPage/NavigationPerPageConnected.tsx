import { ReduxUtils, IReduxAction } from '../../../utils/ReduxUtils';
import { IReactVaporState, IReduxActionsPayload } from '../../../ReactVapor';
import {
  INavigationPerPageProps,
  INavigationPerPageStateProps,
  NavigationPerPage,
  INavigationPerPageDispatchProps,
  INavigationPerPageOwnProps
} from './NavigationPerPage';
import { IPerPageState } from './NavigationPerPageReducers';
import { addPerPage, removePerPage, changePerPage } from './NavigationPerPageActions';
import { changePage } from '../pagination/NavigationPaginationActions';
import { turnOnLoading } from '../../loading/LoadingActions';
import { connect } from 'react-redux';
import * as React from 'react';
import * as _ from 'underscore';

const mapStateToProps = (state: IReactVaporState, ownProps: INavigationPerPageOwnProps): INavigationPerPageStateProps => {
  let item: IPerPageState = _.findWhere(state.perPageComposite, { id: ownProps.id });

  return {
    currentPerPage: item ? item.perPage : null
  };
};

const mapDispatchToProps = (dispatch: (action: IReduxAction<IReduxActionsPayload>) => void,
  ownProps: INavigationPerPageOwnProps): INavigationPerPageDispatchProps => ({
    onRender: (perPageNb: number) => dispatch(addPerPage(ownProps.id, perPageNb)),
    onDestroy: () => dispatch(removePerPage(ownProps.id)),
    onPerPageClick: (perPageNb: number) => {
      let newCurrentPage = ownProps.currentPage && ownProps.currentPerPage ?
        Math.floor(ownProps.currentPage * ownProps.currentPerPage / perPageNb) : 0;

      dispatch(turnOnLoading(ownProps.loadingIds));
      dispatch(changePerPage(ownProps.id, perPageNb));
      dispatch(changePage(`pagination-${ownProps.id}`, newCurrentPage));
    }
  });

export const NavigationPerPageConnected: React.ComponentClass<INavigationPerPageProps> =
  connect(mapStateToProps, mapDispatchToProps, ReduxUtils.mergeProps)(NavigationPerPage);