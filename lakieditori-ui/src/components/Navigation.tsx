import React from 'react';
import {Link, useRouteMatch} from "react-router-dom";
import {suomifiDesignTokens as tokens} from 'suomifi-ui-components';

const Navigation: React.FC = () => {
  return (
      <nav>
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
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
        color: tokens.colors.blackBase,
        borderBottom: match ? `4px solid ${tokens.colors.highlightBase}` : `none`,
        lineHeight: 2.5,
        padding: `${tokens.spacing.s} 0`,
        marginRight: tokens.spacing.l,
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
