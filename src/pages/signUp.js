import React from "react";
import { auth, provider, db } from "../app/utils/firebaseConfig";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();

  const handleSignUpWithGithub = async () => {
    try {
      provider.addScope('repo');

      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken; // GitHub Access Token

      const user = result.user;

      // Store user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        createdAt: serverTimestamp(),
        email: user.email,
      });

      // Store the GitHub access token in Firestore under 'access_tokens' collection
      await setDoc(doc(db, "access_tokens", user.uid), {
        githubAccessToken: token,
        createdAt: serverTimestamp(), // Optional: Store the timestamp of when the token was saved
      });

      router.push('/dashboard');
    } catch (error) {
      console.error("Error during sign up or storing access token:", error.message);
    }
  };

  return (
    <div className="flex flex-col text-center text-white font-montserrat bg-slate-900">
      <div className="h-screen flex items-center justify-center flex-col">
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