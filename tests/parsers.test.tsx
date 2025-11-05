import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import renderComponent from "../src/core/parsers/renderer";
import parseYaml from "../src/core/parsers/yamlParser";
import { normalize } from "../src/core/parsers/normalizer";
import buildComponent from "../src/core/parsers/componentBuilder";
import buildDocument from "../src/core/parsers/documentBuilder";

test("simple component parser", () => {
  const component = renderComponent({
    from: "div",
    style: "bg-red-100",
    body: "My Box",
  });
  const { container } = render(component);
  expect(container.innerHTML).toBe(`<div class="bg-red-100">My Box</div>`);
});

test("simple component parser with variables", () => {
  const box = {
    from: "div",
    style: "bg-red-100",
    body: "$text",
  };
  const parsedBox = buildComponent("box", { box });
  expect(parsedBox({ text: "Hello" })).toEqual({
    from: "div",
    style: "bg-red-100",
    body: "Hello",
  });
});

test("converts YAML with component composition", () => {
  const box1 = {
    from: "div",
    style: "bg-blue-100 p-2",
    body: "$text",
  };
  const box = {
    from: "box1",
    text: "My Comp",
  };
  const components = { box1, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    from: "div",
    style: "bg-blue-100 p-2",
    body: "My Comp",
  });
});

test("testing deep inheritance", () => {
  const final = {
    from: "any_name",
    prop: 123,
  };
  const any_name = {
    from: "box2",
    a: "$prop",
  };
  const box2 = {
    from: "box",
    text: "$a",
  };

  const box = {
    from: "div",
    style: "bg-green-100",
    body: "$text",
  };
  const components = { box, box2, any_name, final };
  const boxParsed = buildComponent("final", components);
  expect(boxParsed()).toEqual({
    from: "div",
    style: "bg-green-100",
    body: 123,
  });
});

test("testing style inheritance", () => {
  const box = {
    from: "box1",
    ss: "width-[20px]",
  };
  const box1 = {
    from: "div",
    style: "$ss",
    body: "My Box",
  };
  const components = { box1, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    from: "div",
    style: "width-[20px]",
    body: "My Box",
  });
});

test("test both parameters", () => {
  const box = {
    from: "box1",
    ss: "width-[20px]",
  };
  const box1 = {
    from: "div",
    style: "$ss",
    body: "$ss",
  };
  const components = { box1, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    from: "div",
    style: "width-[20px]",
    body: "width-[20px]",
  });
});

test("simple test without style", () => {
  const box = {
    from: "div",
    body: "My Comp",
  };
  const boxParsed = buildComponent("box", { box });
  expect(boxParsed()).toEqual({
    from: "div",
    body: "My Comp",
  });
});

