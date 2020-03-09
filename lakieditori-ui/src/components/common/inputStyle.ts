import {CSSProperties} from "react";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";

export const inputStyle: CSSProperties = {
  border: `1px solid ${sdt.colors.depthLight13}`,
  borderRadius: "2px",
  boxSizing: 'border-box',
  fontFamily: sdt.values.typography.bodyText.fontFamily,
  fontSize: sdt.values.typography.bodyText.fontSize.value,
  fontWeight: sdt.values.typography.bodyText.fontWeight,
  lineHeight: sdt.values.typography.bodyText.lineHeight.value,
  margin: `${sdt.spacing.xxs} 0`,
  padding: sdt.spacing.s,
  width: '100%',
};