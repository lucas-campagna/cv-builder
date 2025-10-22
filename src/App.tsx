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

export const AppContext = createContext({
  header: sampleHeader,
  sections: sampleSections
})

const App = () => {
  const [header, setHeader] = useState<THeader>(sampleHeader);
  const [sections, setSections] = useState<TSection[]>(sampleSections);

  function handleChangeContent() { }
  function handleChangeStyle() { }

  return (
    <AppContext.Provider value={{ header, sections }}>
      <Development onChangeContent={handleChangeContent} onChangeStyle={handleChangeStyle} />
      <Document />
    </AppContext.Provider>
  );
};

export default App;
