import Image from "next/image";

export const HomeSection2 = () => {
  return (
    <div className="h-full bg-white py-10 px-10 flex flex-col text-center justify-between  items-center">
      <div>
        <div className="text-sm fontlight text-gray-400 uppercase">
          Benefits
        </div>

        <div className="text-4xl mb-10 fontlight text-gray-900">
          Imagine if you could do your yearly API integrations… in one week...
          welcome to reality!
        </div>
      </div>
      <div className="flex items-center flex-col md:flex-row lg:flex-row w-full h-1/2">
        <div className="bg-black flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-between text-left w-full h-80 m-4">
          <p className="uppercase text-gray-300 text-lg">Save time</p>

          <div className="relative rounded-lg w-full h-40">
            <Image
              fill
              style={{ objectFit: "cover" }}
              alt="waiting"
              className="rounded-xl"
              src={"/Sell.webp"}
            />
          </div>
        </div>
        <div className="bg-blue-300 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-between text-left w-full h-80 m-4">
          <p className="uppercase text-black text-lg">
            Sell travel content faster
          </p>

          <div className="relative rounded-lg w-full h-40">
            <Image
              fill
              style={{ objectFit: "cover" }}
              alt="waiting"
              className="rounded-xl"
              src={"/Speed.webp"}
            />
          </div>
        </div>
        <div className="bg-gray-300 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-between text-left w-full h-80 m-4">
          <p className="uppercase text-black text-lg">Reduce cost</p>

          <div className="relative rounded-lg w-full h-40">
            <Image
              fill
              style={{ objectFit: "cover" }}
              alt="waiting"
              className="rounded-xl"
              src={"/Save.webp"}
            />
          </div>
        </div>
        <div className="bg-blue-500 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-between text-left w-full h-80 m-4">
          <p className="uppercase text-gray-200 text-lg">
            Eliminate travel jargon & complexity
          </p>

          <div className="relative rounded-lg w-full h-40">
            <Image
              fill
              style={{ objectFit: "cover" }}
              alt="waiting"
              className="rounded-xl"
              src={"/Complex.webp"}
            />
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};
