import React, {useContext, useState} from "react";
import {Link} from "react-router-dom";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {Table} from "../../common/StyledComponents";
import {documentStateLabelFi, parseDocumentState} from "../DocumentTypes";
import {AuthenticationContext} from "../../../App";
import {NULL_USER} from "../../../utils/User";
import {ButtonIconOnly} from "../../common/StyledInputComponents";
import {useDocuments} from "./useDocuments";
import AddDocumentModal from "./AddDocumentModal";
import {queryElements, queryFirstText} from "../../../utils/xmlUtils";
import {toFiDateTimeStringInUtc} from "../../../utils/dateUtils";

interface Props {
  schemaName: string,
  newDocumentTemplate: string,
  listLabel: string,
  addButtonLabel: string,
}

const DocumentList: React.FC<Props> = ({schemaName, newDocumentTemplate, listLabel, addButtonLabel}) => {
  const [user] = useContext(AuthenticationContext);
  const {documents, saveDocument, removeDocument} = useDocuments(schemaName);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const documentComparator = (a: Element, b: Element): number => {
    const aTimestamp = queryFirstText(a, '@lastModifiedDate').trim() || '';
    const bTimestamp = queryFirstText(b, '@lastModifiedDate').trim() || '';
    return aTimestamp > bTimestamp ? -1 : (aTimestamp < bTimestamp ? 1 : 0);
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
            <Link to={`/${schemaName}/${id}`}>{number}</Link>
          </td>
          <td>
            <Link to={`/${schemaName}/${id}`}>{title}</Link>
          </td>
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
      <div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <Heading.h2 style={{marginBottom: tokens.spacing.m}}>
            {listLabel}
          </Heading.h2>

          {user !== NULL_USER &&
          <Button icon={"plus"} onClick={() => setModalOpen(true)}>
            {addButtonLabel}
          </Button>}
        </div>

        <Table style={{
          margin: `${tokens.spacing.s} 0 ${tokens.spacing.m} 0`,
        }}>
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
          {queryElements(documents.documentElement, schemaName)
          .sort(documentComparator)
          .map(renderDocumentRow)}
          </tbody>
        </Table>

        <AddDocumentModal
            schemaName={schemaName}
            newDocumentTemplate={newDocumentTemplate}
            title={addButtonLabel}
            isModalOpen={isModalOpen}
            setModalOpen={setModalOpen}
            saveDocument={saveDocument}/>
      </div>
  );
};

export default DocumentList;
