import styled from '@emotion/styled'
import {css} from "@emotion/core";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";

export const panelWithBorderCss = css`
  background-color: ${tokens.colors.whiteBase};
  border: 1px solid ${tokens.colors.depthLight13};
  padding: ${tokens.spacing.l};
`;

export const MainWithBorders = styled.main`
  ${panelWithBorderCss};
  min-height: 400px;
`;

export const PanelWithBorders = styled.div`
  ${panelWithBorderCss}
`;

export const HeaderBackground = styled.div`
  background: ${tokens.colors.whiteBase};
  border-top: 4px solid ${tokens.colors.brandBase};
  border-bottom: 1px solid ${tokens.colors.depthLight13};
  padding: ${tokens.spacing.m} 0;
`;

export const TopNavigationBackground = styled.div`
  background: ${tokens.colors.whiteBase};
  border-bottom: 1px solid ${tokens.colors.depthLight13};
`;

export const ContentContainer = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 ${tokens.spacing.m};
  width: 100%;
  max-width: 1200px;
`;
