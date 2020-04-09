/** @jsx jsx */
import {jsx} from '@emotion/core'
import styled from "@emotion/styled";
import React from "react";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {queryElements, queryFirstText} from "../../../utils/xmlUtils";
import {FlexRowPlain} from "../../common/StyledComponents";
import {useDiff} from "./useDiff";

export const LeftPanel = styled.div`
  background-color: ${tokens.colors.alertLight47};
  padding: ${tokens.spacing.s};
`;

export const RightPanel = styled.div`
  background-color: ${tokens.colors.accentSecondaryLight40};
  padding: ${tokens.spacing.s};
`;

export const Path = styled.div`
  color: ${tokens.colors.depthBase};
`;

interface Props {
  id: string,
  leftVersion: number,
  rightVersion: number,
}

const VersionDiff: React.FC<Props> = ({id, leftVersion, rightVersion}) => {
  const {diff} = useDiff(id, leftVersion, rightVersion);
  return (
      <div>
        {queryElements(diff.documentElement, 'difference')
        .map((difference, i) => {
          const leftPath = queryFirstText(difference, 'left/path');
          const leftText = queryFirstText(difference, 'left/text');
          const rightPath = queryFirstText(difference, 'right/path');
          const rightText = queryFirstText(difference, 'right/text');
          return (
              <FlexRowPlain key={i}>
                <LeftPanel>
                  <Path>
                    {leftPath}
                  </Path>
                  <div>
                    {leftText}
                  </div>
                </LeftPanel>
                <RightPanel>
                  <Path>
                    {rightPath}
                  </Path>
                  <div>
                    {rightText}
                  </div>
                </RightPanel>
              </FlexRowPlain>
          );
        })}
      </div>
  );
};


export default VersionDiff;
