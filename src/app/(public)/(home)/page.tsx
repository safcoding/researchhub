import { HeroSection } from "@/features/public/home/components/mainHero";
import { EventCarousel } from "@/features/public/home/components/eventCarousel";
import { UpcomingConferences } from "@/features/public/home/components/upcomingConferences";
import { getLatestEvents } from "../../../features/public/events/server/events";
import { InfoSection } from "@/features/public/home/components/moreInfo";

export default async function Home() {
  const events = await getLatestEvents(5);

  return (
    <div className="space-y-6">
      <HeroSection/>
      <EventCarousel events={events} />
      <UpcomingConferences />
      <InfoSection />
    </div> 
  );
}