import { faCheckCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OurProcess = ({ isRepoSelected, currentStep, finalStep }) => {
  return (
    <div className="py-1 text-gray-800 bg-gray-500 rounded-t-md">
      <ol className="text-sm flex text-xs p-2 flex-row gap-2 w-full">
        <li className="rounded-lg border flex bg-white text-gray-900 p-2 w-auto">
          Choose API
          <FontAwesomeIcon className="text-green-400" icon={faCheckCircle} />
        </li>
        <li className="rounded-lg flex border text-xs bg-white text-gray-900 p-2 w-auto">
          Select Repo
          <FontAwesomeIcon
            className={`text-${isRepoSelected ? "green-400" : "gray-200"}`}
            icon={faCheckCircle}
          />
        </li>
        <li className="rounded-lg text-xs bg-white flex text-gray-900 border p-2 w-auto">
          Repo scan
          <FontAwesomeIcon
            className={`text-${
              currentStep === 1 ||
              currentStep === 2 ||
              currentStep === 3 ||
              currentStep === 4 ||
              currentStep === 5 ||
              currentStep === 6 ||
              currentStep === 7
                ? "green-400"
                : "gray-200"
            }`}
            icon={faCheckCircle}
          />
        </li>
        <li className="rounded-lg text-xs bg-white flex text-gray-900 border p-2 w-auto">
          Generate functions
          <FontAwesomeIcon
            className={`text-${
              currentStep === 2 ||
              currentStep === 3 ||
              currentStep === 4 ||
              currentStep === 5 ||
              currentStep === 6 ||
              currentStep === 7
                ? "green-400"
                : "gray-200"
            }`}
            icon={faCheckCircle}
          />
        </li>
        <li className="rounded-lg text-xs bg-white flex text-gray-900 border p-2 w-auto">
          Generate elements
          <FontAwesomeIcon
            className={`text-${
              currentStep === 3 ||
              currentStep === 4 ||
              currentStep === 5 ||
              currentStep === 6 ||
              currentStep === 7
                ? "green-400"
                : "gray-200"
            }`}
            icon={faCheckCircle}
          />
        </li>
        <li className="rounded-lg text-xs bg-white flex text-gray-900 border p-2 w-auto">
          Generate endpoints
          <FontAwesomeIcon
            className={`text-${
              currentStep === 4 ||
              currentStep === 5 ||
              currentStep === 6 ||
              currentStep === 7
                ? "green-400"
                : "gray-200"
            }`}
            icon={faCheckCircle}
          />
        </li>
        <li className="rounded-lg text-xs bg-white flex text-gray-900 border p-2 w-auto">
          Key generation
          <FontAwesomeIcon
            className={`text-${
              currentStep === 5 || currentStep === 6 || currentStep === 7
                ? "green-400"
                : "gray-200"
            }`}
            icon={faCheckCircle}
          />
        </li>
        <li className="rounded-lg text-xs bg-white flex text-gray-900 border p-2 w-auto">
          Integration test
          <FontAwesomeIcon
            className={`text-${
              currentStep === 6 || currentStep === 7 ? "green-400" : "gray-200"
            }`}
            icon={faCheckCircle}
          />
        </li>
        <li className="rounded-lg text-xs bg-white flex text-gray-900 border p-2 w-auto">
          Code check
          <FontAwesomeIcon
            className={`text-${currentStep === 7 ? "green-400" : "gray-200"}`}
            icon={faCheckCircle}
          />
        </li>
        <li className="rounded-lg text-xs bg-white flex text-gray-900 border p-2 w-auto">
          Pull Request
          <FontAwesomeIcon
            className={`${finalStep ? "text-green-400" : "text-gray-200"}`}
            icon={faCheckCircle}
          />
        </li>
      </ol>
    </div>
  );
};
export default OurProcess;
