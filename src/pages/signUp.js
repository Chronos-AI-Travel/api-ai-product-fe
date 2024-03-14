import React, { useEffect, useState } from "react";
import { auth, provider, db } from "../app/utils/firebaseConfig";
import {
  signInWithPopup,
  GithubAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        setCheckingStatus(false); // Done checking status
        if (user) {
          router.push("/dashboard");
        }
      }, 1000); // 1000 milliseconds = 1 second
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignUpWithGithub = async () => {
    try {
      provider.addScope("repo");

      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken; // GitHub Access Token
      const user = result.user;
      const projectID = localStorage.getItem("projectID");
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const existingProjects = userDoc.data().projects || [];
        if (projectID && !existingProjects.includes(projectID)) {
          await updateDoc(userDocRef, {
            projects: [...existingProjects, projectID],
          });
        }
      } else {
        await setDoc(userDocRef, {
          uid: user.uid,
          createdAt: serverTimestamp(),
          email: user.email,
          projects: projectID ? [projectID] : [],
        });
      }

      await setDoc(doc(db, "access_tokens", user.uid), {
        githubAccessToken: token,
        createdAt: serverTimestamp(),
      });

      if (projectID) {
        const projectDocRef = doc(db, "projects", projectID);
        await updateDoc(projectDocRef, {
          createdBy: user.uid, // Add the user's document ID to the project document
        });
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Error during sign up or storing access token:",
        error.message
      );
    }
  };

  return (
    <div className="flex flex-col text-center text-white font-montserrat bg-slate-900">
      <div className="h-screen flex items-center justify-center flex-col">
        <Image src={"/Logo.webp"} height={100} width={100} alt="logo" />
        {checkingStatus ? (
          <p className="mt-10 text-sm text-white">Checking status...</p>
        ) : (
          <div className="flex w-11/12 flex-col items-center justify-center">
            <p>
              Chronos requires access to your relevent repositories so that it
              can process the integration effectively.
            </p>
            <button
              onClick={handleSignUpWithGithub}
              className="bg-white flex flex-row items-center justify gap-3 mt-10 standard-button text-sm text-black"
            >
              <Image src={"/GitHub.webp"} width={40} height={40} alt="github" />
              Continue with GitHub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
