import React from "react";
import { auth, provider, db } from "../app/utils/firebaseConfig"; // Make sure to import 'db' for Firestore
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router"; // Import useRouter
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();

  const handleSignUpWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = result.credential;
      // const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      console.log("Signed in user:", user);

      // Create or update the user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        createdAt: serverTimestamp(), 
        email: user.email,
      });

      console.log("User document created in Firestore");

      // Redirect to SignedIn page after successful sign-up and document creation
      router.push('/signedInTemp');
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
