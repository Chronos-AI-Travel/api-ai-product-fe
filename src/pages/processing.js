import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../app/utils/firebaseConfig";
import Navbar2 from "../app/components/navigation/Navbar2";
import RepositorySelector from "../app/components/RepositorySelector";

const Processing = () => {
  const [projectName, setProjectName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Step 1: Add loading state
  const router = useRouter();
  const { projectId } = router.query;

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProjectName(docSnap.data().providerName);
      } else {
        console.log("No such document!");
      }
    };

    fetchProject();
  }, [projectId]);

  const handleInputSubmit = async () => {
    setIsLoading(true); // Step 3: Set loading to true when request starts
    console.log("Submitting user input:", userInput);
    try {
      const response = await fetch("http://localhost:8000/agent/invoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput, chat_history: [] }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAgentResponse(data.output);
    } catch (error) {
      console.error("Failed to fetch:", error);
      setAgentResponse("Failed to get response from the agent");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white h-full">
      <Navbar2 />
      <div className="flex min-h-screen h-full items-start justify-start flex-col p-4">
        <div className="font-light text-3xl mb-4">
          {projectName || "Loading..."}
        </div>
        <RepositorySelector />
        <div className="mb-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your request here"
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
          />
          <button
            onClick={handleInputSubmit}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Submit
          </button>
        </div>
        <div className="border-2 border-black rounded-lg p-4 w-full h-3/4 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader"></div>{" "}
              {/* Step 2: Display loading spinner */}
            </div>
          ) : (
            agentResponse || "Agent response will appear here..."
          )}
        </div>
      </div>
    </div>
  );
};

export default Processing;
