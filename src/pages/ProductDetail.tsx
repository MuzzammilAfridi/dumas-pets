import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ShoppingCart, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import axios from "axios";
import { useEffect } from "react";

import { createCart, updateCart } from "@/services/cartService";

const VEGETABLE_OPTIONS = [
  { label: "Carrot", value: "carrot" },
  { label: "Pumpkin", value: "pumpkin" },
  { label: "Sweet Potato", value: "sweet_potato" },
  { label: "No veg", value: "no_veg" },
];

const ProductDetail = () => {
  // const { id } = useParams<{ id: string }>();
  // const { products, loading } = useProducts();

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://dumas.frappe.cloud";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const decodedId = decodeURIComponent(id);

        const res = await axios.get(`/api/resource/Item/${decodedId}`);

        setProduct(res.data.data);
        console.log("PRODUCT DATA:", res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // const { id } = useParams();

  const createSlug = (str) => {
    return str
      ?.trim()
      .replace(/\//g, "-")
      .replace(/%/g, "percent")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase();
  };

  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const descriptionTabRef = useRef<HTMLButtonElement>(null);

  // Pet Food Customization States
  const [meatType, setMeatType] = useState<string>("");
  const [grainType, setGrainType] = useState<string>("");
  // const [grainPercentage, setGrainPercentage] = useState<number>(0);
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<string>("100g");
  const [preparationInstructions, setPreparationInstructions] =
    useState<string>("");

  // Standard Product States
  const [standardQuantity, setStandardQuantity] = useState<number>(1);

  // One-Time Purchase States
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<string>("");

  // Subscription States
  const [subscriptionStartDate, setSubscriptionStartDate] = useState<Date>();
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date>();
  const [subscriptionTimeSlot, setSubscriptionTimeSlot] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Review States
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [grainPercentage, setGrainPercentage] = useState<number>(0);
  const [gpvRatio, setGpvRatio] = useState<string>("");

  const [extraSoup, setExtraSoup] = useState<number>(0);

  const getQuantityInGrams = (q: string) => {
    if (q.includes("kg")) return parseInt(q) * 1000;
    return parseInt(q);
  };

  const freeSoup = Math.floor(getQuantityInGrams(quantity) / 250);

  const remainingForNextSoup = 250 - (getQuantityInGrams(quantity) % 250);

  const showUnlockMessage = freeSoup > 0;
  const showUpsellMessage =
    freeSoup === 0 && getQuantityInGrams(quantity) < 250;

  const toggleVegetable = (veg: string) => {
    setSelectedVegetables((prev) => {
      // ✅ If user selects "No veg"
      if (veg === "no_veg") {
        return prev.includes("no_veg") ? [] : ["no_veg"];
      }

      // ✅ If selecting other veg → remove "no_veg"
      let updated = prev.filter((v) => v !== "no_veg");

      // Toggle logic
      if (updated.includes(veg)) {
        return updated.filter((v) => v !== veg);
      } else {
        return [...updated, veg];
      }
    });
  };

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold">Product not found</h1>
        </div>
      </div>
    );
  }

  const isPetFood = true;

  const handleReadMoreClick = () => {
    descriptionTabRef.current?.click();
    descriptionTabRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const truncateDescription = (text = "", maxLines = 3) => {
    const words = text.split(" ");
    const wordsPerLine = 12;
    const maxWords = maxLines * wordsPerLine;
    if (words.length <= maxWords) return { text, truncated: false };
    return { text: words.slice(0, maxWords).join(" "), truncated: true };
  };

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.item_code, // ✅ THIS IS item_code
      name: product.item_name, // ✅ already mapped
      price: product.standard_rate || 100,
      category: product.item_group, // ✅ FIXED
      quantity: isPetFood ? 1 : standardQuantity,
      image: product.image,
     
      purchaseType: "onetime" as const,
      subscription: {
        frequency: "once",
        date: deliveryDate,
        timeSlot: deliveryTimeSlot,
      },
      ...(isPetFood && {
        customization: {
          meatType,
          grainType,
          grainPercentage,
          gpvRatio,
          freeSoup,
          extraSoup,
          vegetables: selectedVegetables,
          ...(preparationInstructions && {
            preparationInstructions,
          }),
        },
      }),
    };

    console.log("PRODUCT:", product);
    // console.log("ADDING TO CART:", cartItem);
    addToCart(cartItem);
    navigate("/cart");
  };

  const handleSubscribe = () => {
    if (!subscriptionStartDate || !subscriptionEndDate) {
      toast({
        title: "Select Date Range",
        description:
          "Please select a delivery date range for your subscription.",
        variant: "destructive",
      });
      return;
    }
    if (selectedDays.length === 0) {
      toast({
        title: "Select Delivery Days",
        description: "Please select at least one delivery day.",
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      productId: product.item_code,
      name: product.item_name,
      price: product.standard_rate,
      quantity: isPetFood ? 1 : standardQuantity,
      image: product.image,
      category: product.item_group,
      purchaseType: "subscription" as const,
      subscription: {
        frequency: "weekly",
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
        timeSlot: subscriptionTimeSlot,
        deliveryDays: selectedDays,
      },
      ...(isPetFood && {
        customization: {
          meatType,
          grainType,
          grainPercentage,
          gpvRatio,
          freeSoup,
          extraSoup,
          vegetables: selectedVegetables,
          preparationInstructions,
        },
      }),
    };

    addToCart(cartItem);
    navigate("/cart");
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
    setReviewName("");
    setReviewRating(5);
    setReviewComment("");
  };

  const { text: descriptionText, truncated: isDescriptionTruncated } =
    truncateDescription(product.description);
  const subscriptionPrice = (product.standard_rate * 0.84).toFixed(2); // ~16% discount for 7+ days

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Product Header - White Background */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Left Column - Product Image */}
            <div className="flex">
              <img
                src={
                  product.image
                    ? `${BASE_URL}${product.image}`
                    : "/placeholder.png"
                }
                alt={product.item_name}
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Right Column - Product Details */}
            <div className="flex flex-col justify-between py-4">
              <div className="space-y-6">
                {/* Product Name */}
                <h1 className="text-4xl font-bold">{product.item_name}</h1>

                {/* Pricing */}
                <div className="space-y-3">
                  <span className="text-3xl font-bold text-primary">
                    ₹{product.standard_rate.toFixed(2)}
                  </span>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 inline-block">
                    <span className="text-primary font-semibold">
                      ₹{subscriptionPrice} for 7+ days Subscription
                    </span>
                  </div>
                </div>

                {/* Description with Read More */}
                <div className="text-muted-foreground leading-relaxed">
                  <span>{descriptionText}</span>
                  {isDescriptionTruncated && (
                    <>
                      {"... "}
                      <button
                        onClick={handleReadMoreClick}
                        className="text-primary font-bold hover:underline inline"
                      >
                        Read more
                      </button>
                    </>
                  )}
                </div>

                {/* PET FOOD Advanced Customization */}
                {isPetFood && (
                  <div className="space-y-6">
                    {/* Two Column Layout for Meat/Grain and Vegetables */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Left: Meat Type and Grain Type */}
                      <div className="space-y-5">
                        <div>
                          <Label
                            htmlFor="meat-type"
                            className="text-base font-semibold mb-2 block"
                          >
                            Meat Type *
                          </Label>
                          <Select value={meatType} onValueChange={setMeatType}>
                            <SelectTrigger
                              id="meat-type"
                              className={cn(
                                meatType && "bg-primary/10 border-primary/30",
                              )}
                            >
                              <SelectValue placeholder="Chicken" />
                            </SelectTrigger>
                            <SelectContent className="bg-background">
                              <SelectItem value="Chicken">Chicken</SelectItem>
                              <SelectItem value="Buffalo">Buffalo</SelectItem>
                              <SelectItem value="Mutton">Mutton</SelectItem>
                              <SelectItem value="Fish">Fish</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="grain-type"
                            className="text-base font-semibold mb-2 block"
                          >
                            Grain Type *
                          </Label>
                          <Select
                            value={grainType}
                            onValueChange={(val) => {
                              setGrainType(val);
                              if (val === "No grain") setGrainPercentage(0);
                            }}
                          >
                            <SelectTrigger
                              id="grain-type"
                              className={cn(
                                grainType && "bg-primary/10 border-primary/30",
                              )}
                            >
                              <SelectValue placeholder="Select grain type" />
                            </SelectTrigger>
                            <SelectContent className="bg-background">
                              <SelectItem value="No grain">No grain</SelectItem>
                              <SelectItem value="Wheat">Wheat</SelectItem>
                              <SelectItem value="Rice">Rice</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Right: Vegetables Radio Selection */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          Vegetables
                        </Label>

                        <div className="space-y-3">
                          {VEGETABLE_OPTIONS.map((veg) => (
                            <div
                              key={veg.value}
                              className={cn(
                                "flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition",
                                selectedVegetables.includes(veg.value)
                                  ? "bg-primary/10 border-primary/30"
                                  : "border-border hover:bg-muted/50",
                              )}
                              onClick={() => toggleVegetable(veg.value)}
                            >
                              <Checkbox
                                checked={selectedVegetables.includes(veg.value)}
                                onCheckedChange={() =>
                                  toggleVegetable(veg.value)
                                }
                                className="border-primary data-[state=checked]:bg-primary"
                              />

                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  selectedVegetables.includes(veg.value) &&
                                    "text-primary",
                                )}
                              >
                                {veg.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quantity - Full Width */}
                    <div>
                      <Label
                        htmlFor="quantity"
                        className="text-base font-semibold mb-2 block"
                      >
                        Quantity *
                      </Label>
                      <Select value={quantity} onValueChange={setQuantity}>
                        <SelectTrigger
                          id="quantity"
                          className={cn(
                            quantity && "bg-primary/10 border-primary/30",
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {[
                            "100g",
                            "200g",
                            "300g",
                            "400g",
                            "500g",
                            "600g",
                            "700g",
                            "800g",
                            "900g",
                            "1kg",
                          ].map((q) => (
                            <SelectItem key={q} value={q}>
                              {q}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-2 block">
                        Grain Percentage (%)
                      </Label>

                      <Select
                        value={grainPercentage.toString()}
                        onValueChange={(val) => setGrainPercentage(Number(val))}
                      >
                        <SelectTrigger
                          className={cn(
                            grainPercentage &&
                              "bg-primary/10 border-primary/30",
                          )}
                        >
                          <SelectValue placeholder="Select grain %" />
                        </SelectTrigger>

                        <SelectContent className="bg-background">
                          {[0, 5, 10, 15, 20, 25, 30].map((val) => (
                            <SelectItem key={val} value={val.toString()}>
                              {val}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-2 block">
                        GPV Ratio (Grain : Protein : Veg)
                      </Label>

                      <Select
                        value={gpvRatio}
                        onValueChange={(val) => {
                          setGpvRatio(val);

                          const [grain] = val.split("-");
                          setGrainPercentage(Number(grain));
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            gpvRatio && "bg-primary/10 border-primary/30",
                          )}
                        >
                          <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>

                        <SelectContent className="bg-background">
                          <SelectItem value="10-80-10">
                            10% : 80% : 10%
                          </SelectItem>
                          <SelectItem value="15-75-10">
                            15% : 75% : 10%
                          </SelectItem>
                          <SelectItem value="20-70-10">
                            20% : 70% : 10%
                          </SelectItem>
                          <SelectItem value="0-90-10">
                            0% : 90% : 10%
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      {/* 🎉 Free Soup Unlock Banner */}

                      <Label className="text-base font-semibold block">
                        🍲 Soup Add-on
                      </Label>

                      {/* Free Soup Info */}
                      {showUnlockMessage && (
                        <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-2 text-sm font-semibold">
                          🎉 You unlocked <b>{freeSoup}</b> free soup
                          {freeSoup > 1 ? "s" : ""}!
                        </div>
                      )}

                      {/* ⚡ Upsell Message */}
                      {showUpsellMessage && (
                        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg px-4 py-2 text-sm">
                          ⚡ Add <b>{remainingForNextSoup}g</b> more to unlock 1
                          free soup
                        </div>
                      )}

                      {/* Extra Soup Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm">Add extra soup:</span>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setExtraSoup((prev) => Math.max(0, prev - 1))
                          }
                        >
                          -
                        </Button>

                        <span className="font-semibold">{extraSoup}</span>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setExtraSoup((prev) => prev + 1)}
                        >
                          +
                        </Button>

                        <span className="text-xs text-muted-foreground">
                          (₹10 per soup)
                        </span>
                      </div>
                    </div>

                    {/* Preparation Instructions - Full Width */}
                    <div>
                      <Label
                        htmlFor="prep-instructions"
                        className="text-base font-semibold mb-2 block"
                      >
                        Preparation Instructions
                      </Label>
                      <Textarea
                        id="prep-instructions"
                        value={preparationInstructions}
                        onChange={(e) =>
                          setPreparationInstructions(e.target.value)
                        }
                        placeholder="Enter any special preparation instructions..."
                        className={cn(
                          "min-h-[100px] resize-none",
                          preparationInstructions &&
                            "bg-primary/10 border-primary/30",
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* TREATS & CAKES Standard Selection */}
                {!isPetFood && (
                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="std-quantity"
                        className="text-base font-semibold mb-2 block"
                      >
                        Quantity
                      </Label>
                      <Select
                        value={standardQuantity.toString()}
                        onValueChange={(val) =>
                          setStandardQuantity(Number(val))
                        }
                      >
                        <SelectTrigger
                          id="std-quantity"
                          className={cn(
                            standardQuantity &&
                              "bg-primary/10 border-primary/30",
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                            <SelectItem key={q} value={q.toString()}>
                              {q}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Options - Orange Background */}
      <section className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* One-Time Purchase */}
            <div className="bg-background p-8 rounded-2xl shadow-lg flex flex-col min-h-[320px]">
              <h3 className="text-2xl font-bold mb-6">One-Time Purchase</h3>
              <div className="space-y-4 flex-1">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    Delivery Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          deliveryDate &&
                            "bg-primary/10 border-primary/30 text-primary",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate
                          ? format(deliveryDate, "MMMM do, yyyy")
                          : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-background"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    Time Slot
                  </Label>
                  <Select
                    value={deliveryTimeSlot}
                    onValueChange={setDeliveryTimeSlot}
                  >
                    <SelectTrigger
                      className={cn(
                        deliveryTimeSlot && "bg-primary/10 border-primary/30",
                      )}
                    >
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="morning">
                        Morning (8AM - 12PM)
                      </SelectItem>
                      <SelectItem value="noon">Noon (12PM - 4PM)</SelectItem>
                      <SelectItem value="evening">
                        Evening (4PM - 8PM)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                size="xl"
                onClick={handleAddToCart}
                className="w-full text-lg mt-6"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Subscribe & Save */}
            <div className="bg-background p-8 rounded-2xl shadow-lg flex flex-col min-h-[320px]">
              <h3 className="text-2xl font-bold mb-6">Subscribe & Save</h3>
              <div className="grid md:grid-cols-2 gap-6 flex-1">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">
                      Delivery Date Between
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal text-sm",
                            (subscriptionStartDate || subscriptionEndDate) &&
                              "bg-primary/10 border-primary/30 text-primary",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {subscriptionStartDate && subscriptionEndDate
                              ? `${format(subscriptionStartDate, "MMM d")} - ${format(subscriptionEndDate, "MMM d, yyyy")}`
                              : "Select date range"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-background"
                        align="start"
                      >
                        <Calendar
                          mode="range"
                          selected={{
                            from: subscriptionStartDate,
                            to: subscriptionEndDate,
                          }}
                          onSelect={(range) => {
                            setSubscriptionStartDate(range?.from);
                            setSubscriptionEndDate(range?.to);
                          }}
                          initialFocus
                          className="pointer-events-auto"
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2 block">
                      Time Slot
                    </Label>
                    <Select
                      value={subscriptionTimeSlot}
                      onValueChange={setSubscriptionTimeSlot}
                    >
                      <SelectTrigger
                        className={cn(
                          subscriptionTimeSlot &&
                            "bg-primary/10 border-primary/30",
                        )}
                      >
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="morning">
                          Morning (8AM - 12PM)
                        </SelectItem>
                        <SelectItem value="noon">Noon (12PM - 4PM)</SelectItem>
                        <SelectItem value="evening">
                          Evening (4PM - 8PM)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column - Days Selection */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    Delivery Days
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors",
                          selectedDays.includes(day)
                            ? "bg-primary/10 border-primary/30"
                            : "border-border hover:bg-muted/50",
                        )}
                        onClick={() => toggleDay(day)}
                      >
                        <Checkbox
                          checked={selectedDays.includes(day)}
                          onCheckedChange={() => toggleDay(day)}
                          className="border-primary data-[state=checked]:bg-primary"
                        />
                        <span
                          className={cn(
                            "text-sm font-medium",
                            selectedDays.includes(day) && "text-primary",
                          )}
                        >
                          {day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                size="xl"
                onClick={handleSubscribe}
                variant="orderNow"
                className="w-full text-lg mt-6"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                Subscribe for 7+ days
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs - White Background */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="description" ref={descriptionTabRef}>
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications">Cooking & Specs</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="review">Write Review</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <h3 className="text-2xl font-bold">Product Description</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4">
              <h3 className="text-2xl font-bold">
                Cooking Instructions & Specifications
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.specifications}
              </p>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Customer Testimonials</h3>
              {product.testimonials?.map((testimonial, idx) => (
                <div key={idx} className="bg-muted/50 p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < testimonial.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-2">
                    {testimonial.comment}
                  </p>
                  <p className="text-sm font-semibold">
                    — {testimonial.author}
                  </p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <h3 className="text-2xl font-bold">Write Your Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <Label htmlFor="review-name">Your Name</Label>
                  <Input
                    id="review-name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="review-rating">Rating</Label>
                  <Select
                    value={reviewRating.toString()}
                    onValueChange={(val) => setReviewRating(Number(val))}
                  >
                    <SelectTrigger id="review-rating">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <SelectItem key={r} value={r.toString()}>
                          {r} Stars
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="review-comment">Your Review</Label>
                  <Textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" size="lg">
                  Submit Review
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition
            Scheme
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
