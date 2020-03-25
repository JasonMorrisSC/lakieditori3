import React, {useEffect, useState} from "react";
import axios from "axios";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import {parseXml, queryElements} from "../../../utils/xmlUtils";
import {Table} from "../../common/StyledComponents";

const VersionHistory: React.FC<Props> = ({id}) => {
  const [versions, setVersions] = useState<Document>(parseXml('<documents></documents>'));

  useEffect(() => {
    if (id) {
      axios.get('/api/documents/' + id + '/versions', {
        responseType: 'document'
      }).then(res => {
        setVersions(res.data);
      });
    }
  }, [id]);

  return (
      <Table>
        <thead>
        <tr>
          <th>Versio</th>
          <th>Päivämäärä</th>
          <th>Tekijä</th>
        </tr>
        </thead>
        <tbody>
        {queryElements(versions.documentElement, 'document')
        .map((document, i) => {
          const version = document.getAttribute('version') || '';
          const lastModifiedDate = document.getAttribute('lastModifiedDate') || '';
          const lastModifiedBy = document.getAttribute('lastModifiedBy') || '';
          return <tr key={i}>
            <th>v. {version}</th>
            <td>{new Date(lastModifiedDate).toLocaleString('fi-FI', {timeZone: "UTC"})}</td>
            <td>{lastModifiedBy}</td>
          </tr>
        })}
        </tbody>
      </Table>
  );
};

interface Props {
  id: string
}

export default VersionHistory;
