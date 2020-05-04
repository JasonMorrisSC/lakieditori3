import React, {CSSProperties, ReactNode} from "react";
import {Location} from 'slate'
import {useSlate} from 'slate-react'
import {Button, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {isLinkActive, isMarkActive, selectionOrEnd, toggleMark} from "./slateUtils";
import {ButtonLinkSmall} from "../../../common/StyledInputComponents";
import styled from "@emotion/styled";

export const StyledToolbar = styled.div`
  display: flex;
  align-items: center;
  font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyTextSmall.fontWeight};
  line-height: 1;
  padding: ${tokens.spacing.s};
  & > label {
    margin: 1px ${tokens.spacing.m} 1px 0;
    color: ${tokens.colors.depthDark27};
    font-weight: ${tokens.values.typography.bodyTextSmall.fontWeight};
  };
`;

const StyledToolbarIconButton = styled(ButtonLinkSmall)`
  color: ${tokens.colors.depthDark27};
  line-height: 1;
  margin: 0 ${tokens.spacing.xxs};
  & > span.material-icons {
    font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
    vertical-align: middle;
  }
`;

export const StyledToolbarButton = styled(Button.secondaryNoborder)`
  font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyTextSmall.fontWeight};
  color: ${tokens.colors.blackLighten42} !important;
  background: none !important;
  margin-right: ${tokens.spacing.xs};
  min-height: 0;
  padding: ${tokens.spacing.xs};
  &:hover {
    color: ${tokens.colors.depthDark27} !important; 
  };
  &:hover > svg {
    fill: ${tokens.colors.depthDark27} !important; 
  };
  & > svg {
    fill: ${tokens.colors.blackLighten42} !important;
    height: 0.7em !important;
    width: 0.7em !important;
    margin-right: ${tokens.spacing.xs} !important;
  };
`;

interface Props {
  label: string,
  expanded: boolean,
  linkSelection: (location: Location) => void,
  customTools?: ReactNode,
}

const TextEditorToolbar: React.FC<Props> = ({label, expanded, linkSelection, customTools}) => {
  const stickyIfExpanded: CSSProperties = expanded ? {
    position: "sticky",
    top: 56,
    background: tokens.colors.whiteBase,
  } : {};

  return (
      <StyledToolbar style={stickyIfExpanded}>
        {label &&
        <label>{label}</label>}
        {expanded &&
        <div>
          <FormatButton format="bold" icon="format_bold"/>
          <FormatButton format="italic" icon="format_italic"/>
          <LinkButton linkSelection={linkSelection}/>
        </div>}
        <div style={{marginLeft: "auto"}}>
          {customTools}
        </div>
      </StyledToolbar>
  )
};

interface FormatButtonProps {
  format: string,
  icon: string
}

const FormatButton: React.FC<FormatButtonProps> = ({format, icon}) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  return (
      <StyledToolbarIconButton onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }} style={{color: active ? tokens.colors.blackBase : ''}}>
        <span className={"material-icons"}>{icon}</span>
      </StyledToolbarIconButton>
  );
};

interface LinkButtonProps {
  linkSelection: (location: Location) => void,
}

const LinkButton: React.FC<LinkButtonProps> = ({linkSelection}) => {
  const editor = useSlate();
  const active = isLinkActive(editor);

  return (
      <StyledToolbarIconButton
          style={{color: active ? tokens.colors.blackBase : ''}}
          onMouseDown={(e) => {
            e.preventDefault();
            linkSelection(selectionOrEnd(editor));
          }}>
        <span className={"material-icons"}>link</span>
      </StyledToolbarIconButton>
  )
};

export default TextEditorToolbar;
