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
  const [branchCreated, setBranchCreated] = useState(false);
  const [githubAccessToken, setGithubAccessToken] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [docsLink, setDocsLink] = useState("");
  const [vertical, setVertical] = useState("");

  // Get Project Information
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProjectName(docSnap.data().providerName);
        const providerID = docSnap.data().providerID;

        const providerRef = doc(db, "providers", providerID);
        const providerSnap = await getDoc(providerRef);

        if (providerSnap.exists()) {
          const docslink = providerSnap.data().docslink;
          const vertical = providerSnap.data().vertical;
          setDocsLink(docslink);
          setVertical(vertical);
        } else {
          console.log("No such provider document!");
        }
      } else {
        console.log("No such project document!");
      }
    };

    fetchProject();
  }, [projectId]);

  // Get the Repo Information
  const handleRepoSelection = (repoFullName, token) => {
    console.log("Selected repository:", repoFullName);
    setSelectedRepo(repoFullName);
    setGithubAccessToken(token);
  };

  // Get Access Token
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

  // Trigger Integration
  const handleInputSubmit = async () => {
    setIsLoading(true);

    const baseUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://api-ai-langchain-agent.onrender.com";

    // Extract projectId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const session_id = urlParams.get("projectId");

    const payload = {
      session_id,
      input: userInput,
      chat_history: [],
      docslink: docsLink,
      vertical: vertical,
      repo: selectedRepo,
    };

    console.log("Submitting user input:", userInput);
    console.log("Payload sent:", payload);

    try {
      const response = await fetch(`${baseUrl}/agent/invoke`, {
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

  // Create New Branch
  const createNewBranch = async () => {
    const ownerRepo = selectedRepo.split("/");
    const owner = ownerRepo[0];
    const repo = ownerRepo[1];
    const baseBranch = "main";
    try {
      const branchesResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/branches`,
        {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const branches = await branchesResponse.json();
      const branchNames = branches.map((branch) => branch.name);
      let branchNumber = 1;
      let newBranchName = `chronos-integration-${branchNumber}`;
      while (branchNames.includes(newBranchName)) {
        branchNumber++;
        newBranchName = `chronos-integration-${branchNumber}`;
      }
      const baseBranchResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`,
        {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const baseBranchData = await baseBranchResponse.json();
      const baseSha = baseBranchData.object.sha;
      const createBranchResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/refs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ref: `refs/heads/${newBranchName}`,
            sha: baseSha,
          }),
        }
      );
      if (createBranchResponse.ok) {
        console.log(`Branch ${newBranchName} created successfully.`);
        setBranchCreated(true);
        let fileName = agentResponse.split("\n")[0];
        fileName = fileName.replace(/<[^>]+>/g, "");
        const fileContent = agentResponse.substring(
          agentResponse.indexOf("\n") + 1
        );
        const contentBase64 = btoa(unescape(encodeURIComponent(fileContent)));
        const fileExistsResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}?ref=${newBranchName}`,
          {
            headers: {
              Authorization: `Bearer ${githubAccessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        let sha = "";
        if (fileExistsResponse.status === 200) {
          const fileData = await fileExistsResponse.json();
          sha = fileData.sha;
        }

        const createOrUpdateFileResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${githubAccessToken}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Create or update ${fileName}`,
              content: contentBase64,
              branch: newBranchName,
              sha: sha,
            }),
          }
        );

        if (createOrUpdateFileResponse.ok) {
          console.log(
            `${fileName} created or updated successfully in ${newBranchName} branch.`
          );
        } else {
          console.error(`Failed to create or update ${fileName}.`);
        }
      } else {
        console.error("Failed to create the branch.");
        setBranchCreated(false);
      }
    } catch (error) {
      console.error("Error creating new branch:", error);
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
            disabled={!selectedRepo} // Button is disabled if selectedRepo is falsy
            className={`mt-2 px-4 flex  w-56 items-center gap-2 py-2 rounded-lg ${
              selectedRepo
                ? "bg-green-500 text-white standard-button"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            <FontAwesomeIcon icon={faPlay} />
            Start Integration
          </button>
          <button
            onClick={createNewBranch}
            disabled={!agentResponse || branchCreated}
            className={`mt-2 px-4 py-2 flex  items-center gap-2 rounded-lg ${
              agentResponse
                ? "bg-blue-500 text-white standard-button"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {branchCreated ? "Branch Created!" : "Add File to New Branch"}
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
                  : "Your code will appear here...",
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Processing;
