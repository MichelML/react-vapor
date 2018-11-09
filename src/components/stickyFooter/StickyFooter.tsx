import * as classNames from 'classnames';
import * as React from 'react';
import {IClassName} from '../../utils/ClassNameUtils';
import {SideNavigation} from '../sideNavigation/SideNavigation';
import * as styles from './StickyFooter.scss';

export interface IStickyFooterProps {
    classes?: IClassName;
}

export interface IStickyFooterState {
    withSideNav?: boolean;
}

export class StickyFooter extends React.Component<IStickyFooterProps, IStickyFooterState> {
    static ID = 'StickyFooter';
    static withSideNavClass = styles.stickyFooterWithSideNavClass;

    constructor(props: IStickyFooterProps, state: IStickyFooterProps) {
        super(props, state);
        this.state = {};

        this.setFooterState = this.setFooterState.bind(this);
    }

    componentDidMount() {
        this.setState({withSideNav: !!document.querySelector('.navigation-wrapper-opened')});
        document.addEventListener(SideNavigation.toggleEvent, this.setFooterState);
    }

    componentWillUnmount() {
        document.removeEventListener(SideNavigation.toggleEvent, this.setFooterState);
    }

    render() {
        return (
            <div
                id={StickyFooter.ID}
                className={
                    classNames(
                        styles.stickyFooter,
                        {[styles.stickyFooterWithSideNavClass]: !!this.state.withSideNav},
                        this.props.classes,
                    )
                }
            >
                {this.props.children}
            </div>
        );
    }

    setFooterState() {
        this.setState({withSideNav: !this.state.withSideNav});
    }
}