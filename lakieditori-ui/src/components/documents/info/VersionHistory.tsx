/** @jsx jsx */
import {jsx} from '@emotion/core'
import React, {useEffect, useState} from "react";
import axios from "axios";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import {parseXml, queryElements, queryFirstText} from "../../../utils/xmlUtils";
import {Button, suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import {FlexRow, TableStyleRow} from "../../common/StyledComponents";

const VersionHistory: React.FC<Props> = ({id}) => {
  const [versions, setVersions] = useState<Document>(parseXml('<documents></documents>'));
  const [selectedVersion, setSelectedVersion] = useState<string>('');

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
      <div>
        <TableStyleRow>
          <div><Text.bold>Versio</Text.bold></div>
          <div><Text.bold>Päivämäärä</Text.bold></div>
          <div><Text.bold>Tekijä</Text.bold></div>
          <div/>
        </TableStyleRow>
        {queryElements(versions.documentElement, 'document')
        .map((document, i) => {
          const version = document.getAttribute('version') || '';
          const lastModifiedDate = document.getAttribute('lastModifiedDate') || '';
          const lastModifiedBy = document.getAttribute('lastModifiedBy') || '';
          return (
              <div key={i}>
                <TableStyleRow>
                  <div>v. {version}</div>
                  <div>{new Date(lastModifiedDate).toLocaleString('fi-FI', {timeZone: "UTC"})}</div>
                  <div>{lastModifiedBy}</div>
                  <div style={{textAlign: "right"}}>
                    <Button.secondaryNoborder
                        icon={"chevronDown"}
                        onClick={() => setSelectedVersion(selectedVersion === version ? '' : version)}>
                      Näytä muutokset
                    </Button.secondaryNoborder>
                  </div>
                </TableStyleRow>
                {selectedVersion === version
                    ? <DiffView id={id}
                                leftVersion={(parseInt(version) - 1) + ""}
                                rightVersion={version}/> : ''}
              </div>
          );
        })}
      </div>
  );
};

interface Props {
  id: string
}

const DiffView: React.FC<DiffViewProps> = ({id, leftVersion, rightVersion}) => {
  const [diff, setDiff] = useState<Document>(parseXml('<differences></differences>'));

  useEffect(() => {
    if (leftVersion && rightVersion) {
      axios.get('/api/documents/' + id + '/diff', {
        params: {leftVersion, rightVersion},
        responseType: 'document'
      }).then(res => {
        setDiff(res.data);
      });
    }
  }, [leftVersion, rightVersion]);

  return (
      <div>
        {queryElements(diff.documentElement, 'difference')
        .map((difference, i) => {
          const leftPath = queryFirstText(difference, 'left/path');
          const leftText = queryFirstText(difference, 'left/text');
          const rightPath = queryFirstText(difference, 'right/path');
          const rightText = queryFirstText(difference, 'right/text');
          return (
              <FlexRow key={i}>
                <div style={{
                  padding: tokens.spacing.s,
                  backgroundColor: tokens.colors.alertLight47
                }}>
                  <div style={{color: tokens.colors.depthBase}}>
                    {leftPath}
                  </div>
                  <div>
                    {leftText}
                  </div>
                </div>
                <div style={{
                  marginLeft: 0,
                  padding: tokens.spacing.s,
                  backgroundColor: tokens.colors.accentSecondaryLight40
                }}>
                  <div style={{color: tokens.colors.depthBase}}>
                    {rightPath}
                  </div>
                  <div>
                    {rightText}
                  </div>
                </div>
              </FlexRow>
          );
        })}
      </div>
  );
};


interface DiffViewProps {
  id: string,
  leftVersion: string,
  rightVersion: string
}

export default VersionHistory;
