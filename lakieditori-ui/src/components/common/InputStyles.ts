import styled from '@emotion/styled'
import {Button, suomifiDesignTokens as tokens} from "suomifi-ui-components";

export const Input = styled.input`
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

export const InputNumber = styled(Input)`
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

export const ButtonInverted = styled(Button)`
  background: none;
  color: ${tokens.colors.whiteBase} !important;
  border: 1px solid ${tokens.colors.whiteBase} !important;
  & > svg {
    fill: ${tokens.colors.whiteBase};
  }
`;

interface ButtonLinkProps {
  active?: boolean
}

export const ButtonLink = styled.button<ButtonLinkProps>`
  background: none;
  border: none;
  color: ${(props: ButtonLinkProps) => props.active ? tokens.colors.blackBase : tokens.colors.highlightBase};
  cursor: pointer;
  font-family: ${tokens.values.typography.bodyText.fontFamily};
  font-size: ${tokens.values.typography.bodyText.fontSize.value}${tokens.values.typography.bodyText.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyText.fontWeight};
  line-height: ${tokens.values.typography.bodyText.lineHeight.value};
  padding: 0;
`;

export const ButtonLinkSmall = styled(ButtonLink)`
  font-family: ${tokens.values.typography.bodyTextSmall.fontFamily};
  font-size: ${tokens.values.typography.bodyTextSmall.fontSize.value}${tokens.values.typography.bodyTextSmall.fontSize.unit};
  font-weight: ${tokens.values.typography.bodyTextSmall.fontWeight};
  line-height: ${tokens.values.typography.bodyTextSmall.lineHeight.value};
`;

export const ButtonIconOnly = styled(Button.secondaryNoborder)`
  & > svg {
    margin: 0 !important;
  };
  @media (max-width: 800px) {
    padding: ${tokens.spacing.s};
  };
`;
