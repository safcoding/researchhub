"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LearnButton } from "./learnButton";

const programs = [
  { 
    title: 'MJIIT Publication Achievements', 
    icon: '🎓', 
    description: 'Discover more about MJIIT research utilities.',
    route: '/publications' 
  },
  { 
    title: 'MJIIT Grant Achievements', 
    icon: '🌏', 
    description: 'Explore our research funding and grant achievements.',
    route: '/grants' 
  },
  { 
    title: 'Research Labs in MJIIT', 
    icon: '🔬', 
    description: 'Learn about our state-of-the-art research facilities.',
    route: '/labs' 
  },
];

const InfoSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="text-4xl mb-2">{program.icon}</div>
                <CardTitle className="text-xl">{program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {program.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <LearnButton 
                  href={program.route}
                  title="Learn more"
                  variant="default"
                  size="sm"
                  showIcon={true}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>     
  );
};

export { InfoSection }