import * as classNames from 'classnames';
import * as React from 'react';
import {keys} from 'ts-transformer-keys';
import * as _ from 'underscore';

import {SlideY} from '../../animations/SlideY';
import {IReactVaporState} from '../../ReactVapor';
import {EventUtils} from '../../utils/EventUtils';
import {callIfDefined} from '../../utils/FalsyValuesUtils';
import {IDispatch, ReduxConnect} from '../../utils/ReduxUtils';
import {IActionOptions} from '../actions/Action';
import {addActionsToActionBar} from '../actions/ActionBarActions';
import {Collapsible} from '../collapsible/Collapsible';
import {CollapsibleToggle} from '../collapsible/CollapsibleToggle';
import {TableRowActions} from './actions/TableRowActions';
import {ITableRowState} from './reducers/TableRowReducers';
import {TableSelectors} from './TableSelectors';

export interface CollapsibleRowProps {
    content?: React.ReactNode;
    className?: string;
    expandOnMount?: boolean;
    renderCustomToggleCell?: (opened: boolean) => React.ReactNode;
}

export interface ITableRowOwnProps {
    id: string;
    tableId: string;
    actions?: IActionOptions[];
    isMultiselect?: boolean;
    collapsible?: CollapsibleRowProps;
    disabled?: boolean;
}

export interface ITableRowStateProps {
    selected: boolean;
    opened: boolean;
}

export interface ITableRowDispatchProps {
    onMount: () => void;
    onUnmount: () => void;
    onClick: (isMulti: boolean) => void;
    onUpdateToCollapsibleRow: () => void;
}

export interface ITableRowConnectedProps extends
    ITableRowOwnProps,
    Partial<ITableRowStateProps>,
    Partial<ITableRowDispatchProps> {}

const TableRowPropsToOmit = keys<ITableRowConnectedProps>();

const isCollapsible = (props: ITableRowOwnProps): boolean => props.collapsible
    && (React.isValidElement(props.collapsible.content) || _.isString(props.collapsible.content));

const mapStateToProps = (state: IReactVaporState, ownProps: ITableRowOwnProps) => {
    const row: ITableRowState = TableSelectors.getTableRow(state, {id: ownProps.id});
    return {
        selected: row && row.selected,
        opened: row && row.opened,
    };
};

const mapDispatchToProps = (
    dispatch: IDispatch,
    ownProps: ITableRowOwnProps,
): ITableRowDispatchProps => ({
    onMount: () => {
        dispatch(TableRowActions.add(ownProps.id, ownProps.tableId));
        if (isCollapsible(ownProps) && ownProps.collapsible.expandOnMount) {
            dispatch(TableRowActions.toggleCollapsible(ownProps.id, true));
        }
    },
    onUnmount: () => dispatch(TableRowActions.remove(ownProps.id)),
    onClick: (isMulti: boolean) => {
        if (!_.isEmpty(ownProps.actions)) {
            dispatch(addActionsToActionBar(ownProps.tableId, ownProps.actions));
            dispatch(TableRowActions.select(ownProps.id, isMulti));
        }
        if (isCollapsible(ownProps)) {
            dispatch(TableRowActions.toggleCollapsible(ownProps.id));
        }
    },
    onUpdateToCollapsibleRow: () => {
        if (ownProps.collapsible.expandOnMount) {
            dispatch(TableRowActions.toggleCollapsible(ownProps.id, true));
        }
    },
});

@ReduxConnect(mapStateToProps, mapDispatchToProps)
class TableRowConnected extends React.PureComponent<ITableRowConnectedProps & React.HTMLAttributes<HTMLTableRowElement>> {
    static defaultProps: Partial<ITableRowOwnProps>;

    componentDidUpdate(prevProps: ITableRowConnectedProps) {
        if (!isCollapsible(prevProps) && isCollapsible(this.props)) {
            this.props.onUpdateToCollapsibleRow();
        }
    }

    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const rowIsCollapsible = isCollapsible(this.props);
        const collapsibleContentRow = rowIsCollapsible && (
            <tr
                key={`${this.props.tableId}-${this.props.id}-collapsible`}
                className={classNames(
                    'collapsible-row',
                    this.props.collapsible.className,
                    {
                        'in': this.props.opened,
                    },
                )}>
                <td colSpan={this.columnCount + 1}>
                    <SlideY
                        id={`${this.props.tableId}-${this.props.id}-collapsible`}
                        in={this.props.opened}
                        timeout={Collapsible.TIMEOUT}
                        duration={Collapsible.TIMEOUT}>
                        {this.props.collapsible.content}
                    </SlideY>
                </td>
            </tr>
        );

        let collapsibleRowToggle: React.ReactNode = [];
        if (rowIsCollapsible) {
            const customToggle = callIfDefined(this.props.collapsible.renderCustomToggleCell, this.props.opened);
            collapsibleRowToggle = React.isValidElement(customToggle)
                ? customToggle
                : <td><CollapsibleToggle expanded={this.props.opened} svgClassName='mod-12' /></td>;
        }

        return (
            <React.Fragment key={`${this.props.tableId}-${this.props.id}`}>
                <tr
                    key={`${this.props.tableId}-${this.props.id}-heading`}
                    {..._.omit(this.props, TableRowPropsToOmit)}
                    className={classNames(
                        this.props.className,
                        {
                            selected: this.props.selected,
                            opened: this.props.opened,
                            'heading-row': rowIsCollapsible,
                            'row-disabled': this.props.disabled,
                        },
                    )}
                    onClick={this.handleClick}
                    onDoubleClick={this.handleDoubleClick}
                >
                    {this.props.children}
                    {collapsibleRowToggle}
                </tr>
                {collapsibleContentRow}
            </React.Fragment>
        );
    }

    private get columnCount(): number {
        return React.Children.toArray(this.props.children).filter((child: React.ReactChild) => React.isValidElement(child)).length;
    }

    private handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
        if (!EventUtils.isClickingInsideElementWithClassname(e, 'dropdown')) {
            const isMulti = (e.metaKey || e.ctrlKey) && this.props.isMultiselect;
            this.props.onClick(isMulti);
        }
    }

    private handleDoubleClick = () => {
        _(this.props.actions)
            .filter((action: IActionOptions) => action.callOnDoubleClick)
            .forEach((action: IActionOptions) => action.trigger());
    }
}

TableRowConnected.defaultProps = {
    actions: [],
    isMultiselect: false,
    collapsible: {},
};

export {TableRowConnected};
