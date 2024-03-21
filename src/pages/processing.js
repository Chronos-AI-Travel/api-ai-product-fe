import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../app/utils/firebaseConfig";
import Navbar2 from "../app/components/navigation/Navbar2";
import RepositorySelector from "../app/components/RepositorySelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const Processing = () => {
  const [projectName, setProjectName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { projectId } = router.query;
  const [sessionID, setSessionID] = useState(null);
  const [githubAccessToken, setGithubAccessToken] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");

  const handleRepoSelection = (repoFullName, token) => {
    console.log("Selected repository:", repoFullName);
    setSelectedRepo(repoFullName);
  };

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenDoc = await getDoc(doc(db, "access_tokens", user.uid));
        if (tokenDoc.exists()) {
          const token = tokenDoc.data().githubAccessToken;
          setGithubAccessToken(token);
        } else {
          console.log("No access token found");
        }
      } else {
        router.push("/signUp");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleInputSubmit = async () => {
    setIsLoading(true);

    // Extract projectId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const session_id = urlParams.get("projectId"); // Assuming the URL parameter is named 'projectId'

    const payload = {
      session_id, // Include the extracted session_id in the payload
      input: userInput,
      chat_history: [],
      github_info: {
        // access_token: githubAccessToken, // Uncomment if you decide to use it
        repo: selectedRepo,
      },
    };

    console.log("Submitting user input:", userInput);
    console.log("Payload sent:", payload);

    try {
      const response = await fetch("http://localhost:8000/agent/invoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
        <RepositorySelector
          setFileContent={setFileContent}
          onRepoSelect={handleRepoSelection}
        />
        <div className="my-4 flex w-full items-center flex-row justify-between">
          {/* <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your request here"
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
          /> */}
          <button
            onClick={handleInputSubmit}
            className="mt-2 px-4 flex standard-button items-center gap-2 py-2 bg-green-500 text-white rounded-lg"
          >
            <FontAwesomeIcon icon={faPlay} />
            Start Integration
          </button>
          <button className="mt-2 px-4 py-2 flex standard-button items-center gap-2 bg-blue-500 text-white rounded-lg">
            <Image src="/github-icon.svg" alt="GitHub" width={20} height={20} />
            Add File to New Branch
          </button>
        </div>
        <div className="border-2 border-black rounded-lg p-4 w-full h-3/4 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader"></div>
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: agentResponse
                  ? agentResponse.replace(/<pre>/g, `<pre class="preStyle">`)
                  : "Agent response will appear here...",
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Processing;
