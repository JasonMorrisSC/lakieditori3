import React from 'react';
import {suomifiDesignTokens as sdt} from 'suomifi-ui-components';

const Header: React.FC = () => {
  return (
      <header style={{
        borderTop: `4px solid ${sdt.colors.brandBase}`,
        borderBottom: `1px solid ${sdt.colors.depthLight13}`,
        background: sdt.colors.whiteBase,
        display: 'flex',
        justifyContent: 'center',
        padding: sdt.spacing.m,
      }}>
        <div style={{
          color: sdt.colors.brandBase,
          fontSize: '28px',
          fontWeight: 600,
          maxWidth: 1200,
          width: 1200,
        }}>
          Lakieditori
        </div>
      </header>
  );
};

export default Header;
