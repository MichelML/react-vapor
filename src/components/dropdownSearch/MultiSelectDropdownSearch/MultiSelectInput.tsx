import * as React from 'react';
import {IDropdownOption} from '../DropdownSearch';
import {SelectedOption} from './SelectedOption';
import {Svg} from '../../svg/Svg';

export interface IMultiselectInputProps {
  selectedOptions: IDropdownOption[];
  onRemoveClick?: (value: string) => void;
  onRemoveAll?: () => void;
  onFilterClick?: (filterText: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDownFilterBox?: (keycode: number) => void;
  filterPlaceholder?: string;
}

export class MultiselectInput extends React.Component<IMultiselectInputProps, any> {

  handleOnRemoveAll() {
    if (this.props.onRemoveAll) {
      this.props.onRemoveAll();
    }
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onFilterClick) {
      this.props.onFilterClick(e.target.value);
    }
  }


  private handleOnBlur() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  private handleOnFocus() {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  private handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (this.props.onKeyDownFilterBox) {
      this.props.onKeyDownFilterBox(e.keyCode);
    }
  }

  private getSelectedOptionComponents(): JSX.Element[] {
    const selectedOptionComponents: JSX.Element[] = [];

    for (let selectedOption of this.props.selectedOptions) {
      selectedOptionComponents.push(
        <SelectedOption displayValue={selectedOption.displayValue}
                        key={selectedOption.value}
                        onRemoveClick={this.props.onRemoveClick}
        />);
    }

    return selectedOptionComponents;
  }

  private getRemoveAllSelectedOptionsButton(): JSX.Element {
    if (this.props.selectedOptions.length > 0) {
      return (
        <div className='remove-all-selected-options' onClick={() => this.handleOnRemoveAll()}>
          <Svg svgName='clear' svgClass='icon fill-medium-blue' />
        </div>
      );
    }
  }

  render() {
    return (
      <div className='multiselect-input'>
        <div className='selected-options-container'>
          {this.getSelectedOptionComponents()}
          <input
            placeholder={'placeholder'}
            onChange={(e) => this.handleChange(e)}
            onBlur={() => this.handleOnBlur()}
            onFocus={() => this.handleOnFocus()}
            onKeyDown={(e) => this.handleOnKeyDown(e)}
            autoFocus={false}
          />
        </div>
        {this.getRemoveAllSelectedOptionsButton()}
      </div>
    );
  }
}
