import React from "react";
import {HashLink as Link} from 'react-router-hash-link';
import styled from '@emotion/styled'
import {suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {queryElements, queryFirstText} from "../../../../utils/xmlUtils";

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

const ProposalTableOfContents: React.FC<Props> = ({document}) => {

  const renderChapterLink = (chapter: Element, key: number) => {
    const number = queryFirstText(chapter, "@number");
    const heading = queryFirstText(chapter, "heading");
    return (
        <li key={key}>
          <NavLink to={`#chapter-${number}`}>
            {number} {heading}
          </NavLink>
          <ul style={{listStyle: "none"}}>
            {queryElements(chapter, 'section').map((e, i) =>
                renderChapterSectionLink(e, i))
            }
          </ul>
        </li>
    );
  };

  const renderChapterSectionLink = (section: Element, key: number) => {
    const number = queryFirstText(section, "@number");
    const heading = queryFirstText(section, "heading");
    return (
        <li key={key}>
          <NavLinkSecondary to={`#section-${number}`}>
            {number} {heading}
          </NavLinkSecondary>
          <ul style={{listStyle: "none", marginLeft: 0}}>
            {queryElements(section, 'subsection').map((e, i) =>
                renderSubsectionLink(e, i))
            }
          </ul>
        </li>
    );
  };

  const renderSubsectionLink = (subsection: Element, key: number) => {
    const number = queryFirstText(subsection, "@number");
    const heading = queryFirstText(subsection, "heading");
    return (
        <li key={key}>
          <NavLinkSecondary to={`#subsection-${number}`}>
            {number} {heading}
          </NavLinkSecondary>
          <ul style={{listStyle: "none", marginLeft: 0}}>
            {queryElements(subsection, 'paragraph').map((e, i) =>
                renderParagraphLink(e, i))
            }
          </ul>
        </li>
    );
  };

  const renderParagraphLink = (paragraph: Element, key: number) => {
    const number = queryFirstText(paragraph, "@number");
    const heading = queryFirstText(paragraph, "heading");
    return (
        <li key={key}>
          <NavLinkSecondary to={`#paragraph-${number}`}>
            {number} {heading}
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
          <NavLink to={"#abstract"}>
            Pääasiallinen sisältö
          </NavLink>
          <NavLink to={"#proposal"}>
            Perustelut
          </NavLink>
          {queryElements(document.documentElement, 'chapter').map((e, i) =>
              renderChapterLink(e, i))
          }
        </ul>
      </NavSticky>
  );
};

export default ProposalTableOfContents;
