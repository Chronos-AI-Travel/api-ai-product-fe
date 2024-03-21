import React, { useState, useEffect } from "react";
import RepoModal from "../../app/components/modals/RepoModal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/utils/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const RepositorySelector = ({ setFileContent, onRepoSelect }) => {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userUid, setUserUid] = useState(null);
  const [repos, setRepos] = useState([]);
  const [repoContent, setRepoContent] = useState([]);
  const [selectedFilesContent, setSelectedFilesContent] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);

  // useEffect(() => {
  //   console.log("selectedFilesContent", selectedFilesContent);
  // }, [selectedFilesContent]);

  // const extractFileName = (url) => {
  //   return url.split("/").pop(); // Get the last segment of the URL
  // };

  const triggerIndexing = async () => {
    if (!selectedRepo) {
      alert("Please select a repository first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/index/repository", {
        // Adjust the URL as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repo: selectedRepo,
        }),
      });

      const data = await response.json();
      console.log(data.message);
      alert(data.message);
    } catch (error) {
      console.error("Failed to index repository:", error);
      alert("Failed to index the repository. Please try again.");
    }
  };

  useEffect(() => {
    const allContent = selectedFilesContent
      .map((file) => file.content)
      .join("\n");
    setFileContent(allContent); // Update the parent component's state with the concatenated content
  }, [selectedFilesContent, setFileContent]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const tokenDoc = await getDoc(doc(db, "access_tokens", user.uid));
        if (tokenDoc.exists()) {
          const token = tokenDoc.data().githubAccessToken;
          const response = await fetch("https://api.github.com/user/repos", {
            headers: {
              Authorization: `token ${token}`,
            },
          });
          const reposData = await response.json();
          setRepos(reposData);
        } else {
          console.log("No access token found");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSelectFiles = (files) => {
    setIsModalOpen(false); // Close the modal
    setSelectedFilesContent(files); // Update state with selected files' content
    setCurrentFile(null); // Reset the current file selection
  };

  const handleRepoChange = async (e) => {
    const repoFullName = e.target.value;
    setSelectedRepo(repoFullName);
    // setIsModalOpen(true);

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const tokenDoc = await getDoc(doc(db, "access_tokens", user.uid));
      if (tokenDoc.exists()) {
        const token = tokenDoc.data().githubAccessToken;
        onRepoSelect(repoFullName, token);
        const url = `https://api.github.com/repos/${repoFullName}/contents`;
        const response = await fetch(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        const contentData = await response.json();
        setRepoContent(contentData);
      } else {
        console.log("No access token found");
      }
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFileClick = (file) => {
    if (currentFile && file.url === currentFile.url) {
      setCurrentFile(null);
    } else {
      setCurrentFile(file);
    }
  };

  return (
    <div className="flex gap-2 h-10">
      <div className="flex gap-2 h-10  relative">
        <select
          onChange={handleRepoChange}
          value={selectedRepo}
          className="border-black bg-white rounded-lg hover:bg-gray-300 cursor-pointer border mb-0 h-10 appearance-none outline-none shadow-black shadow-sm pl-3 pr-8"
        >
          <option value="">Select a Repository</option>
          {repos.map((repo, index) => (
            <option key={index} value={repo.full_name}>
              {repo.name}
            </option>
          ))}
        </select>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="absolute right-2 top-3 pointer-events-none"
        />
      </div>
      {/* <button
      onClick={triggerIndexing}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Index Selected Repository
    </button> */}
      {isModalOpen && (
        <RepoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          content={repoContent}
          userUid={userUid}
          onSelectFiles={handleSelectFiles}
        />
      )}
      {/* <div className="border p-2 rounded-lg mb-4">
        <h2>Selected Files for Integration:</h2>
        <ul>
          {selectedFilesContent.map((file, index) => (
            <li
              key={index}
              className="border p-2 rounded-lg bg-gray-50 cursor-pointer flex flex-row justify-between items-center"
              onClick={() => handleFileClick(file)}
            >
              {extractFileName(file.url)} <FontAwesomeIcon icon={faPlus} />
            </li>
          ))}
        </ul>
        {currentFile && (
          <div>
            <pre>{currentFile.content}</pre>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default RepositorySelector;
