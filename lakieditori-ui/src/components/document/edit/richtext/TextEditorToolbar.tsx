import React from "react";
import {Location} from 'slate'
import {useSlate} from 'slate-react'
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {isLinkActive, isMarkActive, selectionOrEnd, toggleMark} from "./slateUtils";
import {ButtonLinkSmall} from "../../../common/InputStyles";
import styled from "@emotion/styled";

const StyledToolbar = styled.div`
  display: flex;
  align-items: center;
  font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyTextSmall.fontWeight};
  line-height: 1;
  padding: ${tokens.spacing.s};
  & label {
    margin: 1px ${tokens.spacing.m} 1px 0;
    color: ${tokens.colors.depthDark27};
    font-weight: ${tokens.values.typography.bodyTextSmall.fontWeight};
  };
`;

const ToolbarButton = styled(ButtonLinkSmall)`
  color: ${tokens.colors.depthDark27};
  line-height: 1;
  margin: 0 ${tokens.spacing.xxs};
  & > span.material-icons {
    font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
    vertical-align: middle;
  }
`;

interface Props {
  label: string,
  expanded: boolean,
  linkSelection: (location: Location) => void,
}

const TextEditorToolbar: React.FC<Props> = ({label, expanded, linkSelection}) => {
  return (
      <StyledToolbar>
        <label>{label}</label>
        <div style={{display: expanded ? 'block' : 'none'}}>
          <FormatButton format="bold" icon="format_bold"/>
          <FormatButton format="italic" icon="format_italic"/>
          <LinkButton linkSelection={linkSelection}/>
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
      <ToolbarButton onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }} style={{color: active ? tokens.colors.blackBase : ''}}>
        <span className={"material-icons"}>{icon}</span>
      </ToolbarButton>
  );
};

interface LinkButtonProps {
  linkSelection: (location: Location) => void,
}

const LinkButton: React.FC<LinkButtonProps> = ({linkSelection}) => {
  const editor = useSlate();
  const active = isLinkActive(editor);

  return (
      <ToolbarButton
          style={{color: active ? tokens.colors.blackBase : ''}}
          onMouseDown={(e) => {
            e.preventDefault();
            linkSelection(selectionOrEnd(editor));
          }}>
        <span className={"material-icons"}>link</span>
      </ToolbarButton>
  )
};

export default TextEditorToolbar;
