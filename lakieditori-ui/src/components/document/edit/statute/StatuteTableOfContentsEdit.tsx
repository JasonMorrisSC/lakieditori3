import React, {Dispatch, SetStateAction} from "react";
import {HashLink as Link} from 'react-router-hash-link';
import styled from '@emotion/styled'
import {suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {
  childElements,
  cloneDocument,
  queryFirstElement,
  queryFirstText
} from "../../../../utils/xmlUtils";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";

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
  setDocument: Dispatch<SetStateAction<Document>>,
}

const StatuteTableOfContentsEdit: React.FC<Props> = ({document, setDocument}) => {

  const renderSectionLink = (section: Element, key: number) => {
    const number = queryFirstText(section, "@number");
    const heading = queryFirstText(section, "heading");
    return (
        <li key={key}>
          <NavLink to={`#section-${number}`}>
            {number} § - {heading}
          </NavLink>
        </li>
    );
  };

  const renderSubheadingLink = (subheading: Element, key: number) => {
    const number = queryFirstText(subheading, "@number");
    return (
        <li key={key}>
          <NavLink to={`#subheading-${number}`}>
            {subheading.textContent}
          </NavLink>
        </li>
    );
  };

  const renderChapterLink = (element: Element, elementPath: string, index: number) => {
    const number = queryFirstText(element, "@number");
    const heading = queryFirstText(element, "heading");

    return (
        <Draggable draggableId={elementPath} index={index} key={elementPath}>
          {(providedDraggable => (
              <li {...providedDraggable.draggableProps}
                  {...providedDraggable.dragHandleProps}
                  ref={providedDraggable.innerRef}>

                <NavLink to={`#chapter-${number}`}>
                  {number} luku - {heading}
                </NavLink>

                <Droppable droppableId={elementPath} type={elementPath}>
                  {(providedDroppable => {
                    let sectionCounter = 1;

                    return (
                        <ul style={{listStyle: "none"}}
                            {...providedDroppable.droppableProps}
                            ref={providedDroppable.innerRef}>
                          {childElements(element).map((e, i) => {
                            switch (e.tagName) {
                              case "section":
                                return renderChapterSectionLink(number, e, `${elementPath}/section[${sectionCounter++}]`, i);
                              case "subheading":
                                return renderChapterSubheadingLink(number, e, i);
                              default:
                                return "";
                            }
                          })}
                          {providedDroppable.placeholder}
                        </ul>
                    );
                  })}
                </Droppable>
              </li>
          ))}
        </Draggable>
    );
  };

  const renderPartLink = (part: Element, key: number) => {
    const number = queryFirstText(part, "@number");
    const heading = queryFirstText(part, "heading");
    return (
        <li key={key}>
          <NavLink to={`#part-${number}`}>
            {number} osa - {heading}
          </NavLink>
          <ul style={{listStyle: "none"}}>
            {childElements(part).map((e, i) => {
              switch (e.tagName) {
                case "chapter":
                  return renderChapterLink(e, "", i);
                default:
                  return "";
              }
            })}
          </ul>
        </li>
    );
  };

  const renderChapterSectionLink = (chapterNumber: string, section: Element, elementPath: string, index: number) => {
    const number = queryFirstText(section, "@number");
    const heading = queryFirstText(section, "heading");

    return (
        <Draggable
            draggableId={elementPath}
            index={index}
            key={elementPath}>
          {(providedDraggable => (
              <li {...providedDraggable.draggableProps}
                  {...providedDraggable.dragHandleProps}
                  ref={providedDraggable.innerRef}>
                <NavLinkSecondary to={`#chapter-${chapterNumber}-section-${number}`}>
                  {number} § - {heading}
                </NavLinkSecondary>
              </li>
          ))}
        </Draggable>
    );
  };

  const renderChapterSubheadingLink = (chapterNumber: string, subheading: Element, key: number) => {
    const number = queryFirstText(subheading, "@number");
    return (
        <li key={key}>
          <NavLinkSecondary to={`#chapter-${chapterNumber}-subheading-${number}`}>
            {subheading.textContent}
          </NavLinkSecondary>
        </li>
    );
  };

  const onDragEnd = (result: DropResult) => {
    const newDocument = cloneDocument(document);

    const elementPath = result.draggableId;
    const sourceIndex = result.source.index;
    const targetIndex = result.destination ? result.destination.index : sourceIndex;

    const element = queryFirstElement(newDocument, elementPath);

    if (!element || sourceIndex === targetIndex) {
      return;
    }

    if (sourceIndex < targetIndex) {
      let movePositions = targetIndex - sourceIndex;
      let targetNode = element.nextSibling;

      while (--movePositions > 0 && targetNode) {
        targetNode = targetNode.nextSibling;
      }

      if (targetNode && targetNode.parentNode) {
        targetNode.parentNode.insertBefore(element, targetNode.nextSibling)
      }
    }

    if (sourceIndex > targetIndex) {
      let movePositions = sourceIndex - targetIndex;
      let targetNode = element.previousSibling;

      while (--movePositions > 0 && targetNode) {
        targetNode = targetNode.previousSibling;
      }

      if (targetNode && targetNode.parentNode) {
        targetNode.parentNode.insertBefore(element, targetNode)
      }
    }

    setDocument(newDocument);
  }

  return (
      <NavSticky>
        <div style={{padding: `${tokens.spacing.s} 0`}}>
          <Text.bold>Sisällysluettelo</Text.bold>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={"statute"} type={"statute"}>
            {(provided) => {
              let chapterCounter = 1;

              return (
                  <ul style={{listStyle: 'none'}}
                      {...provided.droppableProps}
                      ref={provided.innerRef}>
                    {childElements(document.documentElement).map((e, i) => {
                      switch (e.tagName) {
                        case "section":
                          return renderSectionLink(e, i);
                        case "subheading":
                          return renderSubheadingLink(e, i);
                        case "chapter":
                          return renderChapterLink(e, `/statute/chapter[${chapterCounter++}]`, i);
                        case "part":
                          return renderPartLink(e, i);
                        default:
                          return "";
                      }
                    })}
                    {provided.placeholder}
                  </ul>
              );
            }}
          </Droppable>
        </DragDropContext>
      </NavSticky>
  );
};

export default StatuteTableOfContentsEdit;
