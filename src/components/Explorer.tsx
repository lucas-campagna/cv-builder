import { useExplorer } from "@/hooks/useExplorer";
import { Button } from "./ui/button";

const Explorer = () => {
  const { state, addFile, selectFile } = useExplorer();

  const handleAddFile = () => {
    addFile();
  };

  return (
    <div className="flex flex-col items-start justify-start p-2 select-none">
      {state.fileTree.map((file) => (
        <div
          key={file.path}
          className={`p-2 w-full rounded cursor-pointer hover:bg-gray-200 capitalize ${
            state.selectedFile === file.path ? "bg-gray-300" : ""
          }`}
          onClick={() => selectFile(file.path)}
        >
          {file.path}
        </div>
      ))}
    </div>
  );
};

const AddButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    className="p-2 w-full rounded cursor-pointer hover:bg-gray-200"
    onClick={onClick}
  >
    +
  </Button>
);

export default Explorer;
