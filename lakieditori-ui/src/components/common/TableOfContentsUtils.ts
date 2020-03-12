import NavigationTreeNode from "./NavigationTreeNode";
import {queryElements, queryFirstText} from "../../utils/xmlUtils";

export function buildNavigationTree(documentElement: Element): NavigationTreeNode[] {
  return queryElements(documentElement, 'chapter').map(chapter => {
    const chapterNumber = queryFirstText(chapter, "@number");
    const chapterTitle = queryFirstText(chapter, "title");
    return {
      to: `#chapter-${chapterNumber}`,
      label: `${chapterNumber} luku - ${chapterTitle}`,
      children: queryElements(chapter, 'section').map(section => {
        const sectionNumber = queryFirstText(section, "@number");
        const sectionTitle = queryFirstText(section, "title");
        return {
          to: `#chapter-${chapterNumber}-section-${sectionNumber}`,
          label: `${sectionNumber} § - ${sectionTitle}`
        };
      })
    };
  });
}
