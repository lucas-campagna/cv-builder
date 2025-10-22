import { Header } from './Header';
import { Section } from './Section';
import { AppContext } from '../App';
import { useContext } from 'react';

const Document = () => {
  const { header, sections } = useContext(AppContext);
  return (
    <div className="font-sans w-[210mm] h-[297mm] mx-auto p-3 bg-white shadow-lg text-gray-900 leading-relaxed">
      <Header {...header} />
      {sections.map((s, index) => <Section key={index} {...s} />)}
    </div>
  )
};

export default Document;
