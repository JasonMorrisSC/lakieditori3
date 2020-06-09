import React from "react";
import sanitizeHtml from 'sanitize-html';

interface Props {
  element: Element | null;
}

const SanitizedBlockHtml: React.FC<Props> = ({element}) => {
  const clean = sanitizeHtml(element?.innerHTML || '', {
    allowedTags: ['em', 'strong', 'a', 'p'],
    allowedAttributes: {
      a: ['href']
    }
  });

  return <span dangerouslySetInnerHTML={{__html: clean}}/>;
};

export default SanitizedBlockHtml;
