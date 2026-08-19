import { useState } from "react";
import Sheet from "@lprett/gsheetdb";
import Dialog from "./Dialog";
import { Input } from "./ui/input";

const GSheetSetupDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [deploymentId, setDeploymentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!deploymentId.trim()) {
      setError("Please enter a Deployment ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sheet = new Sheet({ deploymentId });

      await sheet.new("sessions", [
        "id",
        "name",
        "path",
        "content",
        "type",
        "session_name",
      ]);

      const defaultSessionName = "CV Lucas Prett Campagna";

      const defaultExplorerData = [
        {
          id: "74206ff5-24ce-4271-92a8-f2d0548afbb9",
          name: "main.yml",
          path: "",
          content: `headline:
  name: Lucas Campagna
  email: lucas@example.com
  github: lucas-campagna
  linkedin: lucas-campagna

experiences:
  - company: Tech Company
    date: 2023-Present
    position: Software Engineer
    type: Remote
    description:
      - li: Built scalable web applications
      - li: Led team of 5 developers

education:
  - school: University of Tech
    date: 2019-2023
    degree: Computer Science`,
          type: "file",
        },
        {
          id: "fa29012e-247f-4d38-aa49-45ccf5212a51",
          name: "document.yml",
          path: "",
          content: `document:
  style: p-3 flex flex-col gap-2
  body:
    - headline
    - education
    - experience`,
          type: "file",
        },
        {
          id: "bece53c3-a46c-49cf-a629-bd57fb6d3f11",
          name: "components",
          path: "",
          type: "folder",
        },
        {
          id: "d1f6f3e2-B7c1-4d3e-8f4e-2f4e4c3e4b5a",
          name: "ui",
          path: "bece53c3-a46c-49cf-a629-bd57fb6d3f11",
          type: "folder",
        },
      ];

      const rowsWithSession = defaultExplorerData.map((row) => ({
        ...row,
        session_name: defaultSessionName,
      }));

      await sheet.set("sessions", rowsWithSession);

      localStorage.setItem("gsheet_deployment_id", deploymentId);
      onOpenChange(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to setup Google Sheets:", err);
      setError(
        "Failed to connect. Please check your Deployment ID and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={"Set up Google Sheets as your data store for CV sessions."}
      body={
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Setup Instructions:</h3>
              <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                <li>Create a new Google Sheet</li>
                <li>Go to Extensions &gt; Apps Script</li>
                <li>
                  Copy the content from{" "}
                  <a
                    href="https://github.com/lucas-campagna/gsheetdb/blob/master/gsheet.js"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    gsheet.js
                  </a>{" "}
                  to the editor
                </li>
                <li>Deploy as Web App (Deploy &gt; New deployment)</li>
                <li>Select &quot;Web app&quot; as type</li>
                <li>Set &quot;Execute as&quot; to &quot;Me&quot;</li>
                <li>Set &quot;Who has access&quot; to &quot;Anyone&quot;</li>
                <li>Copy the Deployment ID</li>
              </ol>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deployment ID</label>
              <Input
                value={deploymentId}
                onChange={(e) => setDeploymentId(e.target.value)}
                placeholder="Enter your Deployment ID"
                disabled={loading}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/80 rounded-md"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect"}
            </button>
          </div>
        </>
      }
    />
  );
};

export default GSheetSetupDialog;
