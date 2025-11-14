import Dialog from "@/components/Dialog";
import type React from "react";
import { useExplorer } from "../hooks/useExplorer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const SessionsDialog = (
  props: Omit<React.ComponentProps<typeof Dialog>, "children">
) => {
  const {
    currentSessionName,
    sessionNames,
    newSession,
    loadSession,
    deleteSession,
  } = useExplorer();
  const handleSelectSession = (name: string) => {
    loadSession(name);
    props?.onOpenChange?.(false);
  };
  const handleNewSession = () => {
    newSession("new session");
    handleSelectSession("new session");
  };
  return (
    <Dialog
      {...props}
      title="Manage Sessions"
      body={
        <div className="flex flex-col justify-between">
          {sessionNames.map((name) => (
            <div
              key={name}
              className="flex justify-between items-center border-2 border-gray-200 rounded-md "
            >
              <Button
                onClick={() => handleSelectSession(name)}
                className="flex-1"
                disabled={name === currentSessionName}
                autoFocus
                tabIndex={0}
              >
                {name}
              </Button>
              {sessionNames.length > 1 && (
                <X
                  className="text-red-500 cursor-pointer size-8 px-2"
                  onClick={() => deleteSession(name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      deleteSession(name);
                    }
                  }}
                  tabIndex={0}
                />
              )}
            </div>
          ))}
          <Button variant="outline" onClick={() => handleNewSession()}>
            new session
          </Button>
          {sessionNames.length === 0 && <p>No saved sessions found.</p>}
        </div>
      }
    >
      {null}
    </Dialog>
  );
};
export default SessionsDialog;
