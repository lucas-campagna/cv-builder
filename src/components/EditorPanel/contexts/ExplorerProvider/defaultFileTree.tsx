import type { FileTree } from ".";
import main from "@/assets/defaultDocuments/main.yml?raw";
import document from "@/assets/defaultDocuments/document.yml?raw";
import education from "@/assets/defaultDocuments/components/education.yml?raw";
import headline from "@/assets/defaultDocuments/components/headline.yml?raw";
import experience from "@/assets/defaultDocuments/components/experience.yml?raw";
import li from "@/assets/defaultDocuments/components/ui/li.yml?raw";
import row from "@/assets/defaultDocuments/components/ui/row.yml?raw";
import section from "@/assets/defaultDocuments/components/ui/section.yml?raw";

const defaultFileTree: FileTree = {
  "main.yml": main,
  "document.yml": document,
  "components/education.yml": education,
  "components/headline.yml": headline,
  "components/experience.yml": experience,
  "components/ui/li.yml": li,
  "components/ui/row.yml": row,
  "components/ui/section.yml": section,
}

export default defaultFileTree;