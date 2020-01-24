import React from 'react';
import {Link, useRouteMatch} from "react-router-dom";
import {suomifiDesignTokens as sdt} from 'suomifi-ui-components';

const Navigation: React.FC = () => {
  return (
      <nav style={{
        background: `${sdt.colors.whiteBase}`,
        borderBottom: `1px solid ${sdt.colors.depthLight13}`,
        display: 'flex',
        justifyContent: 'center',
        padding: `0 ${sdt.spacing.m}`,
      }}>
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          maxWidth: 1200,
          margin: 0,
          padding: 0,
          width: 1200,
        }}>
          <li>
            <NavItem to="/" label="Etusivu"/>
          </li>
          <li>
            <NavItem to="/documents" label="Lakiluonnokset"/>
          </li>
          <li>
            <NavItem to="/about" label="Ohjeet ja tuki"/>
          </li>
        </ul>
      </nav>
  );
};

const NavItem: React.FC<NavItemProps> = ({to, label}: NavItemProps) => {
  let match = useRouteMatch({
    path: to,
    exact: to === '/'
  });

  return (
      <Link to={to} style={{
        color: sdt.colors.blackBase,
        borderBottom: match ? `4px solid ${sdt.colors.highlightBase}` : `none`,
        lineHeight: 2.5,
        padding: `${sdt.spacing.s} 0`,
        marginRight: sdt.spacing.l,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </Link>
  );
};

interface NavItemProps {
  to: string;
  label: string;
}

export default Navigation;
