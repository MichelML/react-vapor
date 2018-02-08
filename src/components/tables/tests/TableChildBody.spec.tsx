import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { Provider, Store } from 'react-redux';
import * as _ from 'underscore';
import { clearState, IReactVaporState } from '../../../Index';
import { TestUtils } from '../../../utils/TestUtils';
import { IActionOptions } from '../../actions/Action';
import { IData } from '../Table';
import { ITableChildBodyProps, TableChildBody } from '../table-children/TableChildBody';
import { TableCollapsibleRow } from '../TableCollapsibleRow';
import { TableHeadingRow } from '../TableHeadingRow';
import { TableRowWrapper } from '../TableRowWrapper';

describe('<TableChildBody />', () => {
  const someActions: IActionOptions[] = [];
  const tableChildBodyProps: ITableChildBodyProps = {
    tableId: 'best-table',
    rowData: {
      id: 'random-row',
      email: 'someone@somewhere.com',
      url: 'www.somewher.com',
      aProperty: false,
    },
    isLoading: false,
    onRowClick: jasmine.createSpy('onRowClick'),
    getActions: jasmine.createSpy('getActions').and.returnValue(someActions),
    headingAttributes: [
      {
        attributeName: 'email',
        titleFormatter: _.identity,
        attributeFormatter: _.escape,
        filterFormatter: _.identity,
      },
    ],
  };

  let store: Store<IReactVaporState>;

  beforeEach(() => {
    store = TestUtils.buildStore();
  });

  afterEach(() => {
    store.dispatch(clearState());
  });

  describe('render', () => {
    const mountComponentWithProps = (props: ITableChildBodyProps = tableChildBodyProps) => {
      const wrapper: ReactWrapper<any, any> = mount(
        <Provider store={store}>
          <TableChildBody {...props} />
        </Provider>,
        { attachTo: document.getElementById('App') },
      );
      return wrapper.find(TableChildBody);
    };

    it('should render without error', () => {
      expect(() => mountComponentWithProps()).not.toThrow();
    });

    it('should render a <TableRowWrapper />', () => {
      expect(mountComponentWithProps().find(TableRowWrapper).length).toBe(1);
    });

    it('should render a <TableHeadingRow />', () => {
      expect(mountComponentWithProps().find(TableHeadingRow).length).toBe(1);
    });

    it('should not render a <TableCollapsibleRow /> if there is not a defined collapsibleFormatter ouput', () => {
      expect(mountComponentWithProps().find(TableCollapsibleRow).length).toBe(0);
    });

    it('should render a <TableCollapsibleRow /> if there is a defined collapsibleFormatter ouput', () => {
      const newProps: ITableChildBodyProps = _.extend({}, tableChildBodyProps, { collapsibleFormatter: (rowData: IData) => rowData.url });
      expect(mountComponentWithProps(newProps).find(TableCollapsibleRow).length).toBe(1);
    });

    it('should render a wrapper', () => {
      expect(mountComponentWithProps().find('.wrapper').length).toBe(1);
    });

    it('should call onRowClick with getActions result if it is defined on click of a heading row', () => {
      mountComponentWithProps().find(TableHeadingRow).simulate('click');

      expect(tableChildBodyProps.onRowClick).toHaveBeenCalledTimes(1);
      expect(tableChildBodyProps.getActions).toHaveBeenCalledTimes(1);

      expect(tableChildBodyProps.onRowClick).toHaveBeenCalledWith(someActions);
      expect(tableChildBodyProps.getActions).toHaveBeenCalledWith(tableChildBodyProps.rowData);
    });

    it('should not throw on row double click and getAction prop is undefined', () => {
      const propsWithoutGetActions: ITableChildBodyProps = _.extend({}, tableChildBodyProps, { getActions: undefined });

      const row = mountComponentWithProps(propsWithoutGetActions).find(TableHeadingRow);

      expect(() => row.simulate('dblclick')).not.toThrow();
    });

    it('should call getActions results with option callOnDoubleClick true on row double click', () => {
      const actionSpy: jasmine.Spy = jasmine.createSpy('actionSpy');
      const twoActions: IActionOptions[] = [{
        name: 'action that should not be called',
        enabled: true,
        trigger: () => {
          throw new Error('This action should not be called');
        },
      }, {
        name: 'action that should be called',
        callOnDoubleClick: true,
        enabled: true,
        trigger: actionSpy,
      }];
      const getActionsSpy: jasmine.Spy = jasmine.createSpy('getActions').and.returnValue(twoActions);
      const newProps: ITableChildBodyProps = _.extend({}, tableChildBodyProps, { getActions: getActionsSpy });

      mountComponentWithProps(newProps).find(TableHeadingRow).simulate('dblclick');

      expect(getActionsSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledTimes(1);
    });

    it('should send not send disabled as a class to the <TableHeadingRow /> if there is no enabled or disabled property on the row data', () => {
      expect(mountComponentWithProps().find('.disabled').length).toBe(0);
    });

    it('should send not send disabled as a class to the <TableHeadingRow /> if the enabled property is set to true on the row data', () => {
      const newProps: ITableChildBodyProps = _.extend({}, tableChildBodyProps, { rowData: _.extend({}, tableChildBodyProps.rowData, { enabled: true }) });
      expect(mountComponentWithProps(newProps).find('.disabled').length).toBe(0);
    });

    it('should send send disabled as a class to the <TableHeadingRow /> if the enabled property is set to false on the row data', () => {
      const newProps: ITableChildBodyProps = _.extend({}, tableChildBodyProps, { rowData: _.extend({}, tableChildBodyProps.rowData, { enabled: false }) });
      expect(mountComponentWithProps(newProps).find('.disabled').length).toBe(1);
    });

    it('should send send disabled as a class to the <TableHeadingRow /> if the disabled property is set to true on the row data', () => {
      const newProps: ITableChildBodyProps = _.extend({}, tableChildBodyProps, { rowData: _.extend({}, tableChildBodyProps.rowData, { disabled: true }) });
      expect(mountComponentWithProps(newProps).find('.disabled').length).toBe(1);
    });
  });
});
