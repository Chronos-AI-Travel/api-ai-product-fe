import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../app/utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { Navbar } from "../app/components/navigation/NavBar";

export default function SignedIn() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(""); // State to store the user's email

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Set the user's email if signed in
      } else {
        router.push("/signUp"); // Optionally redirect to sign-up page if not signed in
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col text-center text-white font-montserrat bg-slate-900">
      <Navbar />
      <div className="h-screen flex items-center justify-center flex-col">
        {userEmail && (
          <p className="text-white mt-4">Signed in as: {userEmail}</p>
        )}
      </div>
    </div>
  );
}
