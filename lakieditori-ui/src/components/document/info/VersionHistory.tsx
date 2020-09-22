/** @jsx jsx */
import {jsx} from '@emotion/core'
import React, {useState} from "react";
import {Button, Text} from "suomifi-ui-components";
import {queryElements} from "../../../utils/xmlUtils";
import {toFiDateTimeStringInUtc} from "../../../utils/dateUtils";
import {TableStyleRow} from "../../common/StyledComponents";
import VersionDiff from "./VersionDiff";
import {useVersions} from "./useVersions";

interface Props {
  schemaName: string,
  id: string
}

const VersionHistory: React.FC<Props> = ({schemaName, id}) => {
  const {versions} = useVersions(schemaName, id);
  const [selectedVersion, setSelectedVersion] = useState<number>(-1);

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
          const version = parseInt(document.getAttribute('version') || '-1');
          const lastModifiedDate = toFiDateTimeStringInUtc(document.getAttribute('lastModifiedDate') || '');
          const lastModifiedBy = document.getAttribute('lastModifiedBy') || '';
          return (
              <div key={i}>
                <TableStyleRow>
                  <div>v. {version}</div>
                  <div>{lastModifiedDate}</div>
                  <div>{lastModifiedBy}</div>
                  <div style={{textAlign: "right"}}>
                    <Button.secondaryNoborder
                        icon={"chevronDown"}
                        onClick={() => setSelectedVersion(selectedVersion === version ? -1 : version)}>
                      Näytä muutokset
                    </Button.secondaryNoborder>
                  </div>
                </TableStyleRow>
                {selectedVersion === version &&
                <VersionDiff
                    schemaName={schemaName}
                    id={id}
                    leftVersion={version - 1}
                    rightVersion={version}/>}
              </div>
          );
        })}
      </div>
  );
};

export default VersionHistory;
