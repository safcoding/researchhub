import { HeroSection } from "./_components/mainHero";
import { EventCarousel } from "./_components/eventCarousel";
import { UpcomingConferences } from "./_components/conference";
import { getLatestEvents } from "./_actions/events";

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