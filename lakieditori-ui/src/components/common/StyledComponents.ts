import styled from '@emotion/styled'
import {css} from "@emotion/core";
import {suomifiDesignTokens as tokens} from "suomifi-ui-components";

export const panelWithBorderCss = css`
  background-color: ${tokens.colors.whiteBase};
  border: 1px solid ${tokens.colors.depthLight13};
  padding: ${tokens.spacing.l};
`;

export const horizontalLabeledInputCss = css`
  display: flex;
  align-items: center;
  & > label {
    flex: 1;
    line-height: 1;
    margin-right: ${tokens.spacing.m};
  }
  & > input {
    flex: 6;
  }
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

export const TableSmall = styled.table`
  border-collapse: collapse;
  font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
  table-layout: fixed;
  width: 100%;
  & > thead > tr > th,
  & > thead > tr > td,
  & > tbody > tr > th,
  & > tbody > tr > td {
    border-bottom: 1px solid ${tokens.colors.depthLight26};
    padding: ${tokens.spacing.xs};
    text-align: left; 
    vertical-align: top;
  };
  & > thead > tr > th.right,
  & > thead > tr > td.right,
  & > tbody > tr > th.right,
  & > tbody > tr > td.right {
    text-align: right; 
  };
`;

export const Table = styled.table`
  border-collapse: collapse;
  font-size: ${tokens.values.typography.bodyText.fontSize.value}${tokens.values.typography.bodyText.fontSize.unit};
  table-layout: fixed;
  width: 100%;
  & > thead > tr > th,
  & > thead > tr > td,
  & > tbody > tr > th,
  & > tbody > tr > td {
    border-bottom: 1px solid ${tokens.colors.depthLight26};
    padding: ${tokens.spacing.s};
    text-align: left; 
    vertical-align: top;
  };
  & > thead > tr > th.right,
  & > thead > tr > td.right,
  & > tbody > tr > th.right,
  & > tbody > tr > td.right {
    text-align: right; 
  };
`;
