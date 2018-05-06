import {mount, ReactWrapper} from 'enzyme';
import * as React from 'react';
import {Provider, Store} from 'react-redux';

import {IReactVaporState} from '../../../ReactVapor';
import {clearState} from '../../../utils/ReduxUtils';
import {TestUtils} from '../../../utils/TestUtils';
import {ITableCollapsibleRowProps, TableCollapsibleRow} from '../TableCollapsibleRow';
import {TableCollapsibleRowConnected} from '../TableCollapsibleRowConnected';
import {addRow} from '../TableRowActions';

// tslint:disable-next-line:no-unused-variable
describe('Tables', () => {

    describe('<TableCollapsibleRowConnected />', () => {
        let wrapper: ReactWrapper<any, any>;
        let tableCollapsibleRow: ReactWrapper<ITableCollapsibleRowProps, any>;
        let basicTableCollapsibleRowProps: ITableCollapsibleRowProps;
        let store: Store<IReactVaporState>;

        const refreshWrapperWhenDone = TestUtils.buildRefreshFunction(() => {
            tableCollapsibleRow = wrapper.find(TableCollapsibleRow).first();
        });

        beforeEach(() => {
            basicTableCollapsibleRowProps = {
                id: 'collapsible-row',
                nbColumns: 6,
                isInError: true,
                error: {
                    errorDescription: 'error',
                    errorPrecision: 'the row is in error',
                    errorTroubleshoot: 'you should do something',
                    errorStatus: 'urgent',
                    errorCode: 'error_1',
                },
            };

            store = TestUtils.buildStore();

            wrapper = mount(
                <Provider store={store}>
                    <table>
                        <tbody>
                            <TableCollapsibleRowConnected {...basicTableCollapsibleRowProps} />
                        </tbody>
                    </table>
                </Provider>,
                {attachTo: document.getElementById('App')},
            );

            refreshWrapperWhenDone(wrapper, () => store.dispatch(addRow(basicTableCollapsibleRowProps.id)));
        });

        afterEach(() => {
            store.dispatch(clearState());
            wrapper.unmount();
            wrapper.detach();
        });

        it('should get if it is opened as a prop', () => {
            const openedProp = tableCollapsibleRow.props().opened;

            expect(openedProp).toBeDefined();
            expect(openedProp).toBe(false);
        });
    });
});