test("without style and body as array with null", () => {
  const box = {
    from: "div",
    id: "parent",
    body: [
      {
        from: "div",
        body: "first child",
      },
      {
        from: "div",
        body: "second child",
      },
      null,
    ],
  };
  const boxParsed = buildDocument({ box }, "box");
  const { container } = render(boxParsed());
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div></div>`
  );
});

test("render list of children with multiple values", () => {
  const box = {
    from: "div",
    id: "parent",
    body: [
      {
        from: "div",
        body: "first child",
      },
      {
        from: "div",
        body: "second child",
      },
      "third child",
    ],
  };
  const boxParsed = buildDocument({ box }, "box");
  const { container } = render(boxParsed());
  expect(container.innerHTML).toBe(
    `<div id="parent"><div>first child</div><div>second child</div>third child</div>`
  );
});

test("render list of composable children", () => {
  const box1 = {
    from: "div",
    body: "$text",
  };
  const box = {
    from: "div",
    id: "parent",
    body: [
      {
        from: "box1",
        text: "first child",
      },
      {
        from: "box1",
        text: "second child",
      },
      "third child",
    ],
  };
  const components = { box1, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    from: "div",
    id: "parent",
    body: [
      {
        from: "div",
        body: "first child",
      },
      {
        from: "div",
        body: "second child",
      },
      { body: "third child" },
    ],
  });
});

test("render list of multiple composable children", () => {
  const box1 = {
    from: "div",
    body: "$text",
  };
  const box2 = {
    from: "div",
    body: "$value",
  };
  const box = {
    from: "div",
    id: "parent",
    body: [
      {
        from: "box1",
        text: "first child",
      },
      {
        from: "box2",
        value: "second child",
      },
      "third child",
    ],
  };
  const components = { box1, box2, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    from: "div",
    id: "parent",
    body: [
      {
        from: "div",
        body: "first child",
      },
      {
        from: "div",
        body: "second child",
      },
      { body: "third child" },
    ],
  });
});

test("render list of multiple composable children with implicit from 2", () => {
  const box1 = {
    from: "div",
    body: "first child",
  };
  const box2 = {
    from: "div",
    body: "second child",
  };
  const box = {
    from: "div",
    id: "parent",
    body: ["box1", "box2"],
  };
  const components = { box1, box2, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    from: "div",
    id: "parent",
    body: [
      {
        from: "div",
        body: "first child",
      },
      {
        from: "div",
        body: "second child",
      },
    ],
  });
});

test("render composable children", () => {
  const box1 = {
    from: "div",
    body: "$value",
  };
  const box = {
    from: "div",
    id: "parent",
    body: {
      from: "box1",
      value: "first child",
    },
  };
  const components = { box1, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    from: "div",
    id: "parent",
    body: {
      from: "div",
      body: "first child",
    },
  });
});

test("combine props", () => {
  const box1 = {
    from: "div",
    style: "$s1 $s2 $s3",
  };
  const box = {
    from: "box1",
    s1: "bg-red-100",
    s2: "width-2",
    s3: "$s3",
  };
  const components = { box1, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed({ s3: "height-3" })).toEqual({
    from: "div",
    style: "bg-red-100 width-2 height-3",
  });
});

test("without style and implicit body as array", () => {
  const box = normalize([
    {
      from: "div",
      body: "first child",
    },
    {
      from: "div",
      body: "second child",
    },
  ]);
  const components = { box };
  const parsedBox = buildComponent("box", components);
  expect(parsedBox()).toEqual({
    body: [
      {
        from: "div",
        body: "first child",
      },
      {
        from: "div",
        body: "second child",
      },
    ],
  });
});

test("handling undefined from field", () => {
  const box = {
    from: undefined,
  };
  const boxParsed = buildDocument({ box }, "box");
  const { container } = render(boxParsed());
  expect(container.innerHTML).toBe(``);
});

test("multi level body with implicit from", () => {
  const box = normalize({
    style: "bg-red-100 p-1",
    body: {
      style: "bg-yellow-100 p-1",
      body: {
        style: "bg-green-100 p-1 size-1",
      },
    },
  });
  const boxParsed = renderComponent(box);
  const { container } = render(boxParsed);
  expect(container.innerHTML).toBe(
    `<div class="bg-red-100 p-1"><div class="bg-yellow-100 p-1"><div class="bg-green-100 p-1 size-1"></div></div></div>`
  );
});

test("implicit from array", () => {
  const box = normalize([
    { style: "bg-red-100 p-1" },
    { style: "bg-yellow-100 p-1" },
    { style: "bg-green-100 p-1 size-1" },
  ]);
  const boxParsed = buildDocument({ box }, "box");
  const { container } = render(boxParsed());
  expect(container.innerHTML).toBe(
    `<div class="bg-red-100 p-1"></div><div class="bg-yellow-100 p-1"></div><div class="bg-green-100 p-1 size-1"></div>`
  );
});

test("render list of multiple composable children with implicit from and no body", () => {
  const box1 = {
    from: "div",
    id: "first",
    body: "first child",
  };
  const box2 = {
    from: "div",
    id: "second",
    body: "second child",
  };
  const box = {
    body: ["box1", "box2"],
  };
  const components = { box1, box2, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    body: [
      {
        from: "div",
        id: "first",
        body: "first child",
      },
      {
        from: "div",
        id: "second",
        body: "second child",
      },
    ],
  });
});

test("optional props", () => {
  const box1 = {
    style: "$a $b",
  };
  const box = [
    { from: "box1", a: "bg-red-100" },
    { from: "box1", b: "bg-blue-100" },
    { from: "box1", a: "bg-red-100", b: "bg-yellow-100" },
  ] as any;
  const components = { box1, box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    body: [
      { style: "bg-red-100 " },
      { style: " bg-blue-100" },
      { style: "bg-red-100 bg-yellow-100" },
    ],
  });
});

test("template components with implicit from", () => {
  const $box = {
    id: "target",
    style: "$color p-1 $size",
    body: "template",
  };
  const box = {
    color: "bg-green-100",
    size: "size-1",
    body: "instance",
  };
  const components = { box, $box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    id: "target",
    style: "bg-green-100 p-1 size-1",
    body: "instance",
  });
});

test("template components with body replacement and explicit from", () => {
  const $box = {
    id: "target",
    body: [
      { from: "div", body: "$first" },
      { from: "div", body: "$second" },
    ],
  };
  const box = {
    first: "jesus",
    second: "christ",
  };
  const components = { box, $box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    id: "target",
    body: [
      { from: "div", body: "jesus" },
      { from: "div", body: "christ" },
    ],
  });
});

test("template components with body replacement as string", () => {
  const $box = {
    id: "target",
    body: "$first $second",
  };
  const box = {
    first: "jesus",
    second: "christ",
  };
  const components = { box, $box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    id: "target",
    body: "jesus christ",
  });
});

test("template components with body replacement and implicit from", () => {
  const jesus = {
    style: "bg-red-100",
    body: "Jesus",
  };
  const christ = {
    style: "bg-yellow-100",
    body: "Christ",
  };
  const $box = {
    id: "target",
    body: ["$first", "$second"],
  };
  const box = {
    first: "jesus",
    second: "christ",
  };
  const components = { jesus, christ, box, $box };
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    id: "target",
    body: [
      {
        style: "bg-red-100",
        body: "Jesus",
      },
      {
        style: "bg-yellow-100",
        body: "Christ",
      },
    ],
  });
});

test("template component with implicit from and list children", () => {
  const $box = {
    style: "$color p-1 $size",
    body: "-> $text",
  };
  const box = [
    { color: "bg-red-100" },
    { color: "bg-yellow-100" },
    { size: "h-2" },
    { color: "bg-green-100", size: "size-1" },
    { text: "test" },
  ];
  const components = { box, $box } as any;
  const boxParsed = buildComponent("box", components);
  expect(boxParsed()).toEqual({
    body: [
      { style: "bg-red-100 p-1 ", body: "-> " },
      { style: "bg-yellow-100 p-1 ", body: "-> " },
      { style: " p-1 h-2", body: "-> " },
      { style: "bg-green-100 p-1 size-1", body: "-> " },
      { style: " p-1 ", body: "-> test" },
    ],
  });
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
  const components = parseYaml(yaml)!;
  const boxParsed = buildComponent("box", components!);
  expect(boxParsed()).toEqual({
    body: [
      {
        from: "div",
        style: "flex justify-between",
        body: [{ body: "CompanyA" }, { body: "2024-2025" }],
      },
      {
        from: "div",
        style: "flex justify-between",
        body: [{ body: "CompanyB" }, { body: "2023-2024" }],
      },
    ],
  });
});

test("shortcut for component reference in body array 1", () => {
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
  const component = buildComponent("box", parseYaml(yaml));
  expect(component()).toEqual({
    from: "div",
    id: "parent",
    body: [
      { from: "div", body: "first child" },
      { from: "div", body: "second child" },
      { from: "p", body: "third child" },
      { from: "h2", body: "fourth child" },
    ],
  });
});

test("shortcut for component reference in body array with other properties", () => {
  const yaml = `
box:
  - div:
      body: unique child
      style: text-red-500
`;
  const component = buildComponent("box", parseYaml(yaml)!);
  expect(component()).toEqual({
    body: [
      {
        from: "div",
        body: "unique child",
        style: "text-red-500",
      },
    ],
  });
});

test("shortcut for component reference in body array with other properties with implicit body", () => {
  const yaml = `
box:
  - div: unique child
    style: text-red-500
`;
  const component = buildComponent("box", parseYaml(yaml)!);
  expect(component()).toEqual({
    body: [
      {
        from: "div",
        body: "unique child",
        style: "text-red-500",
      },
    ],
  });
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
  const component = buildComponent("box", parseYaml(yaml)!);
  expect(
    component({
      pContent: "Paragraph text",
      h2Content: "Heading text",
      spanContent: "Span text",
      divContent: "Div text",
    })
  ).toEqual({
    from: "div",
    body: [
      {
        from: "p",
        body: "Paragraph text",
        style: "text-red-500",
      },
      {
        from: "h2",
        body: "Heading text",
      },
      {
        from: "span",
        body: "Span text",
        style: "font-bold",
      },
      {
        from: "div",
        body: "Div text",
        style: "bg-blue-100 p-2",
      },
    ],
  });
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
  const component = buildComponent("box", parseYaml(yaml)!);
  expect(component()).toEqual({
    from: "ul",
    body: [
      { from: "li", body: "first child" },
      { from: "li", body: "second child" },
      { from: "li", body: "third child" },
    ],
  });
});

test("using props with template", () => {
  const yaml = `
box:
  - box1
  
$box1:
  from: div
  body: $name

box1:
  name: test

`;
  const component = buildComponent("box", parseYaml(yaml)!);
  expect(component()).toEqual({
    body: [
      {
        from: "div",
        body: "test",
      },
    ],
  });
});
