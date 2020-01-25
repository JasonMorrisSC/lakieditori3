import React, {CSSProperties, SyntheticEvent, useEffect, useRef} from "react";
import {inputStyle} from "./inputStyle";

const TextArea: React.FC<Props> = (
    {
      value = '',
      onChange = () => null,
      placeholder = '',
      style = {},
      rows = 1
    }) => {

  const inputElement = useRef<HTMLTextAreaElement>(null);

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
                   style={{...inputStyle, verticalAlign: "middle", ...style}}
                   rows={rows}/>;
};

interface Props {
  value?: string,
  placeholder?: string,
  onChange?: (e: SyntheticEvent<HTMLTextAreaElement>) => void,
  style?: CSSProperties,
  rows?: number
}

export default TextArea;
