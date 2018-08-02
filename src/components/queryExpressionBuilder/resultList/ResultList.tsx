
import * as React from 'react';
import * as _ from 'underscore';
import {IContentProps} from '../../content/Content';
import {IItemBoxProps} from '../../itemBox/ItemBox';
import {ListBox} from '../../listBox/ListBox';
import {IResult} from '../responseParser/ResponseParser';
import {ResultItem} from '../resultItem/ResultItem';

export interface IResultListProps {
    results: IResult[];
    onClick?: (result: IResult) => void;
}

export interface IResultListState {
    selectedResult?: string;
}

export class ResultList extends React.Component<IResultListProps, IResultListState> {

    constructor(props: IResultListProps) {
        super(props);
        this.state = {selectedResult: ''};
    }

    private onClick(resultItemBox: IItemBoxProps) {
        const resultID: string = resultItemBox.value;
        this.setState({selectedResult: resultID});

        if (this.props.onClick) {
            const result: IResult = this.getResultByID(resultID);
            this.props.onClick(result);
        }
    }

    private getResultsItems(): IItemBoxProps[] {
        const items: IItemBoxProps[] = [];
        _.forEach(this.props.results, (result: IResult) => {
            const getAppend: IContentProps = {content: () => <ResultItem result={result} />};
            const getItemBox: IItemBoxProps = {value: result.uniqueID, displayValue: result.title, append: getAppend};
            items.push(getItemBox);
        });
        return items;
    }

    private getResultByID(value: string): IResult {
        return _.find(this.props.results, (result: IResult) => result.uniqueID === value);
    }

    render() {
        return (
            <div>
                <ListBox
                    items={this.getResultsItems()}
                    selected={[this.state.selectedResult]}
                    onOptionClick={(resultItemBox: IItemBoxProps) =>  this.onClick(resultItemBox)}
                />
            </div>
        );
    }
}