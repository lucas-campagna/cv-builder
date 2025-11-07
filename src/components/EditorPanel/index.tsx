import { AppSidebar } from "./components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ExplorerProvider from "@/components/EditorPanel/contexts/ExplorerProvider";
import Editor from "./components/Editor";
import { useExplorer } from "./hooks/useExplorer";

function EditorPanel() {
  const { updateFileContent, selectedFile } = useExplorer();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Header path={selectedFile} />
        </header>
        <Editor onChange={updateFileContent} />,
      </SidebarInset>
    </SidebarProvider>
  );
}

const Header = ({ path }: { path: string | null }) => (
  <Breadcrumb className="select-none">
    <BreadcrumbList>
      {path?.split("/").map((part, index, arr) => (
        <BreadcrumbItem key={index}>
          {index < arr.length - 1 ? (
            <BreadcrumbLink>{part}</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{part}</BreadcrumbPage>
          )}
          {index < arr.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);

export default ({ ...props }: any) => (
  <ExplorerProvider>
    <EditorPanel {...props} />
  </ExplorerProvider>
);
