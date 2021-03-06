import styled from '@emotion/styled'
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";

export const Toolbar = styled.div`
  align-items: flex-end;
  background-color: ${tokens.colors.depthLight30};
  border-bottom: 1px solid ${tokens.colors.whiteBase};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: ${tokens.spacing.m} 0 0;
  padding: ${tokens.spacing.s} 0;
  position: sticky;
  top: 0;
  min-height: 40px;
  z-index: 1;
`;

export const ErrorPanel = styled.div`
  background-color: ${tokens.colors.alertLight47};
  border: 1px solid ${tokens.colors.whiteBase};
  margin-top: ${tokens.spacing.xs};
  padding: ${tokens.spacing.m};
  width: 100%;
`;
