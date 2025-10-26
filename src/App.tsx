import { createContext, useState } from 'react';
import Document from './components/Document';
import Development from './components/Development';
import type { THeader } from './components/Header';
import type { TSection } from './components/Section';

const sampleHeader: THeader = {
  name: 'John Doe',
  contacts: [
    { label: 'john@example.com', link: 'john@example.com' },
    { label: 'github.com/johndoe', link: 'https://github.com/johndoe' }
  ]
};

const sampleSections: TSection[] = [
  {
    title: 'Experience',
    upperLeft: 'Software Engineer',
    upperRight: '2020 - Present',
    lowerLeft: 'Tech Company',
    lowerRight: 'San Francisco, CA',
    summary: ['Developed web applications using React and TypeScript', 'Collaborated with cross-functional teams to deliver projects on time']
  },
  {
    title: 'Education',
    upperLeft: 'Bachelor of Science in Computer Science',
    upperRight: '2016 - 2020',
    lowerLeft: 'University of Example',
    lowerRight: 'GPA: 3.8',
    summary: "Desenvolvi eetc"
  }
];

type TStyle = { [key: string]: string };

export const AppContext = createContext({
  header: sampleHeader,
  sections: sampleSections,
  style: {},
  setHeader: (_: typeof sampleHeader) => { },
  setSections: (_: typeof sampleSections) => { },
  setStyle: (_: TStyle) => { },
})

const App = () => {
  const [header, setHeader] = useState<THeader>(sampleHeader);
  const [sections, setSections] = useState<TSection[]>(sampleSections);
  const [style, setStyle] = useState<TStyle>({});

  return (
    <div className="bg-gray-700/50 py-2">
      <AppContext.Provider value={{ header, sections, style, setHeader, setSections, setStyle }}>
        <Development />
        <Document />
      </AppContext.Provider>
    </div>
  );
};

export default App;
