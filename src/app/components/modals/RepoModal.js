import React, { useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth } from "firebase/auth";

const RepoModal = ({ isOpen, onClose, content = [], userUid }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modifiedContents, setModifiedContents] = useState([]);

  const handleFileCheck = (item, isChecked) => {
    if (isChecked) {
      setSelectedFiles([...selectedFiles, item]);
    } else {
      setSelectedFiles(selectedFiles.filter((file) => file.path !== item.path));
    }
  };

  const processSelectedFiles = async () => {
    const fileUrls = selectedFiles.map((file) => file.url);
    try {
      const response = await fetch("http://localhost:5000/api/process-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrls, userUid }),
      });
      const data = await response.json();
      console.log("Response from backend:", data);
      setModifiedContents(data.modifiedContents);
    } catch (error) {
      console.error("Error processing selected files:", error);
    }
  };

  const createNewBranchWithModifiedContent = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/create-branch-and-commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userUid,
          branchName: "chronos-branch-1",
          fileContents: modifiedContents,
          filePath: "path/to/your/file.txt",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Branch and file created successfully:", data);
      } else {
        console.error("Failed to create branch and file:", data.error);
      }
    } catch (error) {
      console.error("Error creating branch and file:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-slate-900 p-4 rounded-lg h-2/3 w-2/3 overflow-auto">
        <div className="flex items-center pb-4 justify-between">
          <p className="text-2xl">Repository Contents</p>
          <FontAwesomeIcon
            icon={faTimes}
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>
        <ul className="justify-start flex flex-col text-left">
          {Array.isArray(content) &&
            content.map((item, index) => (
              <li
                key={index}
                className="flex items-center border-b p-2 justify-between"
              >
                {item.path}
                {item.type === "file" && (
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    onChange={(e) => handleFileCheck(item, e.target.checked)}
                  />
                )}
              </li>
            ))}
          <button
            className="bg-slate-900 text-white p-2 rounded-lg w-fit mt-4"
            onClick={processSelectedFiles}
          >
            Process Selected Files
          </button>
          {modifiedContents.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Modified Contents:</h3>
              <ul>
                {modifiedContents.map((content, index) => (
                  <li key={index} className="mt-2">
                    <pre className="bg-gray-100 p-2 rounded">{content}</pre>
                  </li>
                ))}
              </ul>
              <button
                className="bg-blue-500 text-white p-2 rounded-lg w-fit mt-4"
                onClick={createNewBranchWithModifiedContent}
              >
                Create New Branch
              </button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RepoModal;
