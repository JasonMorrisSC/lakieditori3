import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-ui-components";

const LayoutWithRightBar: React.FC<Props> = (props) => {
  return (
      <div>
        <div style={{margin: `${sdt.spacing.l} 0 ${sdt.spacing.s}`}}>
          {props.topContent}
        </div>

        <div style={{
          backgroundColor: sdt.colors.whiteBase,
          border: `1px solid ${sdt.colors.depthLight13}`,
          display: `flex`,
          margin: `${sdt.spacing.s} 0`,
          minHeight: 600,
        }}>
          <main style={{
            flex: props.rhsContent ? 5 : 1,
          }}>
            {props.children}
          </main>

          {props.rhsContent ?
              <div style={{
                backgroundColor: sdt.colors.highlightLight53,
                flex: 2
              }}>
                {props.rhsContent}
              </div> : <></>}
        </div>
      </div>
  );
};

interface Props {
  topContent?: any,
  rhsContent?: any,
}

export default LayoutWithRightBar;