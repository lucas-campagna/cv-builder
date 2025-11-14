import type { FileTree } from ".";
import main from "@/assets/defaultDocuments/main.yml?raw";
import document from "@/assets/defaultDocuments/document.yml?raw";
import education from "@/assets/defaultDocuments/components/education.yml?raw";
import headline from "@/assets/defaultDocuments/components/headline.yml?raw";
import experience from "@/assets/defaultDocuments/components/experience.yml?raw";
import li from "@/assets/defaultDocuments/components/ui/li.yml?raw";
import row from "@/assets/defaultDocuments/components/ui/row.yml?raw";
import section from "@/assets/defaultDocuments/components/ui/section.yml?raw";
import icons from "@/assets/defaultDocuments/components/icons.yml?raw";

export const defaultFileTree: FileTree = {
  "main.yml": "74206ff5-24ce-4271-92a8-f2d0548afbb9",
  "document.yml": "fa29012e-247f-4d38-aa49-45ccf5212a51",
  "components": {
    "education.yml": "0cc8ffcd-1640-4318-aa0b-5e3f28481bc9",
    "headline.yml": "3b905021-3b0a-47ed-b138-a1ed62c0a418",
    "experience.yml": "89e9215d-d92b-4626-9c59-860faa689e8e",
    "ui": {
      "li.yml": "91cd1b6e-01e6-464d-b47a-07031a6ec407",
      "row.yml": "f9d32570-63b3-488a-ada1-238243d845bf",
      "section.yml": "f332922c-a8fb-4d8a-848e-255747919b83",
    },
    "icons.yml": "84ac57ea-f025-4e35-859c-5140e9033de5",
  }
}

export const defaultFileContent = {
  "74206ff5-24ce-4271-92a8-f2d0548afbb9": main,
  "fa29012e-247f-4d38-aa49-45ccf5212a51": document,
  "0cc8ffcd-1640-4318-aa0b-5e3f28481bc9": education,
  "3b905021-3b0a-47ed-b138-a1ed62c0a418": headline,
  "89e9215d-d92b-4626-9c59-860faa689e8e": experience,
  "91cd1b6e-01e6-464d-b47a-07031a6ec407": li,
  "f9d32570-63b3-488a-ada1-238243d845bf": row,
  "f332922c-a8fb-4d8a-848e-255747919b83": section,
  "84ac57ea-f025-4e35-859c-5140e9033de5": icons,  
}