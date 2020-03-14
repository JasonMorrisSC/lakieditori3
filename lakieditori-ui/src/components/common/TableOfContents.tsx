import React from "react";
import {HashLink as Link} from 'react-router-hash-link';
import {suomifiDesignTokens as tokens, Text} from "suomifi-ui-components";
import NavigationTreeNode from "./NavigationTreeNode";

const TableOfContents: React.FC<Props> = ({title, items}) => {
  return (
      <nav>
        <div style={{padding: `${tokens.spacing.m} 0 ${tokens.spacing.s}`}}>
          <Text.bold>{title}</Text.bold>
        </div>

        <ul style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}>
          {items.map((v, i) => {
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

const SideNavItem: React.FC<NavigationTreeNode> = ({to, label}) => {
  return (
      <Link to={to} style={{
        alignItems: 'center',
        color: tokens.colors.highlightBase,
        display: 'flex',
        fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
        padding: `${tokens.spacing.xs} 0`,
        textDecoration: 'none',
        textTransform: 'uppercase'
      }}>
        {label}
      </Link>
  );
};

const SideNavSecondLevelItem: React.FC<NavigationTreeNode> = ({to, label}) => {
  return (
      <Link to={to} style={{
        alignItems: 'center',
        color: tokens.colors.highlightBase,
        display: 'flex',
        fontSize: tokens.values.typography.bodyTextSmall.fontSize.value,
        padding: `${tokens.spacing.xs} ${tokens.spacing.xs} ${tokens.spacing.xs} ${tokens.spacing.l}`,
        textDecoration: 'none'
      }}>
        {label}
      </Link>
  );
};

interface Props {
  title: string,
  items: NavigationTreeNode[]
}

export default TableOfContents;
