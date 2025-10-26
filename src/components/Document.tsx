import { Header } from './Header';
import { Section } from './Section';
import { AppContext } from '../App';
import { useContext } from 'react';
import { A4 } from "@/constants";

const Document = () => {
  const { header, sections } = useContext(AppContext);
  return (
    <div className={"doc font-sans mx-auto p-3 bg-white shadow-lg text-gray-900 leading-relaxed"} style={A4}>
      <Header {...header} />
      {sections.map((s, index) => <Section key={index} {...s} />)}
    </div>
  )
};

export default Document;
