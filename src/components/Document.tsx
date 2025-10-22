import { Header } from './Header';
import { Section } from './Section';
import type { THeader } from './Header';
import type { TSection } from './Section';

type TDocument = {
  header: THeader;
  sections: TSection[];
}

const Document = ({header, sections = []}: TDocument) => (
  <div className="font-sans w-[210mm] h-[297mm] mx-auto p-3 bg-white shadow-lg text-gray-900 leading-relaxed">
    <Header {...header}/>
    {sections.map((s, index) => <Section key={index} {...s}/>)}
  </div>
);

export { Document };
export type { TDocument };