import React from "react";
import sanitizeHtml from 'sanitize-html';

interface Props {
  element: Element | null;
}

const SanitizedInlineHtml: React.FC<Props> = ({element}) => {
  const clean = sanitizeHtml(element?.innerHTML || '', {
    allowedTags: ['em', 'strong', 'a'],
    allowedAttributes: {
      a: ['href']
    }
  });

  return <span dangerouslySetInnerHTML={{__html: clean}}/>;
};

export default SanitizedInlineHtml;
