import React from "react";
import {suomifiDesignTokens as sdt} from "suomifi-design-tokens";
import {Heading} from "suomifi-ui-components";

const LayoutTest: React.FC = () => {

  return <ExampleLayout title="Testi">
    <div className='row'>
      <div className='column'>
        <div className='blue-column'>
          Some Text in Column One
        </div>
      </div>
      <div className='column'>
        <div className='green-column'>
          Some Text in Column Two
        </div>
      </div>
      <div className='column'>
        <div className='orange-column'>
          Some Text in Column Two
        </div>
      </div>
    </div>
    <div className='row'>
      <div className='column'>
        <div className='blue-column'>
          Some Text in Column One
        </div>
      </div>
      <div className='column'>
        <div className='green-column'>
          Some Text in Column Two
        </div>
      </div>
      <div className='column'>
        <div className='orange-column'>
          Some Text in Column Two
        </div>
      </div>
    </div>
  </ExampleLayout>;
};

const ExampleLayout: React.FC<Props> = (props) => {
  return (
      <div style={{
        backgroundColor: sdt.colors.depthLight30,
        borderBottom: `1px solid ${sdt.colors.depthLight13}`,
        display: "flex",
        justifyContent: "center",
        padding: `${sdt.spacing.s} ${sdt.spacing.m}`,
      }}>
        <div style={{
          maxWidth: 1200,
          width: 1200,
        }}>
          <div style={{
            backgroundColor: sdt.colors.accentBase,
            marginBottom: sdt.spacing.m,
          }}>
            hei
          </div>

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

export default LayoutTest;
