import React from "react";
import {Heading, suomifiDesignTokens as tokens} from "suomifi-ui-components";
import {MainWithBorders} from "./CommonComponents";

const Layout: React.FC<Props> = (props) => {
  return (
      <div>
        <Heading.h1 style={{margin: `${tokens.spacing.l} 0 ${tokens.spacing.s}`}}>
          {props.title}
        </Heading.h1>
        <MainWithBorders>
          {props.children}
        </MainWithBorders>
      </div>
  );
};

interface Props {
  title: string
}

export default Layout;
