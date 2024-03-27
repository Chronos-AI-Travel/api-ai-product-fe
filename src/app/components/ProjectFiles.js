import React, { useState, useEffect } from "react";
import { db } from "../utils/firebaseConfig"; // Adjust the import path as necessary
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faFileCirclePlus,
  faFileLines,
  faFolderTree,
} from "@fortawesome/free-solid-svg-icons";

const ProjectFiles = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown open/close

  useEffect(() => {
    const fetchProjectFiles = async () => {
      if (!projectId) return;
      const projectRef = doc(db, "projects", projectId);
      const q = query(
        collection(db, "projectFiles"),
        where("project", "==", projectRef)
      );
      const querySnapshot = await getDocs(q);
      const filesArray = [];
      querySnapshot.forEach((doc) => {
        filesArray.push({ id: doc.id, ...doc.data() });
      });
      setFiles(filesArray);
    };

    fetchProjectFiles();
  }, [projectId]);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="border-2 bg-white w-48 mt-2 overflow-hidden rounded-lg p-2 absolute"
    >
      <div className="flex justify-between items-center cursor-pointer">
        <p className="">
          <FontAwesomeIcon
            className="text-gray-400 text-xs mr-2"
            icon={faFileLines}
          />
          Project Files
        </p>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>
      {isOpen && (
        <ul className="text-xs mt-2">
          {files.map((file) => (
            <li className="py-1 border-b" key={file.id}>
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectFiles;
