import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import parseDynamicComponent from '../src/utils/parseDynamicComponents';

test('renders App without crashing', () => {
  const { container } = render(<App />);
  // Check for the document container
  expect(container.querySelector('.doc')).toBeInTheDocument();
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

test('converts YAML with component composition inverse order', () => {
  const yaml = `
box:
  from: div
  style: bg-green-100
  body: $text

my_comp:
  from: box
  text: My Comp
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
  id: parent
  body:
    - from: div
      body: first child
    - from: div
      body: second child
    -
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelector('div')).toBeInTheDocument();
  expect(container.querySelector('#parent')?.children.length).toBe(2);
})

test('render list of children filter null', () => {
  const yaml = `
box:
  from: div
  id: parent
  body:
    - from: div
      body: first child
    - from: div
      body: second child
    -
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(screen.getByText('first child')).toBeInTheDocument();
  expect(screen.getByText('second child')).toBeInTheDocument();
  expect(screen.getByText('first child').parentElement?.id).toBe('parent');
  expect(screen.getByText('second child').parentElement?.id).toBe('parent');
  expect(container.querySelector('#parent')?.children.length).toBe(2);
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
  expect(screen.getByText('third child').parentElement?.id).toBe('parent');
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

test('render list of multiple composable children with implicit from', () => {
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
    - box1:
        value: first child
    - box2:
        text: second child
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
  expect(screen.getByText('first child')).toBeInTheDocument();
  expect(screen.getByText('second child')).toBeInTheDocument();
  expect(screen.getByText('first child').parentElement?.id).toBe('parent');
  expect(screen.getByText('second child').parentElement?.id).toBe('parent');
})

test('render list of multiple composable children with implicit from', () => {
  const yaml = `
box1:
  from: div
  body: first child
box2:
  from: div
  body: second child
box:
  from: div
  id: parent
  body:
    - box1
    - box2
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


test('without style and body', () => {
  const yaml = `
box:
  - from: div
    body: first child
  - from: div
    body: second child
  -
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelector('div')).toBeInTheDocument();
  expect(screen.getByText('first child')?.parentElement?.children?.length)?.toBe(2);
})

test('handling null from field', () => {
  const yaml = `
box:
  from:
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
})

test('multi level body with implicit from', () => {
  const yaml = `
box:
  style: bg-red-100 p-1
  body:
    style: bg-yellow-100 p-1
    body:
      style: bg-green-100 p-1 size-1
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelectorAll('div')).toHaveLength(3);
  expect(container.querySelector('.bg-red-100')).toHaveClass('bg-red-100 p-1');
  expect(container.querySelector('.bg-yellow-100')).toHaveClass('bg-yellow-100 p-1');
  expect(container.querySelector('.bg-green-100')).toHaveClass('bg-green-100 p-1 size-1');
})

test('implicit from array', () => {
  const yaml = `
box:
  - style: bg-red-100 p-1
  - style: bg-yellow-100 p-1
  - style: bg-green-100 p-1 size-1
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelectorAll('div')).toHaveLength(3);
  expect(container.querySelector('.bg-red-100')).toHaveClass('bg-red-100 p-1');
  expect(container.querySelector('.bg-yellow-100')).toHaveClass('bg-yellow-100 p-1');
  expect(container.querySelector('.bg-green-100')).toHaveClass('bg-green-100 p-1 size-1');
})

test('render list of multiple composable children with implicit from and no body', () => {
  const yaml = `
box1:
  from: div
  id: first
  body: first child
box2:
  from: div
  id: second
  body: second child
box:
  - box1
  - box2
`;
  const components = parseDynamicComponent(yaml);
  render(components.box({}));
  expect(screen.getByText('first child')).toBeInTheDocument();
  expect(screen.getByText('second child')).toBeInTheDocument();
  expect(screen.getByText('first child')?.id).toBe('first');
  expect(screen.getByText('second child')?.id).toBe('second');
})

test('optional props', () => {
  const yaml = `
box1:
  style: $a $b
box:
  - from: box1
    a: bg-red-100
  - from: box1
    b: bg-blue-100
  - from: box1
    a: bg-red-100
    b: bg-yellow-100
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelectorAll('div')).toHaveLength(3);
  const divs = container.querySelectorAll('div');
  expect(divs[0]).toHaveClass('bg-red-100');
  expect(divs[1]).toHaveClass('bg-blue-100');
  expect(divs[2]).toHaveClass('bg-red-100 bg-yellow-100');
})

test('template components with implicit from', () => {
  const yaml = `
$box:
  id: target
  style: $color p-1 $size
box:
  color: bg-green-100
  size: size-1
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelector('#target')).toHaveClass('bg-green-100 p-1 size-1');
})

test('template components with body replacement and explicit from', () => {
  const yaml = `
$box:
  id: target
  body:
    - from: div
      body: $first
    - from: div
      body: $second
box:
  first: jesus
  second: christ
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelector('#target')).toBeInTheDocument();
  const children = container.querySelector('#target')?.children;
  expect(children).toHaveLength(2);
  expect(children?.[0]).toHaveTextContent('jesus');
  expect(children?.[1]).toHaveTextContent('christ');
})

