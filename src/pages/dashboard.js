import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../app/utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs } from "firebase/firestore";
import Navbar2 from "../app/components/navigation/Navbar2";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye } from "@fortawesome/free-solid-svg-icons";
import RepoModal from "../app/components/modals/RepoModal";
import ActiveProjects from "../app/components/dashboard/ActiveProjects";
import YourNews from "../app/components/dashboard/YourNews";
import CompletedProjects from "../app/components/dashboard/CompletedProjects";
import OpenRequests from "../app/components/dashboard/OpenRequests";
// import YourRepositories from "../app/components/dashboard/YourRepositories";

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

  // const handleViewRepo = async (repoFullName) => {
  //   const user = auth.currentUser;
  //   if (!user) {
  //     console.error("User not authenticated");
  //     return;
  //   }

  //   const tokenDocRef = doc(db, "access_tokens", user.uid);
  //   const tokenDoc = await getDoc(tokenDocRef);
  //   if (!tokenDoc.exists()) {
  //     console.error("No access token found for user:", user.uid);
  //     return;
  //   }
  //   const token = tokenDoc.data().githubAccessToken;

  //   const url = `https://api.github.com/repos/${repoFullName}/contents`;
  //   const response = await fetch(url, {
  //     headers: {
  //       Authorization: `token ${token}`,
  //     },
  //   });
  //   const data = await response.json();
  //   console.log(data);
  //   setModalContent(data);
  //   setIsModalOpen(true);
  // };

  const handleStartNewProject = () => {
    localStorage.clear(); // Clears the local storage
    router.push("/onboarding/searchProvider");
  };

  return (
    <div className="flex flex-col h-full min-h-screen w-full font-montserrat bg-slate-900 overflow-hidden px-4">
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
          {/* <YourRepositories repos={repos} handleViewRepo={handleViewRepo} /> */}
          <ActiveProjects projects={projects} />
          <OpenRequests userUid={userUid} /> {/* Pass userUid as a prop */}
          <CompletedProjects projects={projects} />
          <YourNews />
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
