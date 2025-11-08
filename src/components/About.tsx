import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";

const About = () => {
  const tiles = [
    {
      image: team1,
      title: "Nicholas Newark named board director",
      desc: "Nicholas has been at the forefront of pet nutrition for over 15 years, bringing expertise and dedication to helping pets live healthier, happier lives.",
      bgColor: "bg-blue-100",
    },
    {
      image: team2,
      title: "Anything is Pawsible fundraiser successful",
      desc: "Thanks to our community's generous support, we raised funds to help provide nutritious meals for shelter pets across the region.",
      bgColor: "bg-yellow-100",
    },
    {
      image: team3,
      title: "Annual Pet Show registration begins",
      desc: "Register your pet for our annual showcase celebrating the bond between pets and their families. Prizes and fun for all!",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <section className="py-16 bg-primary" style={{ minHeight: "100vh" }}>
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black text-center text-primary-foreground mb-12">
          About Dumas 'N' Bismi
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiles.map((tile, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-2xl transition-all hover:scale-105">
              <div className={`h-48 ${tile.bgColor} rounded-t-xl overflow-hidden p-4 flex items-center justify-center`}>
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-36 h-36 object-cover rounded-3xl shadow-lg"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-xl">{tile.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tile.desc}</p>
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-primary-foreground space-y-2">
          <p className="text-lg font-semibold">
            TRY OUR 4 STEP BUY CALCULATORS FOR PET NUTRITION.
          </p>
          <p className="text-base">
            ALL DUMAS TREATS ARE NON-GMO | WHEAT FREE | NO SOY
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
