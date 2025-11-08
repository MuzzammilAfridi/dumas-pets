import { FileText, Gift, PawPrint } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      icon: FileText,
      title: "For Newbies:",
      subtitle: "Who We Are and What We Do",
    },
    {
      icon: Gift,
      title: "For Newbies:",
      subtitle: "Who We Are and What We Do",
    },
    {
      icon: PawPrint,
      title: "For Newbies:",
      subtitle: "Who We Are and What We Do",
    },
  ];

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black text-center text-primary-foreground mb-12">
          Resource Kits and Documents
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {resources.map((resource, idx) => {
            const Icon = resource.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center space-y-4 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center shadow-xl">
                  <Icon className="w-16 h-16 text-primary" />
                </div>
                <div>
                  <p className="text-primary-foreground font-bold text-lg">{resource.title}</p>
                  <p className="text-primary-foreground/90">{resource.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-primary-foreground/80 mt-12 max-w-3xl mx-auto">
          OUR GOAL IS TO PROVIDE WELLNESS & HAPPINESS TO YOUR PETS BY PROVIDING QUALITY NUTRITION RICH IN FRUITS
        </p>
      </div>
    </section>
  );
};

export default Resources;
