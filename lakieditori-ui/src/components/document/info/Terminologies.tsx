import React, {useEffect, useState} from "react";
import {
  cloneDocument,
  countNodes,
  queryElements,
  queryFirstElement,
  queryFirstText
} from "../../../utils/xmlUtils";
import {useTerminologies} from "./useTerminologies";
import {useDocument} from "../useDocument";
import Select, {OptionTypeBase} from "react-select";

interface Props {
  id: string
}

const Terminologies: React.FC<Props> = ({id}) => {
  const {terminologies} = useTerminologies();
  const {document, saveDocument} = useDocument(id);

  const [terminologyOptions, setTerminologyOptions] = useState<OptionTypeBase[]>([]);
  const [selectedTerminologies, setSelectedTerminologies] = useState<OptionTypeBase[]>([]);

  useEffect(() => {
    setTerminologyOptions(
        queryElements(terminologies.documentElement, "/terminologies/terminology")
        .sort(labelComparator)
        .map(v => ({
          value: queryFirstText(v, '@uri'),
          label: queryFirstText(v, 'label')
        })));
  }, [terminologies]);

  useEffect(() => {
    const findLabel = (uri: string): string => {
      return queryFirstElement(terminologies.documentElement, `/terminologies/terminology[@uri = '${uri}']`)?.textContent || uri;
    };

    setSelectedTerminologies(
        queryElements(document.documentElement, "/document/settings/vocabulary")
        .map(e => {
          const uri = e.textContent || "???";
          return {
            value: uri,
            label: findLabel(uri)
          }
        }));
  }, [terminologies, document]);

  const labelComparator = (a: Element, b: Element): number => {
    const aLabel = queryFirstText(a, 'label');
    const bLabel = queryFirstText(b, 'label');
    return aLabel > bLabel ? 1 : (aLabel < bLabel ? -1 : 0);
  };

  const selectTerminologies = (entries: any) => {
    const copy = cloneDocument(document);
    const copyRoot = copy.documentElement;

    if (countNodes(copyRoot, "/document/settings") === 0) {
      copyRoot.appendChild(copy.createElement("settings"));
    } else {
      queryElements(copyRoot, "/document/settings/vocabulary")
      .forEach(e => e.parentElement?.removeChild(e));
    }

    const settings = queryFirstElement(copyRoot, "/document/settings");

    if (settings && entries) {
      entries.forEach((e: any) => {
        settings.appendChild(copy.createElement("vocabulary")).textContent = e.value;
      });
    }

    saveDocument(copy).catch(error => {
      console.error(error);
    });
  };

  return (
      <div>
        <Select
            value={selectedTerminologies}
            onChange={selectTerminologies}
            options={terminologyOptions}
            isMulti={true}
            placeholder={"Valitse sanastot"}
        />
      </div>
  );
};

export default Terminologies;
