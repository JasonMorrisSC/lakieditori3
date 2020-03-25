import styled from '@emotion/styled'
import {css} from "@emotion/core";
import {Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";

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

export const inputCss = css`
  border: 1px solid ${tokens.colors.depthLight13};
  border-radius: 2px;
  box-sizing: border-box;
  font-family: ${tokens.values.typography.bodyText.fontFamily};
  font-size: ${tokens.values.typography.bodyText.fontSize.value}${tokens.values.typography.bodyText.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyText.fontWeight};
  line-height: ${tokens.values.typography.bodyText.lineHeight.value};
  margin: ${tokens.spacing.xxs} 0;
  padding: ${tokens.spacing.s};
  width: 100%;
`;

export const Input = styled.input`
  ${inputCss}
`;

export const Heading1WithBottomBorder = styled(Heading.h1)`
  border-bottom: 1px solid ${tokens.colors.depthLight13};
  padding-bottom: ${tokens.spacing.s};
`;

export const Heading2WithBottomBorder = styled(Heading.h2)`
  border-bottom: 1px solid ${tokens.colors.depthLight13};
  padding-bottom: ${tokens.spacing.s};
`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  & > * {
    flex: 1;
  }
  & > * + * {
    margin-left: ${tokens.spacing.l};  
  };
  @media (max-width: 800px) {
    display: block;
    & > * + * {
      margin-left: 0;
      margin-top: ${tokens.spacing.l};
    }
  }
`;

export const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: ${tokens.spacing.l};  
  };
`;

export const FlexColTight = styled.div`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: ${tokens.spacing.m};  
  };
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
    vertical-align: center;
  };
  & > thead > tr > th.right,
  & > thead > tr > td.right,
  & > tbody > tr > th.right,
  & > tbody > tr > td.right {
    text-align: right; 
  };
  & > thead > tr > th.center,
  & > thead > tr > td.center,
  & > tbody > tr > th.center,
  & > tbody > tr > td.center {
    text-align: center; 
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
    vertical-align: center;
  };
  & > thead > tr > th.right,
  & > thead > tr > td.right,
  & > tbody > tr > th.right,
  & > tbody > tr > td.right {
    text-align: right; 
  };
  & > thead > tr > th.center,
  & > thead > tr > td.center,
  & > tbody > tr > th.center,
  & > tbody > tr > td.center {
    text-align: center; 
  };
`;

export const TableStyleRow = styled.div`
  border-bottom: 1px solid ${tokens.colors.depthLight26};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  & > * {
    flex: 1;
    padding: ${tokens.spacing.s};
  } 
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${tokens.colors.highlightBase};
  cursor: pointer;
  font-family: ${tokens.values.typography.bodyText.fontFamily};
  font-size: ${tokens.values.typography.bodyText.fontSize.value}${tokens.values.typography.bodyText.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyText.fontWeight};
  line-height: ${tokens.values.typography.bodyText.lineHeight.value};
  padding: 0;
`;

export const LinkButtonSmall = styled.button`
  background: none;
  border: none;
  color: ${tokens.colors.highlightBase};
  cursor: pointer;
  font-family: ${tokens.values.typography.bodyTextSmall.fontFamily};
  font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyTextSmall.fontWeight};
  line-height: ${tokens.values.typography.bodyTextSmall.lineHeight.value};
  padding: 0;
`;
