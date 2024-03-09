import Image from "next/image";

export const HomeSection1 = () => {
  return (
    <div className="h-screen bg-white py-20 px-10 flex flex-col text-center justify-between  items-center">
      <div>
        <div className="text-sm fontlight text-gray-400 uppercase">Problem</div>
        <div className="text-4xl mb-20 fontlight text-gray-900">
          Integrating is slow, and expensive
        </div>
      </div>
      <div className="flex items-center flex-col md:flex-row lg:flex-row w-full h-full">
        <div className="bg-gray-300 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-start text-left w-full h-full m-4">
          <p className="uppercase text-gray-500 text-xs">
            Say goodbye to waiting
          </p>
          <p className="text-black text-xl">
            On average, it takes 1-2 months to integrate with a Travel API,
            that’s anywhere between £10,000 - £20,000.
          </p>
          <div className="relative rounded-lg w-full h-full">
            <Image
              layout="fill"
              objectFit="cover"
              alt="waiting"
              className="rounded-xl"
              src={"/Waiting.webp"}
            />
          </div>
        </div>
        <div className="bg-blue-500 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-start text-left w-full h-full m-4">
          <p className="uppercase text-gray-200 text-xs">
            Rapid content integration
          </p>
          <p className="text-white text-xl">
            Our technology enables you to integrate with ANY travel related API
            in 24 hours, at a fraction of the cost.
          </p>
          <div className="relative rounded-lg w-full h-full">
            <Image
              layout="fill"
              objectFit="cover"
              alt="waiting"
              className="rounded-xl"
              src={"/Rapid.webp"}
            />
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};
