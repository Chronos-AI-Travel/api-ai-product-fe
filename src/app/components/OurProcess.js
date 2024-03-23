import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const OurProcess = () => {
    return (

        <div className="p-2 my-2 border text-white bg-slate-800 rounded-lg">
                    <p className="m-2 text-md font-bold">
                      <FontAwesomeIcon className="mr-2" icon={faCircleInfo} />
                      Our integration process
                    </p>
                    <hr />
                    <ol className="text-sm flex p-2 flex-row gap-2 w-full">
                      <li className="rounded-lg bg-white text-gray-900 p-2 w-auto">
                        Scan repo for in-scope files
                      </li>
                      <li className="rounded-lg bg-white text-gray-900 p-2 w-auto">
                        Generate functions for integration
                      </li>
                      <li className="rounded-lg bg-white text-gray-900 p-2 w-auto">
                        Generate elements for integration
                      </li>
                      <li className="rounded-lg bg-white text-gray-900 p-2 w-auto">
                        Generate endpoints
                      </li>
                      <li className="rounded-lg bg-white text-gray-900 p-2 w-auto">
                        Key generation
                      </li>
                      <li className="rounded-lg bg-white text-gray-900 p-2 w-auto">
                        Integration test
                      </li>
                      <li className="rounded-lg bg-white text-gray-900 p-2 w-auto">
                        Code check
                      </li>
                      <li className="rounded-lg bg-white text-gray-900 p-2 w-auto">
                        Pull Request
                      </li>
                    </ol>
                  </div>
    )
}
export default OurProcess