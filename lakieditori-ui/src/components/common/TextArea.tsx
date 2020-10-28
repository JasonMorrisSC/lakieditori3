// @ts-ignore
import React, {CSSProperties, RefObject, SyntheticEvent, useEffect, useRef} from "react";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";

const inputStyle: CSSProperties = {
  border: `1px solid ${sdt.colors.depthLight13}`,
  borderRadius: "2px",
  boxSizing: 'border-box',
  fontFamily: sdt.values.typography.bodyText.fontFamily,
  fontSize: sdt.values.typography.bodyText.fontSize.value,
  fontWeight: sdt.values.typography.bodyText.fontWeight,
  margin: `${sdt.spacing.xxs} 0`,
  padding: sdt.spacing.s,
  width: '100%',
};

interface Props {
  value?: string,
  placeholder?: string,
  onChange?: (e: SyntheticEvent<HTMLTextAreaElement>) => void,
  onBlur?: (e: SyntheticEvent<HTMLTextAreaElement>) => void,
  style?: CSSProperties,
  rows?: number,
  forwardedRef?: RefObject<HTMLTextAreaElement>,
}

const TextArea: React.FC<Props> = (
    {
      value = '',
      onChange = () => null,
      onBlur = () => null,
      placeholder = '',
      style = {},
      rows = 1,
      forwardedRef = null,
    }) => {

  const inputElement = useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(forwardedRef, () => inputElement.current!);

  function resizeContent(element: HTMLTextAreaElement) {
    element.style.height = element.scrollHeight + "px";
  }

  function resizeAndApplyOnChange(e: SyntheticEvent<HTMLTextAreaElement>) {
    resizeContent(e.currentTarget);
    onChange(e);
  }

  useEffect(() => {
    if (inputElement.current) {
      resizeContent(inputElement.current);
    }
  });

  return <textarea ref={inputElement}
                   value={value}
                   placeholder={placeholder}
                   onChange={resizeAndApplyOnChange}
                   onBlur={onBlur}
                   style={{...inputStyle, verticalAlign: "middle", ...style}}
                   rows={rows}/>;
};

export default TextArea;
