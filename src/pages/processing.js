import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../app/utils/firebaseConfig'; // Adjust the import path as necessary
import Navbar2 from "../app/components/navigation/Navbar2";

const Processing = () => {
  const [projectName, setProjectName] = useState('');
  const router = useRouter();
  const { projectId } = router.query;

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return; // Exit early if projectId is undefined
      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProjectName(docSnap.data().providerName); // Assuming the project name is stored under providerName
      } else {
        console.log("No such document!");
      }
    };

    fetchProject();
  }, [projectId]); // Re-run the effect if projectId changes

  return (
    <div className="bg-white h-full">
      <Navbar2 />
      <div className="flex h-screen items-start justify-start flex-col p-4">
        <div className="font-light text-3xl mb-4">{projectName || 'Loading...'}</div>
        <div className="border-2 border-black rounded-lg p-4 w-full h-3/4">Kanban Placeholder</div>
      </div>
    </div>
  );
};

export default Processing;