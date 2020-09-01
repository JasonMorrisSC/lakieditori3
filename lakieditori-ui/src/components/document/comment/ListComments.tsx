import React, {Dispatch, SetStateAction} from "react";
import {
  cloneDocument,
  queryElements,
  queryFirstElement,
  updateElement
} from "../../../utils/xmlUtils";
import Comment from "./Comment";

interface Props {
  paths: string[],
  comments: Document,
  setComments: Dispatch<SetStateAction<Document>>,
}

const ListComments: React.FC<Props> = ({paths, comments, setComments}) => {
  const query = `/comments/comment[${paths.map(p => "@path = '" + p + "'").join(" or ")}]`;
  const commentElements = queryElements(comments, query)
  return (
      <div>
        {commentElements.map((comment, i) =>
            <Comment key={i} comment={comment} setComment={(c) => {
              const clone = cloneDocument(comments);
              const query = `/comments/comment[@id = '${comment.getAttribute("id")}']`;
              updateElement(clone, query, el => el.textContent = c.textContent);
              setComments(clone);
            }} removeComment={() => {
              const clone = cloneDocument(comments);
              const query = `/comments/comment[@id = '${comment.getAttribute("id")}']`;
              const commentElement = queryFirstElement(clone, query);
              if (commentElement) {
                clone.documentElement.removeChild(commentElement);
              }
              setComments(clone);
            }}/>)}
      </div>
  );
}

export default ListComments;