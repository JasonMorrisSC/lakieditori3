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

export const Container = styled.div`
  margin: 0 auto;
  padding-left: ${tokens.spacing.m};
  padding-right: ${tokens.spacing.m};
  max-width: 1560px;
  @media (max-width: 800px) {
    padding-left: ${tokens.spacing.s};
    padding-right: ${tokens.spacing.s};
  }
`;

export const MainWithBorders = styled.main`
  ${panelWithBorderCss};
  min-height: 400px;
`;

export const Panel = styled.div`
  background-color: ${tokens.colors.whiteBase};
  border: 1px solid ${tokens.colors.depthLight13};
  padding: ${tokens.spacing.l};
  @media (max-width: 800px) {
    padding: ${tokens.spacing.s};
  }
`;

export const PageHeading = styled(Heading.h1)`
  margin: ${tokens.spacing.l} 0 ${tokens.spacing.s} 0;
`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
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

export const FlexRowPlain = styled.div`
  display: flex;
  justify-content: space-between;
  & > * {
    flex: 1;
  }
`;

export const FlexRowTight = styled.div`
  display: flex;
  justify-content: space-between;
  & > * {
    flex: 1;
  }
  & > * + * {
    margin-left: ${tokens.spacing.m};  
  };
  @media (max-width: 800px) {
    display: block;
    & > * + * {
      margin-left: 0;
      margin-top: ${tokens.spacing.m};
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