test('template components with body replacement', () => {
  const yaml = `
$box:
  id: target
  body: $first $second
box:
  first: jesus
  second: christ
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelector('#target')).toBeInTheDocument();
  expect(container.querySelector('#target')).toHaveTextContent('jesus christ');
})

test('template components with body replacement and implicit from', () => {
  const yaml = `
jesus:
  style: bg-red-100
  body: jesus
christ:
  style: bg-yellow-100
  body: christ
$box:
  id: target
  body:
    - $first
    - $second
box:
  first: jesus
  second: christ
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  expect(container.querySelector('#target')).toBeInTheDocument();
  const children = container.querySelector('#target')?.children;
  expect(children).toHaveLength(2);
  expect(children?.[0]).toHaveTextContent('jesus');
  expect(children?.[0]).toHaveClass('bg-red-100');
  expect(children?.[1]).toHaveTextContent('christ');
  expect(children?.[1]).toHaveClass('bg-yellow-100');
})


test('template component with implicit from and list children', () => {
  const yaml = `
$box:
  style: $color p-1 $size
  body: "-> $text"
box:
  - color: bg-red-100
  - color: bg-yellow-100
  - size: h-2
  - color: bg-green-100
    size: size-1
  - text: test
`;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  const divs = container.querySelectorAll('div');
  expect(divs[0]).toHaveClass('bg-red-100 p-1');
  expect(divs[1]).toHaveClass('bg-yellow-100 p-1');
  expect(divs[2]).toHaveClass('p-1 h-2');
  expect(divs[3]).toHaveClass('bg-green-100 p-1 size-1');
  expect(divs[4]).toHaveTextContent('-> test');
})

test('template component with list implicit', () => {
  const yaml = `
$box:
  from: div
  style: flex justify-between
  body:
   - $prop1
   - $prop2

box:
  - prop1: CompanyA
    prop2: 2024-2025
  - prop1: CompanyB
    prop2: 2023-2024
 `;
  const components = parseDynamicComponent(yaml);
  const { container } = render(components.box({}));
  const flexDivs = container.querySelectorAll('.flex.justify-between');
  expect(flexDivs).toHaveLength(2);
  expect(flexDivs[0]).toHaveTextContent('CompanyA2024-2025');
  expect(flexDivs[1]).toHaveTextContent('CompanyB2023-2024');
  expect(flexDivs[0].children).toHaveLength(2);
  expect(flexDivs[1].children).toHaveLength(2);
  // Check individual children
  expect(flexDivs[0].children[0]).toHaveTextContent('CompanyA');
  expect(flexDivs[0].children[1]).toHaveTextContent('2024-2025');
  expect(flexDivs[1].children[0]).toHaveTextContent('CompanyB');
  expect(flexDivs[1].children[1]).toHaveTextContent('2023-2024');
  // Check no extra props on parent
  expect(flexDivs[0]).not.toHaveAttribute('prop1');
  expect(flexDivs[0]).not.toHaveAttribute('prop2');
  expect(flexDivs[1]).not.toHaveAttribute('prop1');
  expect(flexDivs[1]).not.toHaveAttribute('prop2');
})
