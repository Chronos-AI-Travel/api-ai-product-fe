import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const YourRepositories = ({ repos, handleViewRepo }) => {
  return (
    <div>
      <h2 className="font-semibold my-2 text-white">Your Repositories</h2>
      <div className="flex overflow-x-auto w-full">
        <ul
          className="flex overflow-x-auto w-full mb-4 p-2 gap-2 rounded-lg"
          style={{
            scrollbarWidth: "none", /* For Firefox */
            "-ms-overflow-style": "none", /* For Internet Explorer and Edge */
            "scrollbarWidth": "none", /* For modern browsers */
          }}
        >
          {repos.map((repo, index) => (
            <li
              key={index}
              className="text-white w-40 border rounded-lg p-2 flex items-center justify-between"
            >
              {repo.name}
              <div>
                <FontAwesomeIcon
                  className="p-2 cursor-pointer hover:text-yellow-400"
                  icon={faEye}
                  onClick={() => handleViewRepo(repo.full_name)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default YourRepositories;