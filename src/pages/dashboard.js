import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../app/utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs } from "firebase/firestore";
import Navbar2 from "../app/components/navigation/Navbar2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faEye } from "@fortawesome/free-solid-svg-icons";
import RepoModal from "../app/components/modals/RepoModal";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [repos, setRepos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [userUid, setUserUid] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        setUserUid(user.uid);
        // Fetch user's GitHub repos as before
        const tokenDoc = await getDoc(doc(db, "access_tokens", user.uid));
        if (tokenDoc.exists()) {
          const token = tokenDoc.data().githubAccessToken;
          const response = await fetch("https://api.github.com/user/repos", {
            headers: {
              Authorization: `token ${token}`,
            },
          });
          const data = await response.json();
          setRepos(data);
        } else {
          console.log("No access token found");
        }
        // Fetch user's projects
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().projects) {
          const projectIds = userDoc.data().projects;
          const projectsData = await Promise.all(
            projectIds.map(async (projectId) => {
              const projectDoc = await getDoc(doc(db, "projects", projectId));
              return projectDoc.exists()
                ? { id: projectDoc.id, ...projectDoc.data() }
                : null;
            })
          );
          setProjects(projectsData.filter((project) => project !== null));
        }
      } else {
        router.push("/signUp");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleViewRepo = async (repoFullName) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const tokenDocRef = doc(db, "access_tokens", user.uid);
    const tokenDoc = await getDoc(tokenDocRef);
    if (!tokenDoc.exists()) {
      console.error("No access token found for user:", user.uid);
      return;
    }
    const token = tokenDoc.data().githubAccessToken;

    const url = `https://api.github.com/repos/${repoFullName}/contents`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    setModalContent(data);
    setIsModalOpen(true);
  };

  const handleStartNewProject = () => {
    localStorage.clear(); // Clears the local storage
    router.push("/onboarding/searchProvider");
  };

  return (
    <div className="flex flex-col h-screen w-full font-montserrat bg-slate-900 overflow-hidden">
      <Navbar2 />
      <div className="flex flex-col items-start justify-start w-full p-4">
        {/* {userEmail && (
          <p className="text-white border rounded-lg p-2 my-4">
            Signed in as: {userEmail}
          </p>
        )} */}
        <button
          className="standard-button bg-teal-300 mb-4 m-2 text-slate-900"
          onClick={handleStartNewProject}
        >
          Start New Project
        </button>
        <div>
          <div>
            <h2 className="font-semibold my-2 text-white">Your Repositories</h2>
            <ul
              className="flex overflow-x-auto w-full mb-4 p-2 gap-2 rounded-lg"
              style={{
                scrollbarWidth: "none" /* For Firefox */,
                "-ms-overflow-style":
                  "none" /* For Internet Explorer and Edge */,
                "scrollbar-width": "none" /* For modern browsers */,
              }}
            >
              {repos.map((repo, index) => (
                <li
                  key={index}
                  className="text-white w-40 border rounded-lg p-2 flex items-center justify-between"
                >
                  {repo.name}
                  <div>
                    <FontAwesomeIcon
                      className="p-2 cursor-pointer hover:text-yellow-400"
                      icon={faEye}
                      onClick={() => handleViewRepo(repo.full_name)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold my-2 text-white">Your Projects</h2>
            <ul className="flex overflow-x-auto w-full mb-4 p-2 gap-2 rounded-lg">
              {projects.map((project, index) => (
                <li
                  key={index}
                  className="text-slate-900 justify-between cursor-pointer gap-1 w-40 bg-white border rounded-lg p-2 flex flex-col"
                >
                  <span className="text-lg font-semibold">
                    {project.providerName}
                  </span>
                  <ul>
                    {project.capabilities.map((capability, capIndex) => (
                      <li className="text-sm font-light" key={capIndex}>
                        - {capability}
                      </li>
                    ))}
                  </ul>
                  <div className="text-right">
                    <span className="text-xs font-light">
                      {project.createdAt.toDate().toLocaleDateString()}
                    </span>
                    <div className="flex items-center justify-end">
                      <span className="text-xs font-light">
                        {project.status}
                      </span>
                      {project.status === "In progress" && (
                        <span className="inline-block ml-2 w-2 h-2 bg-teal-300 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <RepoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={modalContent || []}
        userUid={userUid}
      />
    </div>
  );
}
