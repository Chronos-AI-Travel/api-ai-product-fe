import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../app/utils/firebaseConfig";
import { useRouter } from "next/router";

const SelectCapabilities = () => {
  const [capabilities, setCapabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProviderCapabilities = async () => {
      const providerID = localStorage.getItem("selectedProviderID");
      if (!providerID) {
        console.error("No provider ID found");
        setIsLoading(false);
        return;
      }

      const docRef = doc(db, "providers", providerID);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const providerData = docSnap.data();
          const transformedCapabilities = providerData.capabilities.map(
            (name) => ({
              name,
              isSelected: false,
            })
          );
          setCapabilities(transformedCapabilities);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching provider capabilities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderCapabilities();
  }, []);

  const handleCheckboxChange = (index) => {
    const updatedCapabilities = capabilities.map((capability, i) => {
      if (i === index) {
        return { ...capability, isSelected: !capability.isSelected };
      }
      return capability;
    });
    setCapabilities(updatedCapabilities);
  };

  const handleContinue = async () => {
    const selectedCapabilities = capabilities
      .filter((capability) => capability.isSelected)
      .map((capability) => capability.name);
  
    const projectID = localStorage.getItem("projectID");
  
    if (!projectID) {
      console.error("No project ID found");
      return;
    }
  
    // Check if there is a logged-in user before attempting to update the user's document
    if (auth.currentUser) {
      const userID = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userID);
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          let userProjects = userDocSnap.data().projects || [];
          if (!userProjects.includes(projectID)) {
            userProjects.push(projectID); // Add the new project ID to the list
  
            await updateDoc(userDocRef, {
              projects: userProjects,
            });
          }
        } else {
          console.log("User document does not exist!");
        }
      } catch (error) {
        console.error("Error updating user's project list:", error);
        return;
      }
    }
  
    const projectDocRef = doc(db, "projects", projectID);
    try {
      await updateDoc(projectDocRef, {
        capabilities: selectedCapabilities,
      });
      router.push("/signUp");
    } catch (error) {
      console.error("Error updating project with selected capabilities:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center text-white font-montserrat bg-slate-900">
      <div className="h-screen w-2/3 flex items-center justify-center flex-col">
        <p className="text-3xl">Select capabilities of your integration</p>
        <div className="w-full flex items-center justify-start flex-col">
          <ul className="mt-4 w-2/3 text-black">
            {capabilities.map((capability, index) => (
              <li
                key={index}
                className="px-4 py-2 bg-white rounded my-2 flex items-center"
              >
                <input
                  type="checkbox"
                  checked={capability.isSelected}
                  onChange={() => handleCheckboxChange(index)}
                  className="mr-2"
                />
                {capability.name}
              </li>
            ))}
          </ul>
          <button
            className="standard-button bg-teal-300 text-black"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectCapabilities;
