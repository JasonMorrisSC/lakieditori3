import styled from '@emotion/styled'
import {css} from "@emotion/core";
import {Button, suomifiDesignTokens as tokens} from "suomifi-ui-components";

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
  max-width: 100%;
  width: 100%;
`;

export const Input = styled.input`
  ${inputCss}
`;

export const InputNumber = styled.input`
  ${inputCss}
  width: 3em;
  text-align: right;
  border: 1px solid ${tokens.colors.depthLight26};
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

InputNumber.defaultProps = {type: 'number'};

export const InputRadio = styled.input`
  font-family: ${tokens.values.typography.bodyText.fontFamily};
  font-size: ${tokens.values.typography.bodyText.fontSize.value}${tokens.values.typography.bodyText.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyText.fontWeight};
  line-height: ${tokens.values.typography.bodyText.lineHeight.value};
`;

InputRadio.defaultProps = {type: 'radio'};

export const TextArea = styled.textarea`
  ${inputCss}
`;

export const ButtonLink = styled.button`
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

export const ButtonLinkSmall = styled.button`
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

export const ButtonSecondaryDark = styled(Button.secondary)`
  color: ${tokens.colors.blackBase} !important;
  border: 1px solid ${tokens.colors.depthLight13} !important;
  & > svg {
    fill: ${tokens.colors.depthDark27};
  }
`;

export const ButtonSecondaryDarkNoBorder = styled(Button.secondaryNoborder)`
  color: ${tokens.colors.blackBase} !important;
  background: none !important;
  & > svg {
    fill: ${tokens.colors.depthDark27};
  }
`;

export const ButtonIconOnly = styled(Button.secondaryNoborder)`
  & > svg {
    margin: 0 !important;
  };
  @media (max-width: 800px) {
    padding: ${tokens.spacing.s};
  };
`;
