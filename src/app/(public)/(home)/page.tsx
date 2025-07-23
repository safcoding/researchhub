import { HeroSection } from "@/features/public/home/components/mainHero";
import { EventCarousel } from "@/features/public/home/components/eventCarousel";
import { UpcomingConferences } from "@/features/public/home/components/upcomingConferences";
import { getLatestEvents } from "../../../features/public/events/server/events";
import { InfoSection } from "@/features/public/home/components/moreInfo";
import { PartnerLogoMarquee } from "@/features/public/partners/components/logoMarquee";
import { getPartners } from "@/features/public/partners/server/partners";

export default async function Home() {
  const events = await getLatestEvents(5);
  const partners = await getPartners();

  return (
    <div>
      <HeroSection/>
      <EventCarousel events={events} />
      <PartnerLogoMarquee partners={partners.data}/>
      <UpcomingConferences />
      <InfoSection />
    </div> 
  );
}