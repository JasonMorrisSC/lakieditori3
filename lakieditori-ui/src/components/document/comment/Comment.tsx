import React, {useContext, useEffect, useRef, useState} from "react";
import {queryFirstText} from "../../../utils/xmlUtils";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {toFiDateTimeStringInUtc} from "../../../utils/dateUtils";
import {AuthenticationContext} from "../../../App";
import {ButtonSmallIconOnly} from "../../common/StyledInputComponents";
import TextArea from "../../common/TextArea";

const fontSizeSmall = `${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit}`;

interface Props {
  comment: Element,
  setComment: (comment: Element) => void,
  removeComment: () => void,
}

const Comment: React.FC<Props> = ({comment, setComment, removeComment}) => {
  const [user] = useContext(AuthenticationContext);

  const [isEditMode, setEditMode] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const username = queryFirstText(comment, "@user");
  const isAuthor = user.username === username;
  const date = toFiDateTimeStringInUtc(queryFirstText(comment, "@date"));
  const value = comment.textContent;

  useEffect(() => {
    if (!isEditMode && (!value || value.length === 0)) {
      setEditMode(true);
    }
  }, [isEditMode, value]);

  useEffect(() => {
    if (textAreaRef && textAreaRef.current && isEditMode) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(
          textAreaRef.current.value.length,
          textAreaRef.current.value.length);
    }
  }, [textAreaRef, isEditMode]);

  return (
      <div style={{
        backgroundColor: isAuthor ? tokens.colors.highlightLight45 : tokens.colors.highlightLight50,
        borderRadius: "4px",
        padding: `${tokens.spacing.xs} ${tokens.spacing.s}`,
        margin: `${tokens.spacing.xs} 0`
      }}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <div style={{fontWeight: tokens.values.typography.bodySemiBold.fontWeight}}>
            {username}
          </div>
          <div style={{color: tokens.colors.depthDark27, fontSize: fontSizeSmall}}>
            {date}
          </div>
        </div>
        <div>
          {!isEditMode ? value :
              <div>
                <TextArea forwardedRef={textAreaRef}
                          style={{margin: `${tokens.spacing.s} 0`}} value={value || undefined}
                          onChange={(e) => {
                            const newComment = comment.cloneNode(true) as Element;
                            newComment.textContent = e.currentTarget.value;
                            setComment(newComment);
                          }}/>
              </div>}
        </div>
        {isAuthor &&
        <div style={{fontSize: fontSizeSmall, textAlign: "right"}}>
          <ButtonSmallIconOnly icon={"edit"} onClick={() => setEditMode(!isEditMode)}/>
          <ButtonSmallIconOnly icon={"remove"} onClick={removeComment}
                               style={{marginLeft: tokens.spacing.s}}/>
        </div>}
      </div>
  );
}

export default Comment;
