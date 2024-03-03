import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col text-3xl gap-4 font-montserrat h-screen justify-center items-center bg-white">
      <div>Future home of API AI Product</div>
      <Image
        src="/UnderConstruction.png"
        alt="Under Construction"
        width={200}
        height={200}
      />
    </div>
  );
}
