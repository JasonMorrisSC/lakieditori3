import React, {useEffect, useRef} from "react";
import {Editor, Range} from 'slate'
import {ReactEditor, useSlate} from 'slate-react'
import {css} from "emotion";
import {Button, Icon, Menu, Portal} from "./RichTextEditorUtilComponents";
import {isFormatActive, isLinkActive, toggleFormat} from "./RichTextEditorFunctions";
import LinkModal from "./LinkModal";

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement>();
  const editor = useSlate();

  useEffect(() => {
    const el = ref.current;
    const {selection} = editor;

    if (!el) {
      return;
    }

    if (!selection ||
        !ReactEditor.isFocused(editor) ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === '') {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();

    if (!domSelection || !domSelection.rangeCount) {
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    if (rect) {
      el.style.opacity = '1';
      el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
      el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
    }
  });

  return (
      <Portal>
        <Menu
            ref={ref}
            className={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -6px;
          opacity: 0;
          background-color: #333;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
        >
          <FormatButton format="bold" icon="format_bold"/>
          <FormatButton format="italic" icon="format_italic"/>
          <LinkButton/>
        </Menu>
      </Portal>
  )
};

const FormatButton = ({format, icon}: FormatButtonProps) => {
  const editor = useSlate();
  return (
      <Button
          active={isFormatActive(editor, format)}
          onMouseDown={event => {
            event.preventDefault();
            toggleFormat(editor, format);
          }}>
        <Icon>{icon}</Icon>
      </Button>
  );
};

const LinkButton = () => {
  const editor = useSlate();
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
  const [selectedText, setSelectedText] = React.useState<string>('');
  const [selectedUrl, setSelectedUrl] = React.useState<string>('');
  const [selection, setSelection] = React.useState<Range | null>(null);

  return (
      <div>
        <Button
            active={isLinkActive(editor)}
            onMouseDown={(e) => {
              e.preventDefault();
              if (editor.selection) {
                setSelectedText(Editor.string(editor, editor.selection));
              }
              if (isLinkActive(editor)) {
                const [link] = Array.from(Editor.nodes(editor, {
                  match: n => n.type === 'link'
                }));
                setSelectedUrl(link[0].url);
              }
              setSelection(editor.selection);
              setModalIsOpen(true);
            }}>
          <Icon>link</Icon>
        </Button>

        <LinkModal
            closeModal={() => {
              setSelectedText('');
              setSelectedUrl('');
              setModalIsOpen(false);
            }}
            modalIsOpen={modalIsOpen}
            selection={selection}
            selectedText={selectedText}
            selectedUrl={selectedUrl}
        />
      </div>
  )
};

interface FormatButtonProps {
  format: string,
  icon: string
}

export default HoveringToolbar;
