import styled from '@emotion/styled'
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";

export const Toolbar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: ${tokens.spacing.l} 0 ${tokens.spacing.s};
`;
