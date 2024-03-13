import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/utils/firebaseConfig";

const SelectComponents = () => {
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviderComponents = async () => {
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
          setComponents(providerData.components || []);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching provider components:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderComponents();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center text-white font-montserrat bg-slate-900">
      <div className="h-screen w-2/3 flex items-center justify-center flex-col">
        <p className="text-3xl">Select components of your integration</p>
        <div className="w-full flex items-center justify-start flex-col">
          <ul className="mt-4 w-2/3 text-black">
            {components.map((component, index) => (
              <li key={index} className="px-4 py-2 bg-white text-left rounded my-2">
                {component}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectComponents;
