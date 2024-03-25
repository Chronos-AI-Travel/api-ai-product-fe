import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../app/utils/firebaseConfig";
import Navbar2 from "../app/components/navigation/Navbar2";
import RepositorySelector from "../app/components/RepositorySelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPlay } from "@fortawesome/free-solid-svg-icons";
import OurProcess from "../app/components/OurProcess";
import Status from "../app/components/Status";

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
  const [status, setStatus] = useState("");
  const [finalStep, setFinalStep] = useState(false);

  // Get Project Information
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProjectName(docSnap.data().providerName);
        const providerID = docSnap.data().providerID;
        setStatus(docSnap.data().status);

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

  // Update Status
  const updateStatus = (newStatus) => {
    setStatus(newStatus);
  };

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
      console.log("data:", data);
      if (data.step === 1) {
        console.log("Suggested files:", data.suggested_files);
        setAgentResponse({ content: data.suggested_files, step: data.step });
      } else {
        setAgentResponse({ content: data.output, step: data.step });
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      setAgentResponse("Failed to get response from the agent");
    } finally {
      setIsLoading(false);
    }
  };

  // Set Final Step
  const handleFinalStep = () => {
    setFinalStep(true);
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
    <div className="bg-white w-full h-full">
      <Navbar2 />
      <div className="flex min-h-screen w-full h-full items-start flex-col p-4">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="font-light text-3xl mb-4">
            {projectName || "Loading..."}
          </div>
          <Status
            projectId={projectId}
            status={status}
            updateStatus={updateStatus}
          />
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
          {agentResponse.step === 7 ? (
            <button
              onClick={handleFinalStep}
              className="mt-2 px-4 flex w-56 items-center gap-2 py-2 rounded-lg bg-green-500 text-white"
            >
              <FontAwesomeIcon icon={faPlay} />
              Continue
            </button>
          ) : (
            <button
              onClick={handleInputSubmit}
              disabled={!selectedRepo}
              className={`mt-2 px-4 flex w-56 items-center gap-2 py-2 rounded-lg ${
                selectedRepo
                  ? "bg-green-500 text-white standard-button"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              <FontAwesomeIcon icon={faPlay} />
              {agentResponse.step >= 1 && agentResponse.step < 7
                ? "Continue"
                : "Start Integration"}
            </button>
          )}
        </div>
        <div className="border-2 bg-gray-100 border-black rounded-lg p-0 w-full h-3/4 overflow-auto">
          {isLoading ? (
            <div>
              <OurProcess
                isRepoSelected={!!selectedRepo}
                currentStep={agentResponse.step}
              />
              <div className="flex justify-center flex-col py-8 items-center h-full">
                <div className="loader"></div>
              </div>
            </div>
          ) : finalStep ? (
            <div>
              <OurProcess
                isRepoSelected={!!selectedRepo}
                currentStep={agentResponse.step}
                finalStep={finalStep}
              />
              <div className="bg-white p-4 m-4 flex items-center flex-col justify-center">
                <p className="text-xl text-center p-4 m-4 bg-white">
                  Now all thats left is to create a new branch with your
                  integration, run, and test it. ▶️
                </p>
                <button
                  onClick={createNewBranch}
                  disabled={!agentResponse.step === 1 || branchCreated}
                  className={`mt-2 px-4 py-2 flex  items-center gap-2 rounded-lg ${
                    agentResponse
                      ? "bg-blue-500 text-white standard-button"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  {branchCreated ? "Branch Created!" : "Create New Branch"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {agentResponse.content ? (
                agentResponse.step === 1 ? (
                  <div>
                    <OurProcess
                      isRepoSelected={!!selectedRepo}
                      currentStep={agentResponse.step}
                    />
                    <p className="text-xl text-center p-4 m-4 bg-white">
                      We&apos;ve analysed your codebase! Looks like its these
                      files we need to work on 🤔
                    </p>
                    <div className="m-4">
                      <p className="font-semibold py-2">
                        Press Continue to proceed to the next step
                      </p>
                      <ul>
                        {agentResponse.content
                          .split("\n")
                          .map((file, index) => (
                            <li
                              key={index}
                              className="p-2 flex w-fit items-center text-lg gap-2 border bg-white rounded-md mb-2"
                            >
                              <FontAwesomeIcon
                                className="text-gray-600 text-xs"
                                icon={faFile}
                              />
                              {file}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ) : agentResponse.step === 2 ? (
                  <div>
                    <OurProcess
                      isRepoSelected={!!selectedRepo}
                      currentStep={agentResponse.step}
                    />
                    <p className="text-xl text-center p-4 m-4 bg-white">
                      To get started, we have created the functions for your
                      integration. Next, we will create the UI elements.
                    </p>
                    <pre className="preStyle m-4 p-4">
                      {agentResponse.content}
                    </pre>
                  </div>
                ) : agentResponse.step === 3 ? (
                  <div>
                    <OurProcess
                      isRepoSelected={!!selectedRepo}
                      currentStep={agentResponse.step}
                    />
                    <p className="text-xl text-center p-4 m-4 bg-white">
                      Great! We&apos;ve proposed updates for your UI components
                      based on the integration. Here&apos;s what you can add or
                      update:
                    </p>
                    <pre className="preStyle m-4 p-4">
                      {agentResponse.content}
                    </pre>
                  </div>
                ) : agentResponse.step === 4 ? (
                  <div>
                    <OurProcess
                      isRepoSelected={!!selectedRepo}
                      currentStep={agentResponse.step}
                    />
                    <p className="text-xl text-center p-4 m-4 bg-white">
                      We&apos;ve identified the backend endpoints that need to
                      be created or updated. Here are the proposed backend
                      endpoints for your integration:
                    </p>
                    <pre className="preStyle m-4 p-4">
                      {agentResponse.content}
                    </pre>
                  </div>
                ) : agentResponse.step === 5 ? (
                  <div>
                    <OurProcess
                      isRepoSelected={!!selectedRepo}
                      currentStep={agentResponse.step}
                    />
                    <p className="text-xl text-center p-4 m-4 bg-white">
                      Make sure you have your API Key and have placed it in your
                      environment variables!
                    </p>
                    <pre className="preStyle m-4 p-4">
                      {agentResponse.content}
                    </pre>
                  </div>
                ) : agentResponse.step === 6 ? (
                  <div>
                    <OurProcess
                      isRepoSelected={!!selectedRepo}
                      currentStep={agentResponse.step}
                    />
                    <p className="text-xl text-center p-4 m-4 bg-white">
                      We have created integration tests that you can run to
                      check the status of your integration.
                    </p>
                    <pre className="preStyle m-4 p-4">
                      {agentResponse.content}
                    </pre>
                  </div>
                ) : agentResponse.step === 7 ? (
                  <div>
                    <OurProcess
                      isRepoSelected={!!selectedRepo}
                      currentStep={agentResponse.step}
                    />
                    <p className="text-xl text-center p-4 m-4 bg-white">
                      Based on your codebase, here are a list of things that may
                      be impacted by this integration. Select the ones you want
                      us to refactor to incorporate your new API integration.
                    </p>
                    <pre className="preStyle m-4 p-4">
                      {agentResponse.content}
                    </pre>
                  </div>
                ) : null
              ) : selectedRepo ? (
                <div>
                  <OurProcess isRepoSelected={!!selectedRepo} />
                  <p className="text-xl text-center p-4 m-4 bg-white">
                    Integrating{" "}
                    <span className="bg-blue-200 p-1 rounded-sm text-blue-600">
                      {projectName}
                    </span>{" "}
                    into{" "}
                    <span className="bg-blue-200 p-1 rounded-sm text-blue-600">
                      {selectedRepo}
                    </span>
                    {" "}🎉
                  </p>
                </div>
              ) : (
                <div>
                  <OurProcess />
                  <p className="text-xl text-center p-4 m-4 bg-white">
                    Select a Repository to integrate with the{" "}
                    <span className="bg-blue-200 p-1 rounded-sm text-blue-600">
                      {projectName}
                    </span>{" "}
                    API, and let&apos;s get started!🖱️
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Processing;
