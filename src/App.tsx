import { Document } from './components/Document';
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
    bottomLeft: 'Tech Company',
    bottomRight: 'San Francisco, CA',
    summary: ['Developed web applications using React and TypeScript', 'Collaborated with cross-functional teams to deliver projects on time']
  },
  {
    title: 'Education',
    upperLeft: 'Bachelor of Science in Computer Science',
    upperRight: '2016 - 2020',
    bottomLeft: 'University of Example',
    bottomRight: 'GPA: 3.8'
  }
];

const App = () => {
  const header = sampleHeader;
  const sections = sampleSections;
  return (
    <Document header={header} sections={sections} />
  );
};

export default App;
