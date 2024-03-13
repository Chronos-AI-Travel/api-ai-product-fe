import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../app/utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        setUserUid(user.uid);
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

  return (
    <div className="flex flex-col text-center text-white font-montserrat bg-slate-900">
      <Navbar2 />
      <div className="h-screen flex items-center justify-start flex-col">
        {userEmail && (
          <p className="text-white border rounded-lg p-2 my-4">
            Signed in as: {userEmail}
          </p>
        )}
        <div>
          <h2 className="font-semibold m-2">Your Repositories</h2>
          <ul className="h-1/2 overflow-y-auto p-2 border rounded-lg">
            {repos.map((repo, index) => (
              <li
                key={index}
                className="text-white flex items-center justify-between"
              >
                {repo.name}
                <div>
                  <FontAwesomeIcon
                    className="p-2 cursor-pointer hover:text-yellow-400"
                    icon={faEye}
                    onClick={() => handleViewRepo(repo.full_name)}
                  />
                  <FontAwesomeIcon className="p-2" icon={faChevronRight} />
                </div>
              </li>
            ))}
          </ul>
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
