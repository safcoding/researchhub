import { HeroSection } from "@/features/public/home/components/mainHero";
import { EventCarousel } from "@/features/public/home/components/eventCarousel";
import { UpcomingConferences } from "@/features/public/home/components/conference";
import { getLatestEvents } from "../../features/public/events/server/events";

export default async function Home() {
  const events = await getLatestEvents(5);

  return (
    <div className="space-y-32">
      <HeroSection/>
      <EventCarousel events={events} />
      <UpcomingConferences />
    </div> 
  );
}