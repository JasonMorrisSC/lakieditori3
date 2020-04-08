import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {Button, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {PageHeading, Panel, Table} from "../../common/StyledComponents";
import {documentStateLabelFi, parseDocumentState} from "../DocumentTypes";
import {AuthenticationContext} from "../../../App";
import {NULL_USER} from "../../../utils/User";
import {ButtonIconOnly} from "../../common/InputStyles";
import {useDocuments} from "./useDocuments";
import AddDocumentModal from "./AddDocumentModal";
import {queryElements, queryFirstText} from "../../../utils/xmlUtils";
import {toFiDateTimeStringInUtc} from "../../../utils/dateUtils";

const DocumentList: React.FC = () => {
  const [user] = useContext(AuthenticationContext);
  const {documents, saveDocument, removeDocument} = useDocuments();
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);

  const titleComparator = (a: Element, b: Element): number => {
    const aName = queryFirstText(a, 'title').trim() || '';
    const bName = queryFirstText(b, 'title').trim() || '';
    return aName < bName ? -1 : (aName > bName ? 1 : 0);
  };

  const renderDocumentRow = (e: Element, i: number) => {
    const id = queryFirstText(e, "@id");
    const number = queryFirstText(e, "@number");
    const title = queryFirstText(e, 'title');
    const state = documentStateLabelFi(parseDocumentState(queryFirstText(e, '@state')));
    const lastModifiedDate = toFiDateTimeStringInUtc(queryFirstText(e, "@lastModifiedDate"));

    return (
        <tr key={i}>
          <td style={{color: tokens.colors.highlightBase}}>
            <Link to={`/documents/${id}`}>{number}</Link>
          </td>
          <td>{title}</td>
          <td>{state}</td>
          <td>{lastModifiedDate}</td>
          {user !== NULL_USER &&
          <td className={"right"}>
            <ButtonIconOnly icon={"remove"} onClick={() => removeDocument(id)}/>
          </td>}
        </tr>
    );
  };

  return (
      <main>
        <PageHeading>
          Lakiluonnokset
        </PageHeading>
        <Panel>
          <Table style={{marginBottom: tokens.spacing.l, tableLayout: "initial"}}>
            <thead>
            <tr>
              <th>Numero</th>
              <th>Nimi</th>
              <th>Tila</th>
              <th>Muokattu</th>
              {user !== NULL_USER && <th/>}
            </tr>
            </thead>
            <tbody>
            {queryElements(documents.documentElement, 'document')
            .sort(titleComparator)
            .map(renderDocumentRow)}
            </tbody>
          </Table>

          {user !== NULL_USER &&
          <Button icon={"plus"} onClick={() => setModalOpen(true)}>
            Lisää uusi lakiluonnos
          </Button>}

          <AddDocumentModal
              isModalOpen={isModalOpen}
              setModalOpen={setModalOpen}
              saveDocument={saveDocument}/>
        </Panel>
      </main>
  );
};

export default DocumentList;
