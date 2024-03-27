import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../app/utils/firebaseConfig";
import Navbar2 from "../app/components/navigation/Navbar2";
import RepositorySelector from "../app/components/RepositorySelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faFile } from "@fortawesome/free-solid-svg-icons";
import OurProcess from "../app/components/OurProcess";
import Status from "../app/components/Status";
import ProjectFiles from "../app/components/ProjectFiles";
import FileSelector from "../app/components/FileSelector";
import IntegrationButton from "../app/components/IntegrationButton";

const Processing = () => {
  const [projectName, setProjectName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [agentResponse, setAgentResponse] = useState({ step: "" });
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
  const [isFileSelectorOpen, setIsFileSelectorOpen] = useState(false);
  const [repoContent, setRepoContent] = useState([]);
  const [selectedFilesInParent, setSelectedFilesInParent] = useState([]);
  const [files, setFiles] = useState([]);
  const [branchName, setBranchName] = useState("");

  // Get Project Information
  useEffect(() => {
    console.log("useEffect triggered with projectId:", projectId);

    const fetchProject = async () => {
      if (!projectId) return;
      console.log("Fetching project data for projectId:", projectId);

      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Project data found:", docSnap.data());

        const projectData = docSnap.data();
        console.log("Project step:", projectData.step);
        setProjectName(projectData.providerName);
        const providerID = projectData.providerID;
        setStatus(projectData.status);
        if (projectData.selectedRepo) {
          setSelectedRepo(projectData.selectedRepo);
        }
        if (projectData.step !== undefined) {
          console.log("Setting agentResponse.step to:", projectData.step);
          setAgentResponse((prevState) => ({
            ...prevState,
            step: projectData.step,
          }));
        }

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

  // Update Step
  useEffect(() => {
    const updateProjectStep = async () => {
      if (!projectId || agentResponse.step === undefined) return;

      const projectRef = doc(db, "projects", projectId);

      try {
        await updateDoc(projectRef, {
          step: agentResponse.step,
        });
      } catch (error) {
        console.error("Error updating project step:", error);
      }
    };

    updateProjectStep();
  }, [agentResponse.step, projectId]);

  const handleRepoSelection = async (repoFullName, token) => {
    console.log("Selected repository:", repoFullName);
    setSelectedRepo(repoFullName);
    setGithubAccessToken(token);

    const url = `https://api.github.com/repos/${repoFullName}/contents`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch repository contents");
      }
      const contentData = await response.json();
      setRepoContent(contentData);

      // Assuming projectId is available in your component's state or props
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        selectedRepo: repoFullName, // Update the selectedRepo field in Firestore
      });
      console.log("Updated selectedRepo in Firestore");
    } catch (error) {
      console.error("Error:", error);
      setRepoContent([]);
    }
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

  // Open File Selector
  const toggleFileSelector = () => {
    setIsFileSelectorOpen(!isFileSelectorOpen);
  };

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
    const selectedFileNames = selectedFilesInParent.map((file) => file.name);
    const selectedFileURLs = selectedFilesInParent.map((file) => file.git_url);

    const payload = {
      session_id,
      input: userInput,
      chat_history: [],
      docslink: docsLink,
      vertical: vertical,
      repo: selectedRepo,
      project: projectId,
      suggested_files: selectedFileNames,
      suggested_file_urls: selectedFileURLs,
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
        console.log("Updated agentResponse state:", agentResponse);
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
    console.log("files", files);
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
      setBranchName(newBranchName);
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

        for (const file of files) {
          let fileName = file.name;
          const fileContent = file.code;
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

          // Create or update the file in the new branch
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
                sha: sha, // This will be empty if the file does not exist, which is fine
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
        }
      } else {
        console.error("Failed to create the branch.");
        setBranchCreated(false);
      }
    } catch (error) {
      console.error("Error creating new branch:", error);
    }
  };

  // Handle Selected File
  const handleSelectedFiles = (selectedFiles) => {
    setSelectedFilesInParent(selectedFiles);
  };

  // Split List
  const processContentToListItems = (content) => {
    // Ensure content is treated as a string
    const contentAsString = content.toString();
    // Split content by looking for digits followed by a dot and space, capturing the split delimiters
    const items = contentAsString.split(/(?=\d+\. )/);
    return items;
  };

  // Copy to Clipboard
  const copyToClipboard = () => {
    const command = `git checkout ${branchName} && git pull origin ${branchName}`;
    navigator.clipboard.writeText(command).then(
      () => {
        console.log("Command copied to clipboard");
      },
      (err) => {
        console.error("Could not copy command to clipboard", err);
      }
    );
  };

  return (
    <div className="bg-white w-full h-full">
      <Navbar2 />
      <div className="flex min-h-screen w-full h-full items-start flex-col p-4">
        {/* Header */}
        <div className="flex w-full flex-row items-start justify-between">
          <div>
            <div className="font-light text-3xl mb-4">
              {projectName || "Loading..."}
            </div>
            <RepositorySelector
              setFileContent={setFileContent}
              onRepoSelect={handleRepoSelection}
              selectedRepo={selectedRepo}
              setSelectedRepo={setSelectedRepo}
            />
            <IntegrationButton
              selectedFilesInParent={selectedFilesInParent}
              selectedRepo={selectedRepo}
              agentResponse={agentResponse}
              handleInputSubmit={handleInputSubmit}
              toggleFileSelector={toggleFileSelector}
              handleFinalStep={handleFinalStep}
              finalStep={finalStep}
              createNewBranch={createNewBranch}
              branchCreated={branchCreated}
            />
          </div>
          <div>
            <Status
              projectId={projectId}
              status={status}
              updateStatus={updateStatus}
            />
            <ProjectFiles
              projectId={projectId}
              setFiles={setFiles}
              files={files}
            />
          </div>
        </div>
        {/* Input Field */}
        <div className="my-4 flex w-full items-center flex-row justify-between">
          {/* <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your request here"
            className="border-2 border-gray-300 rounded-lg p-2 w-full"
          /> */}
        </div>
        <div className="border-2 bg-gray-100 border-black rounded-lg p-0 w-full h-3/4 overflow-auto">
          {isLoading ? (
            <div>
              <OurProcess
                isRepoSelected={!!selectedRepo}
                currentStep={agentResponse.step}
                filesSelected={selectedFilesInParent.length > 0}
                finalStep={finalStep}
              />
              <div className="flex justify-center flex-col py-8 items-center h-full">
                <div className="loader"></div>
              </div>
            </div>
          ) : (
            <div>
              <OurProcess
                isRepoSelected={!!selectedRepo}
                currentStep={agentResponse.step}
                filesSelected={selectedFilesInParent.length > 0}
                finalStep={finalStep}
              />
              {(() => {
                if (finalStep) {
                  return (
                    <div>
                      {!branchCreated ? (
                        <div className="bg-white p-4 m-4 flex items-center flex-col justify-center">
                          <p className="text-xl text-center p-4 m-4 bg-white">
                            Now all thats left is to create a new branch with
                            your integration, run, and test it. ▶️
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-500  p-4 m-4 flex items-center text-white flex-col justify-center">
                          <div className="text-3xl font-semibold text-center p-4 m-4 text-white">
                            Branch Created! 🎉{" "}
                            <p className="text-lg font-normal">{branchName}</p>
                          </div>
                          <p className=" bg-gray-300 flex items-center gap-2 text-black py-2 px-2 rounded-md">
                            git checkout {branchName} && git pull origin{" "}
                            {branchName}
                            <FontAwesomeIcon
                              className="p-2 rounded-full bg-white hover:bg-gray-100 cursor-pointer"
                              icon={faCopy}
                              onClick={copyToClipboard}
                            />
                          </p>
                        </div>
                      )}
                    </div>
                  );
                } else if (agentResponse.step >= 2 && agentResponse.step <= 7) {
                  switch (agentResponse.step) {
                    case 2:
                      return (
                        <div>
                          <p className="text-xl text-center p-4 m-4 bg-white">
                            To get started, we have created the functions for
                            your integration. Next, we will create the UI
                            elements.
                          </p>
                          <pre className="preStyle m-4 p-4">
                            {agentResponse.content}
                          </pre>
                        </div>
                      );
                    case 3:
                      return (
                        <div>
                          <p className="text-xl text-center p-4 m-4 bg-white">
                            Great! We&apos;ve proposed updates for your UI
                            components based on the integration. Here&apos;s
                            what you can add or update:
                          </p>
                          <pre className="preStyle m-4 p-4">
                            {agentResponse.content}
                          </pre>
                        </div>
                      );
                    case 4:
                      return (
                        <div>
                          <p className="text-xl text-center p-4 m-4 bg-white">
                            We&apos;ve identified the backend endpoints that
                            need to be created or updated. Here are the proposed
                            backend endpoints for your integration:
                          </p>
                          <pre className="preStyle m-4 p-4">
                            {agentResponse.content}
                          </pre>
                        </div>
                      );
                    case 5:
                      return (
                        <div>
                          <p className="text-xl text-center p-4 m-4 bg-white">
                            Make sure you have your API Key and have placed it
                            in your environment variables!
                          </p>
                          <div className="m-4 p-4">
                            {agentResponse.content && (
                              <ul className="border-2 p-2 bg-white rounded-lg">
                                {processContentToListItems(
                                  agentResponse.content
                                ).map((item, index) => (
                                  <li
                                    className="border-b p-2 rounded-lg"
                                    key={index}
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      );
                    case 6:
                      return (
                        <div>
                          <p className="text-xl text-center p-4 m-4 bg-white">
                            We have created integration tests that you can run
                            to check the status of your integration.
                          </p>
                          <pre className="preStyle m-4 p-4">
                            {agentResponse.content}
                          </pre>
                        </div>
                      );
                    case 7:
                      return (
                        <div>
                          <p className="text-xl text-center p-4 m-4 bg-white">
                            Based on your codebase, here are a list of things
                            that may be impacted by this integration. Consider
                            these moving forward in your project.
                          </p>
                          {agentResponse.content && (
                            <ul className="border-2 p-2 bg-white rounded-lg">
                              {processContentToListItems(
                                agentResponse.content
                              ).map((item, index) => (
                                <li
                                  className="border-b p-2 rounded-lg"
                                  key={index}
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    default:
                      return null;
                  }
                } else if (selectedFilesInParent.length > 0) {
                  return (
                    <div>
                      <p className="text-xl text-center p-4 m-4 bg-white">
                        Here are the files you have selected for integration:
                      </p>
                      <div className="m-4">
                        <ul>
                          {selectedFilesInParent.map((file, index) => (
                            <li
                              key={index}
                              className="p-2 flex w-fit items-center text-lg gap-2 border bg-white rounded-md mb-2"
                            >
                              <FontAwesomeIcon
                                className="text-gray-600 text-xs"
                                icon={faFile}
                              />
                              {file.name}{" "}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                } else if (selectedRepo) {
                  return (
                    <div className="flex flex-col items-center justify-center pb-4">
                      <div className="text-xl text-center gap-4 p-4 m-4 bg-white">
                        Integrating{" "}
                        <span className="bg-blue-200 p-1 rounded-sm text-blue-600">
                          {projectName}
                        </span>{" "}
                        into{" "}
                        <span className="bg-blue-200 p-1 rounded-sm text-blue-600">
                          {selectedRepo}
                        </span>{" "}
                        🎉
                        <p className="mt-4">Select your files!</p>
                      </div>
                      {isFileSelectorOpen && (
                        <FileSelector
                          isOpen={isFileSelectorOpen}
                          toggleFileSelector={toggleFileSelector}
                          selectedRepo={selectedRepo}
                          githubAccessToken={githubAccessToken}
                          onSave={handleSelectedFiles}
                        />
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <p className="text-xl text-center p-4 m-4 bg-white">
                        Select a Repository to integrate with the{" "}
                        <span className="bg-blue-200 p-1 rounded-sm text-blue-600">
                          {projectName}
                        </span>{" "}
                        API, and let&apos;s get started!🖱️
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Processing;
