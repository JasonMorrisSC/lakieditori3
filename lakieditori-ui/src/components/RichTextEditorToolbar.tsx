import React from "react";
import {Range} from 'slate'
import {useSlate} from 'slate-react'
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {Button, Icon} from "./RichTextEditorUtilComponents";
import {isLinkActive, isMarkActive, toggleMark} from "./RichTextEditorFunctions";
import LinkModal from "./LinkModal";
import {css} from "emotion";

const Toolbar = () => {
  return (
      <div style={{
        fontSize: tokens.values.typography.bodyText.fontSize.value,
        lineHeight: tokens.values.typography.bodyText.lineHeight.value,
        backgroundColor: tokens.colors.depthLight30,
        padding: `${tokens.spacing.xxs} ${tokens.spacing.s}`,
      }} className={css`& > * + * { margin-left: 8px; }`}>
        <FormatButton format="bold" icon="format_bold"/>
        <FormatButton format="italic" icon="format_italic"/>
        <LinkButton/>
      </div>
  )
};

const FormatButton = ({format, icon}: FormatButtonProps) => {
  const editor = useSlate();
  return (
      <Button
          active={isMarkActive(editor, format)}
          onMouseDown={event => {
            event.preventDefault();
            toggleMark(editor, format);
          }}
          reversed={false}>
        <Icon>{icon}</Icon>
      </Button>
  );
};

const LinkButton = () => {
  const editor = useSlate();
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
  const [selection, setSelection] = React.useState<Range | null>(null);

  return (
      <>
        <Button
            active={isLinkActive(editor)}
            onMouseDown={(e) => {
              e.preventDefault();
              setSelection(editor.selection);
              setModalIsOpen(true);
            }}
            reversed={false}>
          <Icon>link</Icon>
        </Button>

        <LinkModal
            closeModal={() => setModalIsOpen(false)}
            modalIsOpen={modalIsOpen}
            selection={selection}/>
      </>
  )
};

interface FormatButtonProps {
  format: string,
  icon: string
}

export default Toolbar;
