import Marquee from "react-fast-marquee";

interface Partner {
  partner_id: string;
  name: string;
  image: string;
}

export function PartnerLogoMarquee({ partners }: { partners: Partner[] }) {
  return (
    <div className="mx-auto max-w-7xl py-32">
        <h2 className="text-5xl font-bold mb-8 text-center" style={{color: "#159b8a"}}>Our Partners</h2>
        
        <div className="space-y-4">
    <Marquee pauseOnHover gradient={false} speed={40}>
      {partners.map((partner) => (
        <div key={partner.partner_id} className="mx-8 flex items-center">
          <img
            src={partner.image}
            alt={partner.name}
            className="h-20 w-auto object-contain"
            style={{ maxWidth: 180 }}
          />
        </div>
      ))}
    </Marquee>
    </div>
    </div>
  );
}