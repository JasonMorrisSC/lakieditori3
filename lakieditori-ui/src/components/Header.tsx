import React from 'react';
import {suomifiDesignTokens as tokens} from 'suomifi-ui-components';

const Header: React.FC = () => {
  return (
      <header style={{
        color: tokens.colors.brandBase,
        fontSize: '28px',
        fontWeight: 600,
      }}>
        Lakieditori
      </header>
  );
};

export default Header;
