import React, {useEffect, useState} from "react";
import {Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {queryElements, queryFirstText} from "../../../utils/xmlUtils";
import {FlexRow, Panel, PanelSmallWithShadow} from "../../common/StyledComponents";
import {useDocument} from "../useDocument";
import DocumentConnectionsToolbar from "./DocumentConnectionsToolbar";
import {useDocumentConcepts} from "../view/useDocumentConcept";
import {useClassesAndAttributes} from "./useClassesAndAttributes";

interface Props {
  schemaName: string,
  id: string,
}

const DocumentConnections: React.FC<Props> = ({schemaName, id}) => {
  const {document} = useDocument(schemaName, id);
  const {concepts} = useDocumentConcepts(document);

  const [selectedConcept, setSelectedConcept] = useState<string>("");
  const {classesAndAttributes} = useClassesAndAttributes(selectedConcept);

  const [classes, setClasses] = useState<Element[]>([]);
  const [attributes, setAttributes] = useState<Element[]>([]);

  useEffect(() => {
    setClasses(queryElements(classesAndAttributes, "/classesAndAttributes/class"));
    setAttributes(queryElements(classesAndAttributes, "/classesAndAttributes/attribute"));
  }, [classesAndAttributes]);

  const element = document.documentElement;
  const title = queryFirstText(element, "title");

  return (
      <main>
        <DocumentConnectionsToolbar schemaName={schemaName} id={id} title={title}/>

        <Panel style={{padding: tokens.spacing.xl}}>
          <Heading.h1hero style={{marginBottom: tokens.spacing.l}}>
            <small style={{color: tokens.colors.depthDark27}}>Tietomalliyhteydet</small>
            <br/>
            {title}
          </Heading.h1hero>

          <PanelSmallWithShadow style={{
            backgroundColor: tokens.colors.accentSecondaryLight40,
            margin: `${tokens.spacing.l} 0`
          }}>
            Klikkaa käsitteen nimeä ja näet käsitteeseen pohjautuvat luokat ja attribuutit.
            Tarkempiin määrittelyihin pääset klikkaamalla aineiston nimeä.
          </PanelSmallWithShadow>

          <FlexRow>
            <div>
              <Heading.h2 style={{marginBottom: tokens.spacing.m}}>Käsitteet</Heading.h2>

              <ul>
                {concepts.map((concept, i) => (
                    <li key={i}
                        style={{fontWeight: selectedConcept === queryFirstText(concept, "@uri") ? 600 : 400}}>
                      <a onClick={() => setSelectedConcept(queryFirstText(concept, "@uri"))}>
                        {queryFirstText(concept, "label")}
                      </a>
                      <br/>
                      <a target={"_blank"} href={queryFirstText(concept, "@uri")}
                         style={{
                           fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
                           color: tokens.colors.depthBase
                         }}>
                        {queryFirstText(concept, "terminology/label")}
                      </a>
                    </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading.h2 style={{marginBottom: tokens.spacing.m}}>Luokat</Heading.h2>

              <ul>
                {classes.map((cls, i) => (
                    <li key={i}>
                      {queryFirstText(cls, "label")}
                      <br/>
                      <a target={"_blank"} href={queryFirstText(cls, "@uri")}
                         style={{
                           fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
                           color: tokens.colors.depthBase
                         }}>
                        {queryFirstText(cls, "graph/label")}
                      </a>
                    </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading.h2 style={{marginBottom: tokens.spacing.m}}>Attribuutit</Heading.h2>

              <ul>
                {attributes.map((attr, i) => (
                    <li key={i}>
                      {queryFirstText(attr, "label")}
                      <br/>
                      <a target={"_blank"} href={queryFirstText(attr, "@uri")}
                         style={{
                           fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
                           color: tokens.colors.depthBase
                         }}>
                        {queryFirstText(attr, "graph/label")}
                      </a>
                    </li>
                ))}
              </ul>
            </div>
          </FlexRow>


        </Panel>
      </main>
  );
};

export default DocumentConnections;
