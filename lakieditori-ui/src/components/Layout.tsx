import React from "react";
import {Heading, suomifiDesignTokens as sdt} from "suomifi-ui-components";

const Layout: React.FC<Props> = (props) => {
  return (
      <div style={{
        backgroundColor: sdt.colors.depthLight30,
        borderBottom: `1px solid ${sdt.colors.depthLight13}`,
        display: 'flex',
        justifyContent: "center",
        padding: `${sdt.spacing.l} ${sdt.spacing.m}`,
      }}>
        <div style={{
          maxWidth: 1200,
          width: 1200,
        }}>
          <Heading.h1>
            {props.title}
          </Heading.h1>

          <main style={{
            backgroundColor: sdt.colors.whiteBase,
            border: `1px solid ${sdt.colors.depthLight13}`,
            margin: `${sdt.spacing.s} 0`,
            minHeight: 500,
            padding: sdt.spacing.l,
          }}>
            {props.children}
          </main>
        </div>
      </div>
  );
};

interface Props {
  title: string
}

export default Layout;
