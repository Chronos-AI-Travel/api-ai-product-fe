import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faChevronDown,
  faChevronUp,
  faFolder,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../app/utils/firebaseConfig";

const Status = ({ projectId, status, updateStatus }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const setComplete = async () => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        status: "Completed",
      });
      updateStatus("completed"); // Update status in parent component
      console.log("Update successful");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const setInProgress = async () => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        status: "In progress",
      });
      updateStatus("In progress"); // Update status in parent component
      console.log("Update successful");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const archiveProject = async () => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        status: "Archived",
      });
      updateStatus("Archived"); // Update status in parent component
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div className="border-2 w-48 rounded-lg p-2 relative">
      <div className="flex items-center justify-between">
        <span>
          {status}
          {status === "In progress" && (
            <span className="inline-block ml-2 w-2 h-2 bg-teal-300 rounded-full"></span>
          )}
          {status === "Complete" && (
            <span className="inline-block ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </span>
        <FontAwesomeIcon
          icon={isDropdownOpen ? faChevronUp : faChevronDown}
          onClick={toggleDropdown}
          className="cursor-pointer ml-2"
        />
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded shadow-xl">
          <button
            className="block px-4 flex items-center justify-between py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={setInProgress}
          >
            Set to In Progress <FontAwesomeIcon icon={faPlay} />
          </button>
          <button
            className="block px-4 flex items-center justify-between py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={setComplete}
          >
            Set to Complete <FontAwesomeIcon icon={faCheckDouble} />
          </button>
          <button
            className="block px-4 py-2 flex items-center justify-between text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={archiveProject}
          >
            Archive Project <FontAwesomeIcon icon={faFolder} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Status;
