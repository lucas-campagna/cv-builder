import { load } from "js-yaml";
import type { SetOfComponents } from "./types";

const parse = (text: string) => load(text) as SetOfComponents | undefined;

export default parse;
