import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter

const ActiveProjects = ({ projects }) => {
  const router = useRouter(); // Use the useRouter hook

  // Function to handle click event
  const handleProjectClick = (projectId) => {
    router.push(`/processing?projectId=${encodeURIComponent(projectId)}`);
  };

  return (
    <div>
      <h2 className="font-semibold my-2 text-white">Active Projects</h2>
      <ul className="flex overflow-x-auto w-full mb-4 p-2 gap-2 rounded-lg" style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
        {projects
          .filter((project) => project.status === "In progress")
          .map((project, index) => (
            <li
              key={index}
              className="text-slate-900 justify-between cursor-pointer gap-1 w-40 bg-white border rounded-lg p-2 flex flex-col hover:scale-105 transition-transform duration-200"
              onClick={() => handleProjectClick(project.id)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <span className="text-lg font-semibold">
                  {project.providerName}
                </span>
                <ul>
                  {project.capabilities &&
                  Array.isArray(project.capabilities) ? (
                    project.capabilities.map((capability, capIndex) => (
                      <li className="text-sm font-light" key={capIndex}>
                        - {capability}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm font-light">
                      No capabilities listed
                    </li>
                  )}
                </ul>
              </div>
              <div className="text-right">
                <span className="text-xs font-light">
                  {project.createdAt.toDate().toLocaleDateString()}
                </span>
                <div className="flex items-center justify-end">
                  <span className="text-xs font-light">{project.status}</span>
                  {project.status === "In progress" && (
                    <span className="inline-block ml-2 w-2 h-2 bg-teal-300 rounded-full"></span>
                  )}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ActiveProjects;
