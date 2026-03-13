import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import {
  Dog, Cat, Baby, Activity, Heart, Scale, Target, ChevronLeft, ChevronRight,
  Sparkles, ShoppingCart, RefreshCw, Save, Search, Zap, Leaf, Shield, Bone,
  Sun, Moon, Coffee
} from "lucide-react";

const STEPS = [
  "Pet Type", "Breed", "Age", "Weight",
  "Activity Level", "Health Conditions", "Food Preference", "Feeding Goal"
];

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "Bulldog",
  "Poodle", "Beagle", "Rottweiler", "Husky", "Doberman", "Boxer",
  "Dachshund", "Shih Tzu", "Pug", "Cocker Spaniel", "Indie",
  "Great Dane", "Border Collie", "Dalmatian"
];

const CAT_BREEDS = [
  "Persian", "Maine Coon", "Siamese", "Bengal", "British Shorthair",
  "Ragdoll", "Abyssinian", "Sphynx", "Russian Blue", "Scottish Fold", "Indie"
];

const HEALTH_CONDITIONS = [
  { id: "chicken-allergy", label: "Chicken Allergy", icon: "🍗" },
  { id: "grain-allergy", label: "Grain Allergy", icon: "🌾" },
  { id: "skin-issues", label: "Skin Issues", icon: "🩹" },
  { id: "digestive", label: "Digestive Sensitivity", icon: "💊" },
  { id: "joint-support", label: "Joint Support Needed", icon: "🦴" },
  { id: "none", label: "None", icon: "✅" },
];

interface PlanData {
  petType: "dog" | "cat" | "";
  breed: string;
  ageCategory: string;
  exactAge: string;
  weight: number[];
  activityLevel: string;
  healthConditions: string[];
  foodPreference: string;
  feedingGoal: string;
}

