import { Mail, AlertCircle, Headphones, HelpCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const Contact = () => {
  const contacts = [
    {
      icon: Mail,
      title: "REPORT INCIDENT",
      phone: "123-456-7890",
    },
    {
      icon: AlertCircle,
      title: "HR CONCERNS",
      phone: "123-456-7890",
    },
    {
      icon: Headphones,
      title: "TECH SUPPORT",
      phone: "123-456-7890",
    },
    {
      icon: HelpCircle,
      title: "COMPANY HELPDESK",
      phone: "123-456-7890",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black text-center text-foreground mb-12">
          Don't hesitate to contact us
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contacts.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <Card key={idx} className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                <CardContent className="p-8 bg-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary-foreground rounded-lg flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-primary-foreground font-bold text-sm mb-1">
                        {contact.title}
                      </p>
                      <p className="text-primary-foreground text-2xl font-black">
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;
