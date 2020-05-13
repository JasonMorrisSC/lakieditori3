import React, {useRef} from "react";
import {HashLink as Link} from 'react-router-hash-link';
import styled from '@emotion/styled'
import {suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {queryElements, queryFirstText} from "../../../utils/xmlUtils";

const NavSticky = styled.nav`
  position: sticky;
  top: 56px;
  height: 93vh;
  overflow-y: auto;
`;

const NavLink = styled(Link)`
  align-items: center;
  color: ${tokens.colors.highlightBase};
  font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
  display: flex;
  padding: ${tokens.spacing.xs} 0;
  text-decoration: none;
  text-transform: uppercase;
`;

const NavLinkSecondary = styled(NavLink)`
  padding: ${tokens.spacing.xs} 0 ${tokens.spacing.xs} ${tokens.spacing.l};  
  text-transform: none;
`;

interface Props {
  document: Document,
}

const TableOfContents: React.FC<Props> = ({document}) => {
  const navRef = useRef<HTMLElement>(null);
  const chapters = queryElements(document.documentElement, "chapter");
  const sections = queryElements(document.documentElement, "section");

  const renderSectionLink = (section: Element, key: number) => {
    const number = queryFirstText(section, "@number");
    const title = queryFirstText(section, "title");
    return (
        <li key={key}>
          <NavLink to={`#section-${number}`}>
            {number} § - {title}
          </NavLink>
        </li>
    );
  };

  const renderChapterSectionLink = (chapterNumber: string, section: Element, key: number) => {
    const number = queryFirstText(section, "@number");
    const title = queryFirstText(section, "title");
    return (
        <li key={key}>
          <NavLinkSecondary to={`#chapter-${chapterNumber}-section-${number}`}>
            {number} § - {title}
          </NavLinkSecondary>
        </li>
    );
  };

  const renderChapterLink = (chapter: Element, key: number) => {
    const number = queryFirstText(chapter, "@number");
    const title = queryFirstText(chapter, "title");
    const sections = queryElements(chapter, "section");
    return (
        <li key={key}>
          <NavLink to={`#chapter-${number}`}>
            {number} luku - {title}
          </NavLink>
          <ul style={{listStyle: "none"}}>
            {sections.map((section, i) => renderChapterSectionLink(number, section, i))}
          </ul>
        </li>
    );
  };

  return (
      <NavSticky ref={navRef} tabIndex={0}
                 onMouseEnter={() => navRef?.current?.focus()}
                 onMouseLeave={() => navRef?.current?.blur()}>
        <div style={{padding: `${tokens.spacing.s} 0`}}>
          <Text.bold>Sisällysluettelo</Text.bold>
        </div>

        <ul style={{listStyle: 'none'}}>
          {chapters.map(renderChapterLink)}
        </ul>
        <ul style={{listStyle: 'none'}}>
          {sections.map(renderSectionLink)}
        </ul>
      </NavSticky>
  );
};

export default TableOfContents;
