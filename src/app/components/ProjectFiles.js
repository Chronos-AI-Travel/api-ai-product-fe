import React, { useState, useEffect } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

const ProjectFiles = ({ projectId, files, setFiles }) => {
  // const [files, setFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const projectRef = doc(db, "projects", projectId);
    const q = query(
      collection(db, "projectFiles"),
      where("project", "==", projectRef)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const filesArray = [];
      querySnapshot.forEach((doc) => {
        filesArray.push({ id: doc.id, ...doc.data() });
      });
      setFiles(filesArray);
    });

    return () => unsubscribe();
  }, [projectId]);

  return (
    <div className="border-2 w-48 mt-2 bg-white overflow-hidden rounded-lg p-2 absolute z-8">
      <div
        className="flex justify-between flex-row items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-sm flex flex-row items-center gap-2">
          <FontAwesomeIcon
            icon={faFileLines}
            className="text-gray-500 flex items-center text-xs"
          />
          Project Files
          <div className="border py-1 px-2.5 rounded-full">{files.length}</div>
        </div>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>
      {isOpen && (
        <ul className="text-xs">
          {files.map((file) => (
            <li className="py-1" key={file.id}>
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectFiles;
