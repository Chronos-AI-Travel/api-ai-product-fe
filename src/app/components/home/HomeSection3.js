import Image from "next/image";

export const HomeSection3 = () => {
  return (
    <div className="h-full bg-white py-10 px-10 flex flex-col text-center justify-between  items-center">
      <div>
        <div className="text-sm fontlight text-gray-400 uppercase">
          Solution
        </div>
        <div className="text-3xl fontlight text-gray-900 mb-10">
          Travel API Artifical Intelligence
        </div>
      </div>
      <div className="flex items-center flex-col w-full h-full">
        <div className="bg-blue-500 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-start text-left w-full h-full m-4">
          <p className="uppercase text-gray-200 text-xs">
            Travel API context driven AI automated integrations
          </p>
          <div className="flex flex-row h-full gap-10">
            <p className="text-white text-xl w-full">
              Our product uses an AI model to run the integration; add your code
              base and API you wish to integrate and let us do the work.
            </p>
            <div className="relative rounded-lg w-full h-40">
              <Image
                fill
      style={{objectFit:"cover"}}
                alt="waiting"
                className="rounded-xl"
                src={"/Speed.webp"}
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-200 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-start text-left w-full h-full m-4">
          <p className="uppercase text-gray-500 text-xs">
            UI builder (coming soon){" "}
          </p>
          <div className="flex h-full gap-10">
            <p className="text-black text-xl w-full">
              Our product lets you know whether the API you wish to integrate to
              offers more capabilities than your front end has available. All
              you have to do is click one button and we build the UI components
              for you to add to your front end, so you can make use of all the
              richness each API has to offer. Example: You’re integrating to an
              API that enables your customers to search and book flights. The
              API also offers CO2 emission content for each flight, but you
              don’t have that UI component in your UI. Easy, one click and we
              build that code for you so your customer can enjoy that extra
              feature!
            </p>
          </div>
        </div>
        <div className="bg-blue-200 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-start text-left w-full h-full m-4">
          <p className="uppercase text-gray-500 text-xs">
            API Upgrade (coming soon)
          </p>
          <div className="flex h-full gap-10">
            <p className="text-black text-xl w-full">
              Tired of constantly trying to understand whether to upgrade to the
              latest version of an API, we do it automatically for you; we
              provide you a summary of what’s included and you decide with one
              click whether to upgrade or not - we do the rest.
            </p>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};
