import React, {ReactNode, useEffect, useRef} from "react";
import {Editor, Location, Transforms} from 'slate'
import {ReactEditor, useSlate} from 'slate-react'
import {css} from "emotion";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {Concept} from "./useTextConcepts";
import {insertLink, selectionOrWord, toggleFormat} from "./slateUtils";
import styled from "@emotion/styled";
import {ButtonInverted} from "../../../common/InputStyles";
import {createPortal} from "react-dom";

export const ToolbarButton = styled(ButtonInverted)`
  border: none !important;
  min-height: 0;
  padding: ${tokens.spacing.xs} ${tokens.spacing.m};
`;

export const ToolbarIconButton = styled(ToolbarButton)`
  padding: ${tokens.spacing.xs} ${tokens.spacing.s};
  & > .material-icons {
    font-size: ${tokens.values.typography.bodyText.fontSize.value}${tokens.values.typography.bodyText.fontSize.unit};
    vertical-align: middle;
  }
`;

interface Props {
  words: Map<string, Concept>,
  linkSelection: (location: Location) => void,
}

const TextEditorHoveringToolbar: React.FC<Props> = ({words, linkSelection}) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const selection = selectionOrWord(editor) || [0];

  useEffect(() => {
    const el = ref.current;
    const selection = selectionOrWord(editor);

    if (!el) {
      return;
    }

    if (!selection || !ReactEditor.isFocused(editor) || !words.has(Editor.string(editor, selection))) {
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

  const doInsertLink = () => {
    if (selection && words.has(Editor.string(editor, selection))) {
      const concept = words.get(Editor.string(editor, selection));
      if (concept) {
        Transforms.select(editor, selection);
        insertLink(editor, concept.uri, Editor.string(editor, selection));
      }
    }
  };

  return (
      <Portal>
        <div ref={ref} className={css`
          background: ${tokens.colors.highlightBase};
          color: ${tokens.colors.whiteBase};
          box-shadow: #29292924 0px 1px 2px 0px, #2929291f 0px 1px 5px 0px;
          border-radius: 2px;
          padding: ${tokens.spacing.xs};
          position: absolute;
          z-index: 1;
          top: -10000px;
          left: -10000px;
          margin-top: -${tokens.spacing.s};
          opacity: 0;
          line-height: 1;
          transition: opacity 0.75s;
        `}>
          <ToolbarButton icon={"plus"} onMouseDown={(e) => {
            e.preventDefault();
            doInsertLink();
          }}>
            Lisää käsitelinkki:&nbsp;
            <em>{selection && words.get(Editor.string(editor, selection))?.label}</em>
          </ToolbarButton>

          &nbsp;|&nbsp;

          <ToolbarIconButton onMouseDown={(e) => {
            e.preventDefault();
            toggleFormat(editor, "bold", selection);
          }}>
            <span className={"material-icons"}>format_bold</span>
          </ToolbarIconButton>
          <ToolbarIconButton onMouseDown={(e) => {
            e.preventDefault();
            toggleFormat(editor, "italic", selection);
          }}>
            <span className={"material-icons"}>format_italic</span>
          </ToolbarIconButton>
          <ToolbarIconButton onMouseDown={(e) => {
            e.preventDefault();
            linkSelection(selection);
          }}>
            <span className={"material-icons"}>link</span>
          </ToolbarIconButton>
        </div>
      </Portal>
  )
};

interface PortalProps {
  children: ReactNode
}

export const Portal = ({children}: PortalProps) => {
  return createPortal(children, document.body)
};

export default TextEditorHoveringToolbar;
