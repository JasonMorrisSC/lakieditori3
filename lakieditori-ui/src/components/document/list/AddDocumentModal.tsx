import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import Modal from "react-modal";
import {Button, Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {parseXml, updateElement} from "../../../utils/xmlUtils";
import {FlexColTight} from "../../common/StyledComponents";
import {Input} from "../../common/StyledInputComponents";
import {currentYear} from "../../../utils/dateUtils";

interface AddDocumentModalProps {
  schemaName: string,
  title: string,
  isModalOpen: boolean,
  setModalOpen: (isModalOpen: boolean) => void,
  saveDocument: (document: Document) => Promise<any>,
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({schemaName, title, isModalOpen, setModalOpen, saveDocument}) => {
  const history = useHistory();
  const [newDocumentNumber, setNewDocumentNumber] = useState<string>(`${currentYear()}/???`);
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>("Nimetön dokumentti");

  function addNewDocument() {
    let newDocument = parseXml(`<${schemaName}><title/></${schemaName}>`);
    updateElement(newDocument, `/${schemaName}`, (e) => e.setAttribute("number", newDocumentNumber));
    updateElement(newDocument, `/${schemaName}/title`, (e) => e.textContent = newDocumentTitle);

    saveDocument(newDocument).then((response) => {
      const location = response.headers.location;
      const createdId = location.substring(location.lastIndexOf('/') + 1);
      history.push(`${schemaName}/documents/${createdId}/edit`);
    });
  }

  return (
      <Modal isOpen={isModalOpen} contentLabel={title} style={{
        content: {
          height: "60%",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 800,
          padding: tokens.spacing.l,
        }
      }}>
        <FlexColTight style={{height: "100%"}}>
          <Heading.h1>
            {title}
          </Heading.h1>

          <hr/>

          <label>
            Dokumentin numero
            <Input value={newDocumentNumber}
                   onChange={(e) => setNewDocumentNumber(e.currentTarget.value)}/>
          </label>

          <label>
            Dokumentin nimi
            <Input value={newDocumentTitle}
                   onChange={(e) => setNewDocumentTitle(e.currentTarget.value)}/>
          </label>

          <div style={{marginTop: "auto"}}>
            <Button
                icon={"plus"}
                onClick={addNewDocument}
                style={{marginRight: tokens.spacing.s}}>
              Lisää
            </Button>
            <Button.secondaryNoborder
                icon={"close"}
                onClick={() => setModalOpen(false)}>
              Peruuta
            </Button.secondaryNoborder>
          </div>
        </FlexColTight>
      </Modal>
  );
};

export default AddDocumentModal;
