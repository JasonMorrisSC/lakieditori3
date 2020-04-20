import React from "react";
import {Location} from 'slate'
import {useSlate} from 'slate-react'
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {isLinkActive, isMarkActive, selectionOrEnd, toggleMark} from "./slateUtils";
import LinkModal from "./LinkModal";
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
  expand: boolean,
}

const TextEditorToolbar: React.FC<Props> = ({label, expand}) => {
  return (
      <StyledToolbar>
        <label>{label}</label>
        <div style={{display: expand ? 'block' : 'none'}}>
          <FormatButton format="bold" icon="format_bold"/>
          <FormatButton format="italic" icon="format_italic"/>
          <LinkButton/>
        </div>
      </StyledToolbar>
  )
};

const FormatButton = ({format, icon}: FormatButtonProps) => {
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

const LinkButton = () => {
  const editor = useSlate();
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [selection, setSelection] = React.useState<Location>(selectionOrEnd(editor));
  const active = isLinkActive(editor);

  return (
      <>
        <ToolbarButton
            style={{color: active ? tokens.colors.blackBase : ''}}
            onMouseDown={(e) => {
              e.preventDefault();
              setSelection(selectionOrEnd(editor));
              setModalOpen(true);
            }}>
          <span className={"material-icons"}>link</span>
        </ToolbarButton>

        <LinkModal
            isOpen={isModalOpen}
            close={() => setModalOpen(false)}
            selection={selection}/>
      </>
  )
};

interface FormatButtonProps {
  format: string,
  icon: string
}

export default TextEditorToolbar;
