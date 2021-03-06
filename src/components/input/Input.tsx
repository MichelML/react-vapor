import * as classNames from 'classnames';
import * as React from 'react';
import {contains, isUndefined, uniqueId} from 'underscore';
import {IClassName} from '../../utils/ClassNameUtils';
import {TooltipPlacement} from '../../utils/TooltipUtils';
import {Tooltip} from '../tooltip/Tooltip';
import {IInputState} from './InputReducers';
import {ILabelProps, Label} from './Label';

const validatedInputTypes: string[] = ['number', 'text', 'password'];

export interface IInputOwnProps {
    id?: string;
    name?: string;
    type?: string;
    classes?: IClassName;
    innerInputClasses?: IClassName;
    defaultValue?: string;
    placeholder?: string;
    defaultChecked?: boolean;
    readOnly?: boolean;
    validate?: (value: any) => boolean;
    labelTitle?: string;
    labelProps?: ILabelProps;
    onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: (value: string) => void;
    validateOnChange?: boolean;
    disabledOnMount?: boolean;
    validateOnMount?: boolean;
    autoFocus?: boolean;
    disabledTooltip?: string;
    minimum?: number;
    maximum?: number;
}

export interface IInputStateProps {
    checked?: boolean;
    disabled?: boolean;
    value?: string;
    valid?: boolean;
    indeterminate?: boolean;
}

export interface IInputDispatchProps {
    onDestroy?: () => void;
    onRender?: (value?: string, valid?: boolean, disabled?: boolean) => void;
    onChange?: (value?: string, valid?: boolean) => void;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface IInputProps extends IInputOwnProps, IInputStateProps, IInputDispatchProps {}

export interface IInputComponentState {
    valid: boolean;
}

export class Input extends React.Component<IInputProps, IInputComponentState> {
    private innerInput: HTMLInputElement;

    static defaultProps: Partial<IInputProps> = {
        id: uniqueId('input'),
        type: 'text',
        valid: true,
        labelTitle: '',
    };

    constructor(props: IInputProps, state: IInputState) {
        super(props, state);
        this.state = {
            valid: this.props.valid,
        };
    }

    componentWillMount() {
        if (this.props.onRender) {
            // undefined validOnMount will default to true in the state
            const validOnMount = this.props.validateOnMount
                && this.props.validate
                && this.props.validate(this.props.defaultValue || '');

            this.props.onRender(
                this.props.defaultValue,
                validOnMount,
                this.props.disabledOnMount,
            );
        }
    }

    componentWillUnmount() {
        if (this.props.onDestroy) {
            this.props.onDestroy();
        }
    }

    componentDidUpdate(prevProps: IInputProps) {
        if (this.props.valid !== prevProps.valid) {
            this.validate();
        }

        if (prevProps.value !== this.props.value && this.innerInput) {
            this.innerInput.value = this.props.value;
        }
    }

    reset() {
        this.innerInput.value = '';
    }

    getInnerValue(): string {
        return (this.innerInput && this.innerInput.value)
            || '';
    }

    validate() {
        this.setState({
            valid: this.props.valid && !(this.props.validate && !this.props.validate(this.getInnerValue())),
        });
    }

    private handleBlur() {
        if (this.props.onBlur) {
            this.props.onBlur(this.getInnerValue());
        }
    }

    private handleChange() {
        if (this.props.onChange) {
            const validOnChange = this.props.validateOnChange
                && this.props.validate
                && this.props.validate(this.getInnerValue());
            this.props.onChange(this.getInnerValue(), validOnChange);
        }
    }

    private handleClick(e: React.MouseEvent<HTMLElement>) {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }

    private handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        if (this.props.onKeyUp) {
            this.props.onKeyUp(event);
        }
    }

    private getLabel(): JSX.Element {
        const {labelProps, labelTitle} = this.props;
        return labelTitle || this.props.validate
            ? <Label key={this.props.id + 'label'} htmlFor={this.props.id} {...labelProps}>{labelTitle}</Label>
            : null;
    }

    render() {
        const classes = classNames(
            'input-wrapper validate',
            {
                'input-field': contains(validatedInputTypes, this.props.type),
            },
            this.props.classes,
        );
        const innerInputClasses = classNames({
            invalid: !this.state.valid && contains(validatedInputTypes, this.props.type),
        }, this.props.innerInputClasses);

        const inputElements = [
            <input
                key={this.props.id}
                id={this.props.id}
                className={innerInputClasses}
                type={this.props.type}
                defaultValue={!isUndefined(this.props.value) ? this.props.value : this.props.defaultValue}
                ref={(innerInput: HTMLInputElement) => this.innerInput = innerInput}
                onBlur={() => this.handleBlur()}
                onChange={() => this.handleChange()}
                onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => this.handleKeyUp(event)}
                placeholder={this.props.placeholder}
                checked={!!this.props.checked}
                disabled={!!this.props.disabled}
                name={this.props.name}
                required
                readOnly={!!this.props.readOnly}
                autoFocus={!!this.props.autoFocus}
                step={this.props.type === 'number' ? 'any' : null}
                min={this.props.minimum}
                max={this.props.maximum}
            />,
            this.getLabel(),
            this.props.children,
        ];

        return this.props.disabled && this.props.disabledTooltip
            ? (
                <div className={classes} onClick={(e: React.MouseEvent<HTMLElement>) => this.handleClick(e)}>
                    <Tooltip title={this.props.disabledTooltip} placement={TooltipPlacement.Right}>
                        {inputElements}
                    </Tooltip>
                </div>
            )
            : <div className={classes} onClick={(e: React.MouseEvent<HTMLElement>) => this.handleClick(e)}>{inputElements}</div>;
    }
}
