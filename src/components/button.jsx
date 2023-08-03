import * as React from 'react';
import { useButton } from 'react-aria';
import classNames from 'classnames'

export default function Button( props) {
    let ref = props.buttonRef;
    let { buttonProps } = useButton(props, ref);
    // let classes = classNames(
    //     props.intent == 'primary'
    //         ? 'bg-primary'
    //         : "bg-white text-black",
    //     'rounded-full',
    //     'p-2',
    //     'drop-shadow',
    //     `${styling}`
    // );

    return (
        <button 
        className={props.className}
         {...buttonProps} ref={ref}>
            {props.children}
        </button>
    );
}