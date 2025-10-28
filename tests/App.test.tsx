import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import parseDynamicComponent from '../src/utils/parseDynamicComponents';

test('renders App without crashing', () => {
  render(<App />);
  // Check for the document container
  expect(document.querySelector('.doc')).toBeInTheDocument();
});

test('converts YAML to component without variables', () => {
  const yaml = `
box:
  from: div
  style: bg-red-100
  body: My Box
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
  expect(screen.getByText('My Box')).toBeInTheDocument();
  expect(screen.getByText('My Box')).toHaveClass('bg-red-100');
});

test('converts YAML to component with variables', () => {
  const yaml = `
box:
  from: div
  style: bg-red-100
  body: $text
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({ text: 'Hello' }));
  expect(screen.getByText('Hello')).toBeInTheDocument();
  expect(screen.getByText('Hello')).toHaveClass('bg-red-100');
});

test('converts YAML with component composition', () => {
  const yaml = `
my_comp:
  from: box
  text: My Comp

box:
  from: div
  style: bg-green-100
  body: $text
`;
  const components = parseDynamicComponent(yaml);
  // Note: Current parser does not support composition; update to handle component references
  render(components.my_comp({}));
  expect(screen.getByText('My Comp')).toBeInTheDocument();
  expect(screen.getByText('My Comp')).toHaveClass('bg-green-100');
});


test('testing deep inheritance', () => {
  const yaml = `
final:
  from: any_name
  prop: 123

any_name:
  from: box2
  a: $prop

box2:
  from: box
  text: $a

box:
  from: div
  style: bg-green-100
  body: $text
`;
  const components = parseDynamicComponent(yaml);
  render(components.final({}));
  expect(screen.getByText('123')).toBeInTheDocument();
  expect(screen.getByText('123')).toHaveClass('bg-green-100');
});


test('testing style ineritance', () => {
  const yaml = `
box2:
  from: box
  ss: width-[20px]

box:
  from: div
  style: $ss
  body: My Box
`;
  const components = parseDynamicComponent(yaml);
  render(components.box2({}));
  expect(screen.getByText('My Box')).toBeInTheDocument();
  expect(screen.getByText('My Box')).toHaveClass('width-[20px]');
});

test('test both parameters', () => {
  const yaml = `
box2:
  from: box
  ss: width-[20px]

box:
  from: div
  style: $ss
  body: $ss
`;
  const components = parseDynamicComponent(yaml);
  render(components.box2({}));
  expect(screen.getByText('width-[20px]')).toBeInTheDocument();
  expect(screen.getByText('width-[20px]')).toHaveClass('width-[20px]');
})


test('without style', () => {
  const yaml = `
box:
  from: div
  body: My Comp
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
  expect(screen.getByText('My Comp')).toBeInTheDocument();
})

test('without style and body', () => {
  const yaml = `
box:
  from: div
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelector('div')).toBeInTheDocument();
})


test('render list of children', () => {
  const yaml = `
box:
  from: div
  id: parent
  body:
    - from: div
      body: first child
    - from: div
      body: second child
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
  expect(screen.getByText('first child')).toBeInTheDocument();
  expect(screen.getByText('second child')).toBeInTheDocument();
  expect(screen.getByText('first child').parentElement?.id).toBe('parent');
  expect(screen.getByText('second child').parentElement?.id).toBe('parent');
})

test('render list of children with multiple values', () => {
  const yaml = `
box:
  from: div
  id: parent
  body:
    - from: div
      body: first child
    - from: div
      body: second child
    - third child
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
  expect(screen.getByText('first child')).toBeInTheDocument();
  expect(screen.getByText('second child')).toBeInTheDocument();
  expect(screen.getByText('third child')).toBeInTheDocument();
  expect(screen.getByText('first child').parentElement?.id).toBe('parent');
  expect(screen.getByText('second child').parentElement?.id).toBe('parent');
  expect(screen.getByText('third child')?.id).toBe('parent');
})

test('render list of composable children', () => {
  const yaml = `
box2:
  from: div
  body: $text
box:
  from: div
  id: parent
  body:
    - from: box2
      text: first child
    - from: box2
      text: second child
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
  expect(screen.getByText('first child')).toBeInTheDocument();
  expect(screen.getByText('second child')).toBeInTheDocument();
  expect(screen.getByText('first child').parentElement?.id).toBe('parent');
  expect(screen.getByText('second child').parentElement?.id).toBe('parent');
})


test('render list of multiple composable children', () => {
  const yaml = `
box1:
  from: div
  body: $value
box2:
  from: div
  body: $text
box:
  from: div
  id: parent
  body:
    - from: box1
      value: first child
    - from: box2
      text: second child
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
  expect(screen.getByText('first child')).toBeInTheDocument();
  expect(screen.getByText('second child')).toBeInTheDocument();
  expect(screen.getByText('first child').parentElement?.id).toBe('parent');
  expect(screen.getByText('second child').parentElement?.id).toBe('parent');
})


test('render composable children', () => {
  const yaml = `
box1:
  from: div
  body: $value
box:
  from: div
  id: parent
  body:
    from: box1
    value: first child
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
  expect(screen.getByText('first child')).toBeInTheDocument();
  expect(screen.getByText('first child').parentElement?.id).toBe('parent');
})


test('combine props', () => {
  const yaml = `
box1:
  from: div
  data-testid: target
  style: $s1 $s2 $s3
box:
  from: box1
  s1: bg-red-100
  s2: width-2
  s3: $s3
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({ s3: 'height-3' }));
  expect(screen.getByTestId('target')).toHaveClass('bg-red-100 width-2 height-3');
})
