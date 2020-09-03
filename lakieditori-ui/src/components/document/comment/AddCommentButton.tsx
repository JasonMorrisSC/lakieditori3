import React, {Dispatch, SetStateAction, useContext} from "react";
import {v4 as uuidv4} from 'uuid';
import {AuthenticationContext} from "../../../App";
import {cloneDocument} from "../../../utils/xmlUtils";
import {currentLocalIsoDatetime} from "../../../utils/dateUtils";
import {ButtonLink} from "../../common/StyledInputComponents";

interface Props {
  path: string,
  comments: Document,
  setComments: Dispatch<SetStateAction<Document>>,
}

const AddCommentButton: React.FC<Props> = ({path, comments, setComments}) => {
  const [user] = useContext(AuthenticationContext);

  return (
      <ButtonLink onClick={() => {
        if (comments && setComments) {
          const clone = cloneDocument(comments);

          const newComment = clone.createElement("comment");
          newComment.setAttribute("id", uuidv4());
          newComment.setAttribute("path", path);
          newComment.setAttribute("user", user.username);
          newComment.setAttribute("date", currentLocalIsoDatetime());

          clone.documentElement.appendChild(newComment);
          setComments(clone);
        }
      }}>
        Lisää kommentti...
      </ButtonLink>
  );
}

export default AddCommentButton;