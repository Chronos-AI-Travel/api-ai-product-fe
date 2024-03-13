import React from "react";
import { auth, provider, db } from "../app/utils/firebaseConfig"; // Make sure to import 'db' for Firestore
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router"; // Import useRouter
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();

  const handleSignUpWithGithub = async () => {
    try {
      // Request additional GitHub scopes like 'repo'
      provider.addScope('repo');

      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken; // GitHub Access Token

      const user = result.user;
      console.log("Signed in user:", user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        createdAt: serverTimestamp(),
        email: user.email,
      });

      console.log("User document created in Firestore");

      // Use the GitHub Access Token to fetch the list of repositories
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const repos = await response.json();
      console.log("Repositories:", repos.map(repo => repo.full_name));

      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing up with GitHub or creating user document:", error.message);
    }
  };

  return (
    <div className="flex flex-col text-center text-white font-montserrat bg-slate-900">
      <div className="h-screen flex items-center justify-center  flex-col">
        <Image src={"/Logo.webp"} height={100} width={100} alt="logo" />

        <button
          onClick={handleSignUpWithGithub}
          className="bg-white flex flex-row items-center justify gap-3 mt-10 standard-button text-sm text-black"
        >
          <Image src={"/GitHub.webp"} width={40} height={40} alt="github" />
          Get Started with GitHub
        </button>
      </div>
    </div>
  );
}
