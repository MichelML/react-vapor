import * as classNames from 'classnames';
import * as React from 'react';
import * as _ from 'underscore';

import {IReactVaporState} from '../../ReactVapor';
import {callIfDefined} from '../../utils/FalsyValuesUtils';
import {IDispatch, ReduxConnect} from '../../utils/ReduxUtils';
import {Content} from '../content/Content';
import {IItemBoxProps} from '../itemBox/ItemBox';
import {ISelectButtonProps, ISelectProps, SelectConnected} from './SelectConnected';

export interface ISingleSelectOwnProps extends ISelectProps {
    placeholder?: string;
    toggleClasses?: string;
    onSelectOptionCallback?: (option: string) => void;
}

export interface ISingleSelectStateProps {
    selected?: string;
}

export interface ISingleSelectDispatchProps {}

export interface ISingleSelectProps extends ISingleSelectOwnProps, ISingleSelectStateProps, ISingleSelectDispatchProps {}

const mapStateToProps = (state: IReactVaporState, ownProps: ISingleSelectOwnProps): ISingleSelectStateProps => {
    const listbox = _.findWhere(state.listBoxes, {id: ownProps.id});
    return {
        selected: listbox && listbox.selected && listbox.selected.length ? listbox.selected[0] : undefined,
    };
};

const mapDispatchToProps = (dispatch: IDispatch, ownProps: ISingleSelectOwnProps): ISingleSelectDispatchProps => ({});

@ReduxConnect(mapStateToProps, mapDispatchToProps)
export class SingleSelectConnected extends React.Component<ISingleSelectProps, {}> {

    static defaultProps: Partial<ISingleSelectOwnProps> = {
        placeholder: 'Select an option',
    };

    componentDidUpdate(prevProps: ISingleSelectProps) {
        if (prevProps.selected !== this.props.selected) {
            callIfDefined(this.props.onSelectOptionCallback, this.props.selected);
        }
    }

    render() {
        return (
            <SelectConnected
                id={this.props.id}
                button={(props: ISelectButtonProps) => this.getButton(props)}
                items={this.props.items}>
                {this.props.children}
            </SelectConnected>
        );
    }

    private getButton(props: ISelectButtonProps): JSX.Element {
        const option = _.findWhere(this.props.items, {value: this.props.selected});
        return (
            <button
                className={classNames(['btn', 'dropdown-toggle', this.props.toggleClasses])}
                type='button'
                onMouseUp={props.onMouseUp}
                onKeyDown={props.onKeyDown}
                onKeyUp={props.onKeyUp}
            >
                {option && option.prepend ? <Content {...option.prepend} /> : null}
                {this.getSelectedOptionElement(option)}
                {option && option.append ? <Content {...option.append} /> : null}
                <span className='dropdown-toggle-arrow' />
            </button>
        );
    }

    private getSelectedOptionElement(option: IItemBoxProps): JSX.Element {
        if (option) {
            const displayValue = option.displayValue || option.value;
            return (
                <span
                    key={option.value}
                    className='dropdown-selected-value'
                    data-value={option.value}
                    title={displayValue}
                >
                    {displayValue}
                </span>
            );
        }

        return <span className='dropdown-no-value'>{this.props.placeholder}</span>;
    }
}