const NutritionPlan = () => {
  const [wizardStarted, setWizardStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [breedSearch, setBreedSearch] = useState("");
  const wizardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [plan, setPlan] = useState<PlanData>({
    petType: "",
    breed: "",
    ageCategory: "",
    exactAge: "",
    weight: [15],
    activityLevel: "",
    healthConditions: [],
    foodPreference: "",
    feedingGoal: "",
  });

  const updatePlan = (key: keyof PlanData, value: any) => {
    setPlan(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!plan.petType;
      case 1: return !!plan.breed;
      case 2: return !!plan.ageCategory;
      case 3: return plan.weight[0] > 0;
      case 4: return !!plan.activityLevel;
      case 5: return plan.healthConditions.length > 0;
      case 6: return !!plan.foodPreference;
      case 7: return !!plan.feedingGoal;
      default: return false;
    }
  };

  const startWizard = () => {
    setWizardStarted(true);
    setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const generatePlan = () => setShowResult(true);

  const editPlan = () => {
    setShowResult(false);
    setCurrentStep(0);
  };

  const getWeightCategory = (w: number) => {
    if (plan.petType === "cat") {
      if (w < 3) return { label: "Underweight", color: "bg-secondary text-secondary-foreground" };
      if (w <= 6) return { label: "Ideal", color: "bg-primary text-primary-foreground" };
      return { label: "Overweight", color: "bg-destructive text-destructive-foreground" };
    }
    if (w < 10) return { label: "Underweight", color: "bg-secondary text-secondary-foreground" };
    if (w <= 35) return { label: "Ideal", color: "bg-primary text-primary-foreground" };
    return { label: "Overweight", color: "bg-destructive text-destructive-foreground" };
  };

  const getDailyGrams = () => {
    const base = plan.petType === "cat" ? plan.weight[0] * 30 : plan.weight[0] * 20;
    const actMult = plan.activityLevel === "high" ? 1.3 : plan.activityLevel === "moderate" ? 1.1 : 0.9;
    const goalMult = plan.feedingGoal === "weight-gain" ? 1.2 : plan.feedingGoal === "weight-loss" ? 0.8 : 1;
    return Math.round(base * actMult * goalMult);
  };

  const getInsights = () => {
    const insights: { label: string; icon: React.ReactNode }[] = [];
    if (plan.activityLevel === "high" || plan.feedingGoal === "muscle")
      insights.push({ label: "High Protein Needed", icon: <Zap className="w-3.5 h-3.5" /> });
    if (plan.feedingGoal === "weight-loss")
      insights.push({ label: "Low Carb Diet", icon: <Leaf className="w-3.5 h-3.5" /> });
    if (plan.healthConditions.includes("grain-allergy"))
      insights.push({ label: "Grain Free Recommended", icon: <Shield className="w-3.5 h-3.5" /> });
    if (plan.healthConditions.includes("joint-support"))
      insights.push({ label: "Joint Support Diet", icon: <Bone className="w-3.5 h-3.5" /> });
    if (plan.healthConditions.includes("skin-issues"))
      insights.push({ label: "Omega-3 Rich Diet", icon: <Heart className="w-3.5 h-3.5" /> });
    if (insights.length === 0)
      insights.push({ label: "Balanced Nutrition", icon: <Sparkles className="w-3.5 h-3.5" /> });
    return insights;
  };

  const getRecommendedProducts = () => {
    const food = products.filter(p => p.category === "PET FOOD").slice(0, 3);
    const treats = products.filter(p => p.category === "TREATS").slice(0, 2);
    const cakes = products.filter(p => p.category === "CAKES").slice(0, 1);
    return [...food, ...treats, ...cakes];
  };

  const breeds = plan.petType === "cat" ? CAT_BREEDS : DOG_BREEDS;
  const filteredBreeds = breeds.filter(b =>
    b.toLowerCase().includes(breedSearch.toLowerCase())
  );
  const weightCat = getWeightCategory(plan.weight[0]);

  const toggleHealth = (id: string) => {
    if (id === "none") {
      updatePlan("healthConditions", ["none"]);
    } else {
      const current = plan.healthConditions.filter(h => h !== "none");
      updatePlan("healthConditions",
        current.includes(id) ? current.filter(h => h !== id) : [...current, id]
      );
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            {[
              { type: "dog" as const, icon: <Dog className="w-12 h-12" />, label: "Dog" },
              { type: "cat" as const, icon: <Cat className="w-12 h-12" />, label: "Cat" },
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => { updatePlan("petType", type); updatePlan("breed", ""); nextStep(); }}
                className={`flex flex-col items-center gap-3 p-8 rounded-2xl border-2 transition-all hover:scale-105 ${
                  plan.petType === type
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-primary">{icon}</div>
                <span className="text-lg font-bold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search breed..."
                value={breedSearch}
                onChange={e => setBreedSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {filteredBreeds.map(breed => (
                <button
                  key={breed}
                  onClick={() => { updatePlan("breed", breed); nextStep(); }}
                  className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                    plan.breed === breed
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  {breed}
                </button>
              ))}
            </div>
            <button
              onClick={() => { updatePlan("breed", "Mixed Breed / Not Listed"); nextStep(); }}
              className={`w-full p-3 rounded-xl border-2 border-dashed text-sm font-medium transition-all ${
                plan.breed === "Mixed Breed / Not Listed"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 text-muted-foreground"
              }`}
            >
              ✅ Mixed Breed / Not Listed
            </button>
          </div>
        );

      case 2:
        return (
          <div className="max-w-lg mx-auto space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: "puppy", label: plan.petType === "cat" ? "Kitten" : "Puppy", sub: "0-12 months", icon: <Baby className="w-8 h-8" /> },
                { val: "adult", label: "Adult", sub: "1-7 years", icon: <Activity className="w-8 h-8" /> },
                { val: "senior", label: "Senior", sub: "7+ years", icon: <Heart className="w-8 h-8" /> },
              ].map(({ val, label, sub, icon }) => (
                <button
                  key={val}
                  onClick={() => updatePlan("ageCategory", val)}
                  className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                    plan.ageCategory === val
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-primary">{icon}</div>
                  <span className="font-bold text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground">{sub}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-foreground whitespace-nowrap">Exact age:</Label>
              <Input
                placeholder="e.g. 3 years"
                value={plan.exactAge}
                onChange={e => updatePlan("exactAge", e.target.value)}
                className="max-w-[200px]"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <span className="text-5xl font-bold text-primary">{plan.weight[0]}</span>
              <span className="text-2xl font-medium text-muted-foreground ml-1">kg</span>
            </div>
            <Slider
              value={plan.weight}
              onValueChange={val => updatePlan("weight", val)}
              min={1}
              max={plan.petType === "cat" ? 15 : 80}
              step={0.5}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 kg</span>
              <span>{plan.petType === "cat" ? "15" : "80"} kg</span>
            </div>
            <div className="flex justify-center">
              <Badge className={`text-sm px-4 py-1 ${weightCat.color}`}>{weightCat.label}</Badge>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Label className="text-sm text-foreground">Or enter weight:</Label>
              <Input
                type="number"
                value={plan.weight[0]}
                onChange={e => updatePlan("weight", [Number(e.target.value) || 1])}
                className="w-24"
                min={1}
                max={plan.petType === "cat" ? 15 : 80}
              />
              <span className="text-sm text-muted-foreground">kg</span>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { val: "low", label: "Low Activity", desc: "Mostly rests indoors", icon: "🛋️" },
              { val: "moderate", label: "Moderate", desc: "Regular walks & play", icon: "🚶" },
              { val: "high", label: "High Activity", desc: "Very active & sporty", icon: "🏃" },
            ].map(({ val, label, desc, icon }) => (
              <button
                key={val}
                onClick={() => { updatePlan("activityLevel", val); nextStep(); }}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                  plan.activityLevel === val
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-3xl">{icon}</span>
                <span className="font-bold text-sm text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground text-center">{desc}</span>
              </button>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
            {HEALTH_CONDITIONS.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => toggleHealth(id)}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  plan.healthConditions.includes(id)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 text-foreground"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="max-w-md mx-auto">
            <RadioGroup
              value={plan.foodPreference}
              onValueChange={val => updatePlan("foodPreference", val)}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { val: "chicken", label: "Chicken Based", icon: "🍗" },
                { val: "fish", label: "Fish Based", icon: "🐟" },
                { val: "veg", label: "Veg Mix", icon: "🥦" },
                { val: "custom", label: "Custom Balanced", icon: "⚖️" },
              ].map(({ val, label, icon }) => (
                <Label
                  key={val}
                  htmlFor={val}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                    plan.foodPreference === val
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-3xl">{icon}</span>
                  <span className="font-bold text-sm text-foreground">{label}</span>
                  <RadioGroupItem value={val} id={val} className="sr-only" />
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            {[
              { val: "weight-gain", label: "Weight Gain", icon: <Scale className="w-8 h-8" /> },
              { val: "maintain", label: "Maintain Weight", icon: <Target className="w-8 h-8" /> },
              { val: "weight-loss", label: "Weight Loss", icon: <Activity className="w-8 h-8" /> },
              { val: "muscle", label: "Muscle Strength", icon: <Zap className="w-8 h-8" /> },
            ].map(({ val, label, icon }) => (
              <button
                key={val}
                onClick={() => updatePlan("feedingGoal", val)}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                  plan.feedingGoal === val
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-primary">{icon}</div>
                <span className="font-bold text-sm text-foreground">{label}</span>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // ===================== RESULT SCREEN =====================
  if (showResult) {
    const dailyGrams = getDailyGrams();
    const morning = Math.round(dailyGrams * 0.4);
    const afternoon = Math.round(dailyGrams * 0.35);
    const night = dailyGrams - morning - afternoon;
    const insights = getInsights();
    const recommended = getRecommendedProducts();

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                🎉 Your Personalized Nutrition Plan
              </h1>
              <p className="text-muted-foreground">
                Tailored for your {plan.ageCategory} {plan.breed} ({plan.weight[0]} kg)
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Daily Quantity Card */}
              <Card className="md:col-span-2 border-2 border-primary/20">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> Daily Feeding Plan
                  </h2>
                  <div className="text-center py-4">
                    <span className="text-6xl font-bold text-primary">{dailyGrams}g</span>
                    <p className="text-muted-foreground mt-1">Recommended Daily Quantity</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Morning", grams: morning, icon: <Coffee className="w-5 h-5" /> },
                      { label: "Afternoon", grams: afternoon, icon: <Sun className="w-5 h-5" /> },
                      { label: "Night", grams: night, icon: <Moon className="w-5 h-5" /> },
                    ].map(meal => (
                      <div key={meal.label} className="text-center p-4 rounded-xl bg-muted">
                        <div className="text-primary mb-1 flex justify-center">{meal.icon}</div>
                        <p className="text-2xl font-bold text-foreground">{meal.grams}g</p>
                        <p className="text-xs text-muted-foreground">{meal.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Insights Panel */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-bold text-foreground">Nutrition Insights</h2>
                  <div className="space-y-3">
                    {insights.map((ins, i) => (
                      <Badge key={i} variant="secondary" className="flex items-center gap-2 w-full justify-start px-3 py-2 text-sm">
                        {ins.icon} {ins.label}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Based on your {plan.petType}'s profile, we recommend a diet focused on
                    {plan.healthConditions.includes("grain-allergy") ? " grain-free ingredients" : " balanced nutrition"}
                    {plan.activityLevel === "high" ? " with extra protein for energy" : ""}.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Products */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Recommended Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {recommended.map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 border">
                    <div className="h-32 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-3 space-y-2">
                      <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                      <h3 className="font-bold text-xs leading-tight text-foreground">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{Math.round(dailyGrams / 3)}g / meal</p>
                      <p className="text-sm font-bold text-primary">${product.price.toFixed(2)}</p>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="flex-1 text-[10px] h-7"
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              quantity: 1,
                              image: product.image,
                              category: product.category,
                              purchaseType: "onetime",
                            });
                            navigate("/cart");
                          }}
                        >
                          <ShoppingCart className="w-3 h-3" /> Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-[10px] h-7"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          Subscribe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center py-4">
              <Button variant="outline" size="lg" onClick={editPlan}>
                <RefreshCw className="w-4 h-4 mr-2" /> Edit Plan
              </Button>
              {isAuthenticated && (
                <Button size="lg">
                  <Save className="w-4 h-4 mr-2" /> Save to My Pet Profile
                </Button>
              )}
              {!isAuthenticated && (
                <Button size="lg" onClick={() => navigate("/login")}>
                  <Save className="w-4 h-4 mr-2" /> Login to Save Plan
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        <footer className="bg-foreground text-background py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">© 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition Scheme</p>
          </div>
        </footer>
      </div>
    );
  }

  // ===================== MAIN PAGE =====================
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-foreground"
          >
            Customized Pet Nutrition Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Every pet is unique! Consider their age, breed, activity level, and any allergies to create the perfect
            feeding plan for your beloved companion.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button size="xl" onClick={startWizard} className="shadow-xl">
              👉 Create Personalized Feeding Plan
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Wizard */}
      {wizardStarted && (
        <section ref={wizardRef} className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            {/* Progress */}
            <div className="mb-8 space-y-3">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Step {currentStep + 1} of {STEPS.length}</span>
                <span>{STEPS[currentStep]}</span>
              </div>
              <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-2" />
              <div className="flex gap-1">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step Card */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6 md:p-10">
                <h2 className="text-xl md:text-2xl font-bold text-center mb-8 text-foreground">
                  {currentStep === 0 && "What type of pet do you have?"}
                  {currentStep === 1 && `Select your ${plan.petType}'s breed`}
                  {currentStep === 2 && `How old is your ${plan.petType}?`}
                  {currentStep === 3 && `What's your ${plan.petType}'s weight?`}
                  {currentStep === 4 && "What's their activity level?"}
                  {currentStep === 5 && "Any health conditions or allergies?"}
                  {currentStep === 6 && "Food preference?"}
                  {currentStep === 7 && "What's the feeding goal?"}
                </h2>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-10">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  {currentStep < STEPS.length - 1 ? (
                    <Button onClick={nextStep} disabled={!canProceed()}>
                      Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={generatePlan} disabled={!canProceed()} size="lg">
                      <Sparkles className="w-4 h-4 mr-2" /> Generate Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <footer className="bg-foreground text-background py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition Scheme</p>
        </div>
      </footer>
    </div>
  );
};

export default NutritionPlan;
