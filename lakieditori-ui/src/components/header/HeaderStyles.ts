import styled from "@emotion/styled";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import {Container} from "../common/StyledComponents";

export const HeaderBackground = styled.div`
  background: ${tokens.colors.whiteBase};
  border-top: 3px solid ${tokens.colors.brandBase};
  border-bottom: 1px solid ${tokens.colors.depthLight13};
`;

export const HeaderContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: ${tokens.values.typography.bodySemiBold.fontWeight};
  padding: ${tokens.spacing.s};
`;

export const AppName = styled.span`
  color: ${tokens.colors.brandBase};
  font-size: ${tokens.values.typography.heading2SmallScreen.fontSize.value}${tokens.values.typography.heading2SmallScreen.fontSize.unit};
`;
