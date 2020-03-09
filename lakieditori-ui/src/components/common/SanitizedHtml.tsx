import React from "react";
import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes and renders element's inner HTML.
 */
const SanitizedHtml: React.FC<Props> = ({element}) => {
  const clean = sanitizeHtml(element?.innerHTML || '', {
    allowedTags: ['em', 'strong', 'a'],
    allowedAttributes: {
      a: ['href']
    }
  });

  return <span dangerouslySetInnerHTML={{__html: clean}}/>;
};

interface Props {
  element: Element | null;
}

export default SanitizedHtml;
