import React, {useState} from "react";
import Layout from "../components/Layout";

const TwoWayBindTest: React.FC = () => {
  const [data, setData] = useState({
    title: "root",
    note: "root note",
    child: {
      title: "child",
      note: "child note",
    },
    appendix: "hello"
  });

  return <Layout title="Testi">
    <ul>
      <li>root title: {data.title}</li>
      <li>root note: {data.note}</li>
      <ul>
        <li>child title: {data.child.title}</li>
        <li>child note: {data.child.note}</li>
      </ul>
      <li>appendix: {data.appendix}</li>
    </ul>

    <br/>
    <br/>

    <Root data={data} setData={setData}/>
  </Layout>;
};

const Root: React.FC<any> = ({data, setData}) => {
  function updateInput(e: any) {
    const newTitle = e.target.value;

    setData((prevData: any) => {
      return {
        ...prevData,
        title: newTitle,
      }
    });
  }

  return <div>
    <label>Root title is {data.title}</label>
    <br/>
    <input type="text" value={data.title} onChange={updateInput}/>
    <Leaf data={data.child} setData={setData}/>
  </div>;
};

const Leaf: React.FC<any> = ({data, setData}) => {
  function updateInput(e: any) {
    const newTitle = e.target.value;

    setData((prevData: any) => {
      return {
        ...prevData,
        child: {
          ...prevData.child,
          title: newTitle
        }
      }
    });
  }

  return <div>
    <label>Child title is {data.title}</label><br/>
    <input type="text" value={data.title} onChange={updateInput}/>
  </div>;
};

export default TwoWayBindTest;
