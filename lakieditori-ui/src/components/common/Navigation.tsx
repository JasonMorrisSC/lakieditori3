import React, {useContext} from 'react';
import {Link, useRouteMatch} from "react-router-dom";
import {suomifiDesignTokens as tokens} from 'suomifi-ui-components';
import {AuthenticationContext} from "../../App";

const Navigation: React.FC = () => {
  const [user] = useContext(AuthenticationContext);

  return (
      <nav>
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}>
          <li>
            <NavigationLink to="/" label="Etusivu"/>
          </li>
          <li>
            <NavigationLink to="/documents" label="Lakiluonnokset"/>
          </li>
          <li>
            <NavigationLink to="/about" label="Ohjeet ja tuki"/>
          </li>
          {user.superuser ?
              <li>
                <NavigationLink to="/admin" label="Ylläpito"/>
              </li>
              : ''}
        </ul>
      </nav>
  );
};

const NavigationLink: React.FC<Props> = ({to, label}) => {
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

interface Props {
  to: string;
  label: string;
}

export default Navigation;
