import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../app/utils/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

export default function SignedIn() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(""); // State to store the user's email

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Set the user's email if signed in
      } else {
        router.push('/signUp'); // Optionally redirect to sign-up page if not signed in
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      router.push('/signUp');
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="flex flex-col text-center text-white font-montserrat bg-slate-900">
      <div className="h-screen flex items-center justify-center flex-col">
        <Image src={"/Logo.webp"} height={100} width={100} alt="logo" />
        {userEmail && <p className="text-white mt-4">Signed in as: {userEmail}</p>} {/* Display the user's email */}
        <button
          onClick={handleSignOut}
          className="bg-white flex flex-row items-center justify gap-3 mt-10 standard-button text-sm text-black"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}