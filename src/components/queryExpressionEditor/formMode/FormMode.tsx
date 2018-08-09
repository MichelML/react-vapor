import * as React from 'react';
import * as _ from 'underscore';
import {Button} from '../../button/Button';
// import {ReactVaporStore} from '../../../../docs/ReactVaporStore';
import {ExpressionEditorConnected} from '../expressionEditor/ExpressionEditorConnected';
import {IExpressionEditorState} from '../expressionEditor/ExpressionEditorReducers';
import {QueryTrigger} from '../queryTrigger/QueryTrigger';
import {IField} from '../responseParser/ResponseParser';
// import { selectListBoxOption } from '../../listBox/ListBoxActions';
// import { booleanOperatorSelectId } from '../booleanOperatorSelect/BooleanOperatorSelect';

export const expressionEditorId: string = 'expression-editor';

export interface IFormModeOwnProps {
    queryTrigger: QueryTrigger;
    updateQueryExpression: (expression: string) => void;
}

export interface IFormModeOwnState {
    fields?: IField[];
    expressionEditors?: JSX.Element[];
}

export interface IFormModeStateProps {
    expressionEditorsState?: IExpressionEditorState[];
}

export interface IFormModeDispatchProps {
}

export interface IFormModeProps extends IFormModeOwnProps, IFormModeStateProps, IFormModeDispatchProps {}

export class FormMode extends React.Component<IFormModeProps, IFormModeOwnState> {
    private id: number;

    constructor(props: IFormModeOwnProps) {
        super(props);
        this.state = {fields: [], expressionEditors: []};
        this.id = 0;
    }

    componentWillReceiveProps(nextProps: IFormModeProps) {
        // update le state courant avec toutes les expressions
        // const finalExpression: string = this.getExpression(nextProps);
        // this.setState({finalExpression: expression});
        const finaleExpression = this.getFinalExpression(nextProps);
        this.props.updateQueryExpression(finaleExpression);
    }

    async componentDidMount() {
        const getfields = await this.props.queryTrigger.getFields();
        this.setState({fields: getfields});
        this.addExpressionEditor();
    }

    private getFinalExpression(nextProps: IFormModeProps) {
        let finaleExpression: string = 'a';
        _.forEach(nextProps.expressionEditorsState, (expressionEditorState) => {
            finaleExpression = finaleExpression.concat(expressionEditorState.expression);
        });
        return finaleExpression;
    }

    // TODO remove
    private logReduxState() {
        // console.log(ReactVaporStore.getState())
        // console.log(ReactVaporStore.getState().expressionEditors)
    }

    private addExpressionEditor() {
        const newSate = this.state.expressionEditors;
        newSate.push(
            <ExpressionEditorConnected
                key={`${expressionEditorId}-${this.id}`}
                id={`${expressionEditorId}-${this.id}`}
                fields={this.state.fields}
                queryTrigger={this.props.queryTrigger}
                updateQueryExpression={this.props.updateQueryExpression}
                addExpressionEditor={() => this.addExpressionEditor()}
                deleteExpressionEditor={(id: string) => this.deleteExpressionEditor(id)}
                ensureLastEditorCanAddRule={() => this.ensureLastEditorCanAddRule()}
            />,
        );
        this.setState({expressionEditors: newSate});
        this.id++;
    }
    // on select add condition if value undefined we dont call add

    private ensureLastEditorCanAddRule() {
        // TODO : Fix this it is probably better to use a prop!
        // console.log( this.props.expressionEditorsState)
        // const lastEditorId = this.props.expressionEditorsState[0].id;
        // console.log( lastEditorId)
        // ReactVaporStore.dispatch(selectListBoxOption(`${lastEditorId}-${booleanOperatorSelectId}`, false, undefined));
    }

    // private isExpressionEditorAlone() {
    //     return this.state.expressionEditors.length === 1;
    // }

    private deleteExpressionEditor(id: string) {
        const updatedExpressionEditors = this.state.expressionEditors;
        const index = updatedExpressionEditors.findIndex((editor) => {
            return editor.props.id === id;
        });
        if (index !== -1) {
            updatedExpressionEditors.splice(index, 1);
        }
        this.setState({expressionEditors: updatedExpressionEditors});
    }

    render() {
        return (
            <div>
                <Button enabled={true} name={'Log Redux State'} onClick={() => this.logReduxState()} />
                <Button enabled={true} name={'dispatch test'} onClick={() => this.ensureLastEditorCanAddRule()} />
                {this.state.expressionEditors}
            </div>
        );
    }
}
