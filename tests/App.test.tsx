import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import parse from "../src/core/parser";
// import {default as parse} from "../src/utils/parseDynamicComponents";

test("converts YAML to component without variables", () => {
  const yaml = `
box:
  from: div
  style: bg-red-100
  body: My Box
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(`<div class="bg-red-100">My Box</div>`);
});

test("converts YAML to component with variables", () => {
  const yaml = `
box:
  from: div
  style: bg-red-100
  body: $text
`;
  const components = parse(yaml);
  const { container } = render(components.box({ text: "Hello" }));
  expect(container.innerHTML).toBe(`<div class="bg-red-100">Hello</div>`);
});

test("converts YAML with component composition", () => {
  const yaml = `
box1:
  from: div
  style: bg-green-100
  body: $text

box:
  from: box1
  text: My Comp
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(`<div class="bg-green-100">My Comp</div>`);
});

test("converts YAML in inverse order with component composition", () => {
  const yaml = `
box:
  from: box1
  text: My Comp
box1:
  from: div
  style: bg-green-100
  body: $text
`;
  const components = parse(yaml);
  // Note: Current parser does not support composition; update to handle component references
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(`<div class="bg-green-100">My Comp</div>`);
});

test("testing deep inheritance", () => {
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
  const components = parse(yaml);
  const { container } = render(components.final({}));
  expect(container.innerHTML).toBe(`<div class="bg-green-100">123</div>`);
});

test("testing style inheritance", () => {
  const yaml = `
box2:
  from: box
  ss: width-[20px]

box:
  from: div
  style: $ss
  body: My Box
`;
  const components = parse(yaml);
  const { container } = render(components.box2({}));
  expect(container.innerHTML).toBe(`<div class="width-[20px]">My Box</div>`);
});

test("test both parameters", () => {
  const yaml = `
box2:
  from: box
  ss: width-[20px]

box:
  from: div
  style: $ss
  body: $ss
`;
  const components = parse(yaml);
  const { container } = render(components.box2({}));
  expect(container.innerHTML).toBe(
    `<div class="width-[20px]">width-[20px]</div>`,
  );
});

test("simple test without style", () => {
  const yaml = `
box:
  from: div
  body: My Comp
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(`<div>My Comp</div>`);
});

test("without style and body as array with null", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div></div>`,
  );
});

test("render list of children filter null", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div></div>`,
  );
});

test("render simple list of children", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div></div>`,
  );
});

test("render list of children with multiple values", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div>third child</div>`,
  );
});

test("render list of composable children", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div></div>`,
  );
});

test("render list of multiple composable children", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div></div>`,
  );
});

test("render list of multiple composable children with implicit from 1", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div></div>`,
  );
});

test("render list of multiple composable children with implicit from 2", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div></div>`,
  );
});

test("render composable children", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div></div>`,
  );
});

test("combine props", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({ s3: "height-3" }));
  expect(container.innerHTML).toBe(
    `<div class="bg-red-100 width-2 height-3" data-testid="target"></div>`,
  );
});

test("without style and implicit body as array", () => {
  const yaml = `
box:
  - from: div
    body: first child
  - from: div
    body: second child
  -
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div>first child</div><div>second child</div>`,
  );
});

test("handling null from field", () => {
  const yaml = `
box:
  from:
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(`<div></div>`);
});

test("multi level body with implicit from", () => {
  const yaml = `
box:
  style: bg-red-100 p-1
  body:
    style: bg-yellow-100 p-1
    body:
      style: bg-green-100 p-1 size-1
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div class="bg-red-100 p-1"><div class="bg-yellow-100 p-1"><div class="bg-green-100 p-1 size-1"></div></div></div>`,
  );
});

test("implicit from array", () => {
  const yaml = `
box:
  - style: bg-red-100 p-1
  - style: bg-yellow-100 p-1
  - style: bg-green-100 p-1 size-1
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div class="bg-red-100 p-1"></div><div class="bg-yellow-100 p-1"></div><div class="bg-green-100 p-1 size-1"></div>`,
  );
});

test("render list of multiple composable children with implicit from and no body", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="first">first child</div><div id="second">second child</div>`,
  );
});

test("optional props", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div class="bg-red-100"></div><div class="bg-blue-100"></div><div class="bg-red-100 bg-yellow-100"></div>`,
  );
});

test("template components with implicit from", () => {
  const yaml = `
$box:
  id: target
  style: $color p-1 $size
box:
  color: bg-green-100
  size: size-1
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div class="bg-green-100 p-1 size-1" id="target"></div>`,
  );
});

test("template components with body replacement and explicit from", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="target"><div>jesus</div><div>christ</div></div>`,
  );
});

test("template components with body replacement", () => {
  const yaml = `
$box:
  id: target
  body: $first $second
box:
  first: jesus
  second: christ
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(`<div id="target">jesus christ</div>`);
});

test("template components with body replacement and implicit from", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="target"><div class="bg-red-100">jesus</div><div class="bg-yellow-100">christ</div></div>`,
  );
});

test("template component with implicit from and list children", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div class="bg-red-100 p-1 "></div><div class="bg-yellow-100 p-1 "></div><div class=" p-1 h-2"></div><div class="bg-green-100 p-1 size-1"></div><div class=" p-1 ">-> test</div>`,
  );
});

test("template component with list implicit", () => {
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
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div class="flex justify-between"><div>CompanyA2024-2025</div></div><div class="flex justify-between"><div>CompanyB2023-2024</div></div>`,
  );
});

test("shortcut for component reference in body array", () => {
  const yaml = `
box:
  from: div
  id: parent
  body:
    - div: first child
    - div: second child
    - p: third child
    - h2: fourth child
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div><p>third child</p><h2>fourth child</h2></div>`,
  );
});

test("shortcut for component reference in body array with other properties", () => {
  const yaml = `
box:
  - div:
      body: unique child
      style: text-red-500
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div class="text-red-500">unique child</div>`,
  );
});

test("shortcut for component reference in body array with other properties with implicit body", () => {
  const yaml = `
box:
  - div: unique child
    style: text-red-500
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<div class="text-red-500">unique child</div>`,
  );
});

test("renders built-in HTML tags p, h2, span, and div with parameters and styles with implicit body", () => {
  const yaml = `
 box:
   from: div
   body:
     - p: $pContent
       style: text-red-500
     - h2: $h2Content
     - span: $spanContent
       style: font-bold
     - div: $divContent
       style: bg-blue-100 p-2
 `;
  const components = parse(yaml);
  const { container } = render(
    components.box({
      pContent: "Paragraph text",
      h2Content: "Heading text",
      spanContent: "Span text",
      divContent: "Div text",
    }),
  );
  expect(container.innerHTML).toBe(
    `<div><p class="text-red-500">Paragraph text</p><h2>Heading text</h2><span class="font-bold">Span text</span><div class="bg-blue-100 p-2">Div text</div></div>`,
  );
});

test("render array of elements", () => {
  const yaml = `
box1:
  from: ul
  body: $content
box:
  from: box1
  content:
    - from: li
      body: first child
    - from: li
      body: second child
    - from: li
      body: third child
`;
  const components = parse(yaml);
  const { container } = render(components.box({}));
  expect(container.innerHTML).toBe(
    `<ul><li>first child</li><li>second child</li><li>third child</li></ul>`,
  );
});

