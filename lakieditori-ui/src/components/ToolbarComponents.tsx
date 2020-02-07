import React, {ReactNode} from "react";
import {createPortal} from "react-dom";
import {css, cx} from "emotion";

export const Menu = React.forwardRef(({className, ...props}: MenuProps, ref: any) => (
    <div
        {...props}
        ref={ref}
        className={cx(
            className,
            css`
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }`)}
    />
));

interface MenuProps {
  className: any,
  children: any
}

export const Button = React.forwardRef(
    ({className, active, reversed = true, onMouseDown, ...props}: ButtonProps, ref: any) => (
        <span
            {...props}
            onMouseDown={onMouseDown}
            ref={ref}
            className={cx(
                className,
                css`
          cursor: pointer;
          color: ${reversed
                    ? active
                        ? 'white'
                        : '#aaa'
                    : active
                        ? 'black'
                        : '#ccc'};
        `)}
        />
    )
);

interface ButtonProps {
  className?: any,
  active: boolean,
  reversed?: boolean,
  onMouseDown: (e: any) => void,
  children: any
}

export const Icon = React.forwardRef(({className, ...props}: IconProps, ref: any) => (
    <span
        {...props}
        ref={ref}
        className={cx(
            'material-icons',
            className,
            css`
        font-size: 18px;
        vertical-align: text-bottom;
      `)}
    />
));

interface IconProps {
  className?: any,
  children: any
}

export const Portal = ({children}: PortalProps) => {
  return createPortal(children, document.body)
};

interface PortalProps {
  children: ReactNode
}
