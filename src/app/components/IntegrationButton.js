import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faHandPointer } from "@fortawesome/free-solid-svg-icons";

const IntegrationButton = ({
  selectedFilesInParent,
  selectedRepo,
  agentResponse,
  handleInputSubmit,
  toggleFileSelector,
  handleFinalStep,
  finalStep,
  createNewBranch,
  branchCreated,
}) => {
  return (
    <>
      {finalStep ? (
        <button
          onClick={createNewBranch}
          disabled={branchCreated}
          className={`mt-2 px-4 flex w-56 items-center gap-2 py-2 rounded-lg ${
            !branchCreated
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {branchCreated ? "Branch Created!" : "Create New Branch"}
        </button>
      ) : agentResponse.step === 7 ? (
        <button
          onClick={handleFinalStep}
          className="mt-2 px-4 flex w-56 items-center gap-2 py-2 rounded-lg bg-green-500 text-white"
        >
          <FontAwesomeIcon icon={faPlay} />
          Final Step
        </button>
      ) : selectedFilesInParent.length > 0 ? (
        <button
          onClick={handleInputSubmit}
          className="mt-2 px-4 flex w-56 items-center gap-2 py-2 rounded-lg bg-green-500 text-white hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faPlay} />
          Continue
        </button>
      ) : selectedRepo ? (
        <button
          onClick={toggleFileSelector}
          className="mt-2 px-4 flex w-56 items-center gap-2 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faHandPointer} />
          Select files
        </button>
      ) : (
        <button
          onClick={handleInputSubmit}
          disabled={!selectedRepo}
          className={`mt-2 px-4 flex w-56 items-center gap-2 py-2 rounded-lg ${
            selectedRepo
              ? "bg-green-500 text-white hover:bg-green-700 standard-button"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          <FontAwesomeIcon icon={faPlay} />
          Start Integration
        </button>
      )}
    </>
  );
};

export default IntegrationButton;
