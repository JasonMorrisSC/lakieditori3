import React from "react";
import {HashLink as Link} from 'react-router-hash-link';
import {suomifiDesignTokens as sdt, Text} from "suomifi-ui-components";
import NavItemProps from "./NavItemProps";

const Toc: React.FC<Props> = (props) => {
  return (
      <nav>
        <div
            style={{padding: `${sdt.spacing.m} ${sdt.spacing.xs} ${sdt.spacing.s} ${sdt.spacing.xs}`}}>
          <Text.bold>{props.tocTitle}</Text.bold>
        </div>

        <ul style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}>
          {props.tocItems.map((v, i) => {
            return <li key={i}>
              <SideNavItem to={v.to} label={v.label}/>
              <ul style={{
                margin: 0,
                paddingLeft: 0,
                listStyle: 'none',
              }}>
                {(v.children || []).map((c, j) => {
                  return <li key={i + "" + j}>
                    <SideNavSecondLevelItem to={c.to} label={c.label}/>
                  </li>
                })}
              </ul>
            </li>
          })}
        </ul>
      </nav>
  );
};

const SideNavItem: React.FC<NavItemProps> = ({to, label}: NavItemProps) => {
  return (
      <Link to={to} style={{
        alignItems: 'center',
        color: sdt.colors.highlightBase,
        display: 'flex',
        fontSize: sdt.values.typography.bodyTextSmall.fontSize.value,
        padding: sdt.spacing.xs,
        textDecoration: 'none',
        textTransform: 'uppercase'
      }}>
        {label}
      </Link>
  );
};

const SideNavSecondLevelItem: React.FC<NavItemProps> = ({to, label}: NavItemProps) => {
  return (
      <Link to={to} style={{
        alignItems: 'center',
        color: sdt.colors.highlightBase,
        display: 'flex',
        fontSize: sdt.values.typography.bodyTextSmall.fontSize.value,
        padding: `${sdt.spacing.xs} ${sdt.spacing.xs} ${sdt.spacing.xs} ${sdt.spacing.l}`,
        textDecoration: 'none'
      }}>
        {label}
      </Link>
  );
};

interface Props {
  tocTitle: string,
  tocItems: NavItemProps[]
}

export default Toc;
