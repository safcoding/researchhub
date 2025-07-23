import { LearnButton } from "./learnButton";
import Image from "next/image";

const HeroSection = () => {

  return (
    <section className="relative overflow-hidden py-60">
      <div className="absolute inset-0">
        <Image
          alt="background"
          src="https://mjiit.utm.my/wp-content/uploads/2024/12/mjiit-building-front-scaled.jpg"
          className="h-[120%] w-full object-cover scale-110  blur-[2px]"
            width={1920}
            height={120}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#046951]/80 via-[#046951]/60  to-gray-50"></div>
      </div>
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-pretty lg:text-7xl text-white">
                MJIIT ResearchHub
              </h1>
              <p className="mx-auto max-w-3xl text-white/90 lg:text-xl">
                Welcome to the MJIIT ResearchHub – 
                a centralized platform designed exclusively for the researchers of the Malaysia-Japan International Institute of Technology (MJIIT). 
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <LearnButton href="/about" title="Learn more about us" variant="outline" size="lg" />
              <LearnButton href="/partners" title="Our partners" variant="outline" size="lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HeroSection };