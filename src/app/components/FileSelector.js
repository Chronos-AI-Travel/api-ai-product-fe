import React, { useEffect, useState } from "react";
import {
  faTimes,
  faFolder,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileSelector = ({
  isOpen,
  toggleFileSelector,
  selectedRepo,
  githubAccessToken,
  onSave,
}) => {
  const [repoFiles, setRepoFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchRepoFiles("");
  }, [selectedRepo, githubAccessToken]);

  // Get Files
  const fetchRepoFiles = async (path, parentIndex = null) => {
    if (!selectedRepo || !githubAccessToken) return;

    const url = `https://api.github.com/repos/${selectedRepo}/contents/${path}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${githubAccessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch repository contents");
      }
      let files = await response.json();

      // Check if the response is an object (single file), and wrap it in an array if so
      if (!Array.isArray(files) && typeof files === "object") {
        files = [files]; // Wrap the single file object in an array
      }

      if (parentIndex !== null) {
        // If fetching contents for a directory, update its 'children' property
        setRepoFiles((prevFiles) => {
          // Convert parentIndex to an array of indices. Ensure it's always treated as a string.
          const parentPathIndices = parentIndex
            .toString()
            .split("-")
            .map(Number);
          // Create a deep copy of prevFiles to avoid mutating state directly.
          const newFiles = JSON.parse(JSON.stringify(prevFiles));

          // Navigate to the correct parent directory within newFiles.
          let currentDirectory = newFiles;
          for (let i = 0; i < parentPathIndices.length; i++) {
            const idx = parentPathIndices[i];
            if (i === parentPathIndices.length - 1) {
              // Last index: update this directory's children and isOpen properties.
              currentDirectory[idx].children = files;
              currentDirectory[idx].isOpen = true;
            } else {
              // Not last index: navigate deeper into the children.
              currentDirectory = currentDirectory[idx].children;
            }
          }
          return newFiles;
        });
      } else {
        // If fetching root directory contents, simply set the state
        setRepoFiles(
          files.map((file) => ({ ...file, isOpen: false, children: [] }))
        );
      }
    } catch (error) {
      console.error("Error fetching repository contents:", error);
    }
  };

  // Open/Close Directory
  const toggleDirectory = (pathIndex) => {
    // Split the pathIndex to navigate through the nested structure
    const indices = pathIndex.split("-").map(Number);
    let currentDirectory = repoFiles;
    indices.forEach((index, idx) => {
      if (idx < indices.length - 1) {
        // Navigate deeper for all but the last index
        currentDirectory = currentDirectory[index].children;
      } else {
        // Last index, toggle the isOpen state
        const isCurrentlyOpen = currentDirectory[index].isOpen;
        if (isCurrentlyOpen) {
          // Close the directory
          setRepoFiles((prevFiles) => {
            const newFiles = JSON.parse(JSON.stringify(prevFiles));
            let targetDirectory = newFiles;
            indices.forEach((i, idx) => {
              if (idx < indices.length - 1) {
                targetDirectory = targetDirectory[i].children;
              } else {
                targetDirectory[i].isOpen = false;
                targetDirectory[i].children = [];
              }
            });
            return newFiles;
          });
        } else {
          // Open the directory and fetch its contents
          const directoryPath = currentDirectory[index].path;
          fetchRepoFiles(directoryPath, pathIndex);
        }
      }
    });
  };

  // Select Files
  const handleFileSelectionChange = (file, isChecked) => {
    setSelectedFiles((prevSelectedFiles) => {
      const newSelectedFiles = isChecked
        ? [...prevSelectedFiles, file]
        : prevSelectedFiles.filter(
            (selectedFile) => selectedFile.path !== file.path
          );

      console.log("Updated selected files:", newSelectedFiles);
      return newSelectedFiles;
    });
  };

  // Render files
  const renderFiles = (files, depth = 0, parentPathIndex = "") => {
    return files.map((file, index) => {
      const pathIndex = parentPathIndex
        ? `${parentPathIndex}-${index}`
        : `${index}`;
      const isChecked = selectedFiles.some(
        (selectedFile) => selectedFile.path === file.path
      );

      // Function to handle row click, only if the item is a directory
      const handleRowClick = (e) => {
        if (file.type === "dir") {
          toggleDirectory(pathIndex);
        }
      };

      return (
        <React.Fragment key={file.path}>
          <tr
            className="border-b border-gray-400 last:border-b-0 cursor-pointer"
            onClick={handleRowClick}
            style={{ paddingLeft: `${depth * 20}px` }}
          >
            <td className="p-2 text-sm ml-2 flex items-center">
              {file.type === "dir" ? (
                <FontAwesomeIcon
                  icon={file.isOpen ? faFolderOpen : faFolder}
                  className="mr-2"
                />
              ) : file.type === "file" ? (
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isChecked}
                  onChange={(e) =>
                    handleFileSelectionChange(file, e.target.checked)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              ) : null}
              {file.name}
            </td>
          </tr>
          {file.isOpen &&
            Array.isArray(file.children) &&
            renderFiles(file.children, depth + 1, pathIndex)}
        </React.Fragment>
      );
    });
  };

  // Save Selected Files
  const handleSave = () => {
    console.log("Save button clicked");
    if (onSave) {
      onSave(selectedFiles);
    }
    toggleFileSelector(); // Assuming this closes the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center bg-black bg-opacity-50 z-10">
      <div className="absolute p-4 flex flex-col items-center top-10 font-montserray w-3/4 bg-white rounded-lg h-3/4 overflow-hidden">
        <div className="flex items-start py-4 w-full justify-between">
          <div className="text-xl">
            Select the files in scope for this integration.
          </div>
          <button onClick={toggleFileSelector}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <button
          className="px-4 py-2 w-fit mb-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleSave}
        >
          Save selected files
        </button>
        <div className="overflow-auto w-11/12 flex justify-center max-h-[calc(100%-3rem)]">
          <table className="w-11/12 border-gray-500 border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border-b border-gray-400 font-medium">
                  {selectedRepo}
                </th>
              </tr>
            </thead>
            <tbody>{renderFiles(repoFiles)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;
