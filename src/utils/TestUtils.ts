import * as React from 'react';
import {DragDropContext} from 'react-dnd';
import TestBackend from 'react-dnd-test-backend';
import * as Redux from 'redux';
import thunk from 'redux-thunk';
import * as _ from 'underscore';

import {ISvgProps} from '../components/svg/Svg';
import {ITooltipProps} from '../components/tooltip/Tooltip';
import {IReactVaporState} from '../ReactVapor';
import {radioSelectsReducer} from './../components/radio/RadioSelectReducers';
import {CommonActions} from './ReduxUtils';

export interface IReactVaporTestState extends IReactVaporState {
    lastAction?: Redux.Action;
}

export class TestUtils {
    static buildStore() {
        const reactVaporReducers = Redux.combineReducers<IReactVaporState>({
            autocompletes: autocompletesReducer,
            lastAction: lastActionReducer,
            lastUpdatedComposite: lastUpdatedCompositeReducer,
            filters: filterBoxesReducer,
            facets: facetsReducer,
            paginationComposite: paginationCompositeReducer,
            perPageComposite: perPageCompositeReducer,
            loadings: loadingsReducer,
            listBoxes: listBoxesReducer,
            prompts: promptsReducer,
            actionBars: actionBarsReducer,
            dropdowns: dropdownsReducer,
            dropdownSearch: dropdownsSearchReducer,
            flatSelect: flatSelectsReducer,
            rows: tableRowsReducer,
            tableHeaderCells: tableHeaderCellsReducer,
            optionsCycles: optionsCyclesReducer,
            optionPickers: optionPickersReducer,
            datePickers: datePickersReducer,
            itemFilters: itemFiltersReducer,
            modals: modalsReducer,
            selects: selectCompositeReducer,
            subNavigations: subNavigationsReducer,
            tabs: tabGroupsReducer,
            toastContainers: toastsContainerReducer,
            tables: tablesReducer,
            checkboxes: checkboxesReducer,
            collapsibles: collapsiblesReducer,
            inputs: inputsReducer,
            searchBars: searchBarsReducer,
            flippables: flippablesReducer,
            groupableCheckboxes: groupableCheckboxesReducer,
            textAreas: textAreasReducer,
            menus: menuCompositeReducer,
            radioSelects: radioSelectsReducer,
        });

        const reactVapor = (state: IReactVaporTestState, action: Redux.Action) => {
            state = action.type === CommonActions.clearState ? undefined : state;
            return reactVaporReducers(state, action as any);
        };

        return Redux.createStore(reactVapor, Redux.applyMiddleware(thunk));
    }

    static randomDate() {
        return new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
    }

    static makeDebounceStatic() {
        // tslint:disable
        spyOn(_, 'debounce').and.callFake(function(func: () => void) {
            return function(this: any) {
                func.apply(this, arguments);
            };
        });
        // tslint:enable
    }

    static wrapComponentInDnDContext(WrappedComponent: any) {
        @DragDropContext(TestBackend)
        class TestContextContainer extends React.Component<any, any> {
            render() {
                return React.createElement(WrappedComponent, this.props);
            }
        }

        return TestContextContainer;
    }
}

export const defaultSvgProps: ISvgProps = {
    svgName: 'domain-google',
    svgClass: 'icon mod-2x',
};

export const defaultTooltipProps: ITooltipProps = {
    title: 'default tooltip description',
    placement: 'bottom',
    container: 'body',
};

export const triggerAlertFunction = () => {
    alert(`Alert function triggered`);
};
