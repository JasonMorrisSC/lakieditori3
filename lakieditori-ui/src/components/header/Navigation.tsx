import React, {useContext} from 'react';
import {useRouteMatch} from "react-router-dom";
import {suomifiDesignTokens as tokens} from 'suomifi-ui-components';
import {AuthenticationContext} from "../../App";
import {StyledNavigationLink} from "./HeaderStyles";

const Navigation: React.FC = () => {
  const [user] = useContext(AuthenticationContext);

  return (
      <nav>
        <ul style={{display: 'flex', listStyle: 'none'}}>
          <li>
            <NavigationLink to="/" label="Etusivu"/>
          </li>
          <li>
            <NavigationLink to="/documents" label="Lakiluonnokset"/>
          </li>
          <li>
            <NavigationLink to="/about" label="Ohjeet ja tuki"/>
          </li>
          {
            user.superuser &&
            <li>
              <NavigationLink to="/admin" label="Ylläpito"/>
            </li>
          }
        </ul>
      </nav>
  );
};

interface NavigationLinkProps {
  to: string;
  label: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({to, label}) => {
  let match = useRouteMatch({
    path: to,
    exact: to === '/'
  });

  return (
      <StyledNavigationLink to={to} style={{
        borderBottom: match ? `4px solid ${tokens.colors.highlightBase}` : `none`,
      }}>
        {label}
      </StyledNavigationLink>
  );
};

export default Navigation;
