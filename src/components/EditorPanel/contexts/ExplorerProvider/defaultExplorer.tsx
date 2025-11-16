import type { File } from ".";
import main from "@/assets/defaultDocuments/main.yml?raw";
import document from "@/assets/defaultDocuments/document.yml?raw";
import education from "@/assets/defaultDocuments/components/education.yml?raw";
import headline from "@/assets/defaultDocuments/components/headline.yml?raw";
import experience from "@/assets/defaultDocuments/components/experience.yml?raw";
import li from "@/assets/defaultDocuments/components/ui/li.yml?raw";
import row from "@/assets/defaultDocuments/components/ui/row.yml?raw";
import section from "@/assets/defaultDocuments/components/ui/section.yml?raw";
import icons from "@/assets/defaultDocuments/components/icons.yml?raw";

const defaultExplorer: File[] = [
  {
    id: "74206ff5-24ce-4271-92a8-f2d0548afbb9",
    name: "main.yml",
    path: [],
    content: main,
  },
  {
    id: "fa29012e-247f-4d38-aa49-45ccf5212a51",
    name: "document.yml",
    path: [],
    content: document,
  },
  {
    id: "0cc8ffcd-1640-4318-aa0b-5e3f28481bc9",
    name: "education.yml",
    path: ["components"],
    content: education,
  },
  {
    id: "3b905021-3b0a-47ed-b138-a1ed62c0a418",
    name: "headline.yml",
    path: ["components"],
    content: headline,
  },
  {
    id: "89e9215d-d92b-4626-9c59-860faa689e8e",
    name: "experience.yml",
    path: ["components"],
    content: experience,
  },
  {
    id: "91cd1b6e-01e6-464d-b47a-07031a6ec407",
    name: "li.yml",
    path: ["components", "ui"],
    content: li,
  },
  {
    id: "f9d32570-63b3-488a-ada1-238243d845bf",
    name: "row.yml",
    path: ["components", "ui"],
    content: row,
  },
  {
    id: "f332922c-a8fb-4d8a-848e-255747919b83",
    name: "section.yml",
    path: ["components", "ui"],
    content: section,
  },
  {
    id: "84ac57ea-f025-4e35-859c-5140e9033de5",
    name: "icons.yml",
    path: ["components"],
    content: icons,
  },
]

export default defaultExplorer;