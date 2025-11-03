export type ComponentProps = {
  from?: string;
  style?: string;
  body?: unknown;
  [key: string]: unknown;
};

export type SetOfComponents = Record<string, ComponentProps>;
export type PropsType = Record<string, unknown>;
