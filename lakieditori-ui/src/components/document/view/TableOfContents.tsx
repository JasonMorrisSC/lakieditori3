import React, {useRef} from "react";
import {HashLink as Link} from 'react-router-hash-link';
import styled from '@emotion/styled'
import {suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {childElements, queryFirstText} from "../../../utils/xmlUtils";

const NavSticky = styled.nav`
  position: sticky;
  top: 56px;
  height: 93vh;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  } 
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

  const renderSubheadingLink = (subheading: Element, key: number) => {
    const number = queryFirstText(subheading, "@number");
    const title = subheading.textContent;
    return (
        <li key={key}>
          <NavLink to={`#subheading-${number}`}>
            {title}
          </NavLink>
        </li>
    );
  };

  const renderChapterLink = (chapter: Element, key: number) => {
    const number = queryFirstText(chapter, "@number");
    const title = queryFirstText(chapter, "title");
    return (
        <li key={key}>
          <NavLink to={`#chapter-${number}`}>
            {number} luku - {title}
          </NavLink>
          <ul style={{listStyle: "none"}}>
            {childElements(chapter).map((e, i) => {
              switch (e.tagName) {
                case "section":
                  return renderChapterSectionLink(number, e, i);
                case "subheading":
                  return renderChapterSubheadingLink(number, e, i);
                default:
                  return "";
              }
            })}
          </ul>
        </li>
    );
  };

  const renderPartLink = (part: Element, key: number) => {
    const number = queryFirstText(part, "@number");
    const title = queryFirstText(part, "title");
    return (
        <li key={key}>
          <NavLink to={`#part-${number}`}>
            {number} osa - {title}
          </NavLink>
          <ul style={{listStyle: "none"}}>
            {childElements(part).map((e, i) => {
              switch (e.tagName) {
                case "chapter":
                  return renderChapterLink(e, i);
                default:
                  return "";
              }
            })}
          </ul>
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

  const renderChapterSubheadingLink = (chapterNumber: string, subheading: Element, key: number) => {
    const number = queryFirstText(subheading, "@number");
    const title = subheading.textContent;
    return (
        <li key={key}>
          <NavLinkSecondary to={`#chapter-${chapterNumber}-subheading-${number}`}>
            {title}
          </NavLinkSecondary>
        </li>
    );
  };

  return (
      <NavSticky>
        <div style={{padding: `${tokens.spacing.s} 0`}}>
          <Text.bold>Sisällysluettelo</Text.bold>
        </div>

        <ul style={{listStyle: 'none'}}>
          {childElements(document.documentElement).map((e, i) => {
            switch (e.tagName) {
              case "section":
                return renderSectionLink(e, i);
              case "subheading":
                return renderSubheadingLink(e, i);
              case "chapter":
                return renderChapterLink(e, i);
              case "part":
                return renderPartLink(e, i);
              default:
                return "";
            }
          })}
        </ul>
      </NavSticky>
  );
};

export default TableOfContents;
