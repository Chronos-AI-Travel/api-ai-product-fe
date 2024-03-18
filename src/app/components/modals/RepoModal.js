import React, { useState, useEffect } from "react"; // Added useEffect for additional logging
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth } from "firebase/auth";

const RepoModal = ({
  isOpen,
  onClose,
  content = [],
  userUid,
  onSelectFiles,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileCheck = (item, isChecked) => {
    if (isChecked) {
      setSelectedFiles((prev) => [...prev, item]);
    } else {
      setSelectedFiles((prev) =>
        prev.filter((file) => file.path !== item.path)
      );
    }
  };

  const selectFilesForIntegration = async () => {
    // Function to extract the repoFullName from a GitHub API URL
    const extractRepoFullName = (url) => {
        const match = url.match(/https:\/\/api\.github\.com\/repos\/([^\/]+\/[^\/]+)/);
        return match ? match[1] : null;
    };

    const fileUrls = selectedFiles.map(file => {
        const repoFullName = extractRepoFullName(file.url);
        return repoFullName ? `https://api.github.com/repos/${repoFullName}/contents/${file.path}` : null;
    }).filter(url => url !== null); // Filter out any null URLs
  
    try {
      const response = await fetch("http://localhost:5000/fetch_file_contents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrls, userUid }), 
      });
      const data = await response.json();
      console.log("Response from backend:", data);
      onSelectFiles(data); 
    } catch (error) {
      console.error("Error processing selected files:", error);
    }
};

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
            onClick={selectFilesForIntegration}
          >
            Select Files for Integration
          </button>
        </ul>
      </div>
    </div>
  );
};
export default RepoModal;
