import React, {useEffect, useState} from "react";
import {queryElements, queryFirstElement, queryFirstText} from "../../../utils/xmlUtils";
import {useTerminologies} from "./useTerminologies";
import Select, {OptionTypeBase} from "react-select";
import {useDocumentProperties} from "../useDocumentProperties";
import {splitIfTruthy} from "../../../utils/arrayUtils";

interface Props {
  schemaName: string,
  id: string
}

const Terminologies: React.FC<Props> = ({schemaName,id}) => {
  const {terminologies} = useTerminologies();
  const {properties, saveProperties} = useDocumentProperties(schemaName,id);

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
      return queryFirstElement(terminologies.documentElement,
          `/terminologies/terminology[@uri = '${uri}']`)?.textContent || uri;
    };

    setSelectedTerminologies(
        splitIfTruthy(properties["terminologies"], ",")
        .map(uri => ({
          value: uri,
          label: findLabel(uri)
        })));
  }, [terminologies, properties]);

  const labelComparator = (a: Element, b: Element): number => {
    const aLabel = queryFirstText(a, 'label');
    const bLabel = queryFirstText(b, 'label');
    return aLabel > bLabel ? 1 : (aLabel < bLabel ? -1 : 0);
  };

  const selectTerminologies = (entries: any) => {
    const value = entries ? entries.map((e: any) => e.value).join(",") : "";
    const updatedProperties = {...properties, terminologies: value};

    saveProperties(updatedProperties).catch(error => console.error(error));
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
