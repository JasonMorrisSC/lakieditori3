import styled from "@emotion/styled";
import {suomifiDesignTokens as tokens} from "suomifi-design-tokens";
import {Container} from "../common/StyledComponents";
import {Link} from "react-router-dom";

export const HeaderBackground = styled.div`
  background: ${tokens.colors.whiteBase};
  border-top: 4px solid ${tokens.colors.brandBase};
  border-bottom: 1px solid ${tokens.colors.depthLight13};
`;

export const HeaderContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  padding: ${tokens.spacing.m};
`;

export const AppName = styled.div`
  color: ${tokens.colors.brandBase};
  font-size: 28px;
`;

export const NavigationBackground = styled.div`
  background: ${tokens.colors.whiteBase};
  border-bottom: 1px solid ${tokens.colors.depthLight13};
`;

export const StyledNavigationLink = styled(Link)`
  color: ${tokens.colors.blackBase} !important;
  line-height: 2.5;
  padding: ${tokens.spacing.s} 0;
  margin-right: ${tokens.spacing.l};
  text-decoration: none;
  white-space: nowrap;
`;
