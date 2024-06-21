import Countdown from "@/components/Countdown";
import SlappableImage from "../components/SlappableImage";

export default function Home() {
  const targetDate = "2024-10-31T00:00:00Z";

  return (
    <div className="flex flex-col bg-white h-screen">
      <Countdown targetDate={targetDate} />
      <div className="flex flex-col items-center justify-center h-full w-full bg-white">
        <h1 className="font-inter text-3xl font-bold text-blue-800">
          AYTEK{" "}
          <span className="font-inter text-2xl text-black">
            Hayatımızdan Çıksın!
          </span>
        </h1>
        <SlappableImage />
      </div>
    </div>
  );
}
