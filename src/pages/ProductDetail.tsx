import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import {
  findOrCreateVariant,
  getItemAttribute,
} from "@/services/variantService";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState, useRef, useEffect, useMemo } from "react";
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
import {
  CalendarIcon,
  Check,
  Gift,
  Minus,
  Plus,
  ShoppingCart,
  Soup,
  Star,
  Zap,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getProductById } from "@/services/productService";

const VEGETABLE_OPTIONS = [
  { label: "Carrot", value: "carrot" },
  { label: "Pumpkin", value: "pumpkin" },
  { label: "Sweet Potato", value: "sweet_potato" },
  { label: "No veg", value: "no_veg" },
];

const ProductDetail = () => {
  const location = useLocation();

  const editMode = location.state?.editMode;
  const cartIndex = location.state?.cartIndex;
  const cartItem = location.state?.cartItem;

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meatPercentage, setMeatPercentage] = useState<number>(50);
  const [grainPercentage, setGrainPercentage] = useState<number>(15);
  const [vegetableOptions, setVegetableOptions] = useState([]);

  const BASE_URL = "https://dumas.frappe.cloud";
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);

        setProduct(res.data.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (grainPercentage + meatPercentage <= 100) {
      const veg = 100 - (grainPercentage + meatPercentage);
      setGpvRatio(`${grainPercentage}-${meatPercentage}-${veg}`);
    }
  }, [grainPercentage, meatPercentage]);

  useEffect(() => {
    if (editMode && cartItem) {
      setFoodType(cartItem.customization?.foodType || "");
      setGrainType(cartItem.customization?.grainType || "");
      setGrainPercentage(cartItem.customization?.grainPercentage || 0);

      setMeatPercentage(cartItem.customization?.meatPercentage || 0);

      setSelectedVegetables(cartItem.customization?.vegetables || []);

      setPreparationInstructions(
        cartItem.customization?.preparationInstructions || "",
      );

      setExtraSoup(cartItem.customization?.extraSoup || 0);

      setPurchaseType(cartItem.purchaseType);

      // one time
      if (cartItem.purchaseType === "onetime") {
        setDeliveryDate(cartItem.subscription?.date);
        setDeliveryTime(cartItem.subscription?.timeSlot || "");
      }

      // subscription
      if (cartItem.purchaseType === "subscription") {
        setSubscriptionStartDate(cartItem.subscription?.startDate);

        setSubscriptionEndDate(cartItem.subscription?.endDate);

        setSubscriptionTimeSlot(cartItem.subscription?.timeSlot || "");

        setSelectedDays(cartItem.subscription?.deliveryDays || []);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const [
          foodTypeRes,
          grainTypeRes,
          quantityRes,
          grainPercentageRes,
          meatPercentageRes,
          vegetableRes,
        ] = await Promise.all([
          getItemAttribute("Food Type"),
          getItemAttribute("Grain Type"),
          getItemAttribute("Quantity"),
          getItemAttribute("Grain Percentage"),
          getItemAttribute("Meat Percentage"),
          getItemAttribute("Vegetables"),
        ]);

        setFoodTypeOptions(foodTypeRes.data.data.item_attribute_values);

        setGrainTypeOptions(grainTypeRes.data.data.item_attribute_values);

        setQuantityOptions(quantityRes.data.data.item_attribute_values);
        setVegetableOptions(vegetableRes.data.data.item_attribute_values);

        setGrainPercentageOptions(
          [...grainPercentageRes.data.data.item_attribute_values].sort(
            (a, b) => Number(a.attribute_value) - Number(b.attribute_value),
          ),
        );

        setMeatPercentageOptions(
          [...meatPercentageRes.data.data.item_attribute_values].sort(
            (a, b) => Number(a.attribute_value) - Number(b.attribute_value),
          ),
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchAttributes();
  }, []);

  const { addToCart, updateCartItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const descriptionTabRef = useRef<HTMLButtonElement>(null);

  // Pet Food Customization States

  const [foodTypeOptions, setFoodTypeOptions] = useState([]);
  const [grainTypeOptions, setGrainTypeOptions] = useState([]);
  const [quantityOptions, setQuantityOptions] = useState([]);
  const [grainPercentageOptions, setGrainPercentageOptions] = useState([]);
  const [meatPercentageOptions, setMeatPercentageOptions] = useState([]);

  const [foodType, setFoodType] = useState<string>("Default");
  const [grainType, setGrainType] = useState<string>("Brown Rice");
  // const [grainPercentage, setGrainPercentage] = useState<number>(0);
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<string>("250 gm");
  const [preparationInstructions, setPreparationInstructions] =
    useState<string>("");

  // Standard Product States
  const [standardQuantity, setStandardQuantity] = useState<number>(1);

  // One-Time Purchase States
  const [deliveryDate, setDeliveryDate] = useState<Date>();

  // Subscription States
  const [subscriptionStartDate, setSubscriptionStartDate] = useState<Date>();
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date>();
  const [subscriptionTimeSlot, setSubscriptionTimeSlot] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [purchaseType, setPurchaseType] = useState<"onetime" | "subscription">(
    "onetime",
  );

  // Review States
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [gpvRatio, setGpvRatio] = useState<string>("");

  const [extraSoup, setExtraSoup] = useState<number>(0);

  const [deliveryTime, setDeliveryTime] = useState<string>("");

  const getQuantityInGrams = (q: string) => {
    if (q.includes("kg")) return parseInt(q) * 1000;
    return parseInt(q);
  };

  const freeSoup = Math.floor(getQuantityInGrams(quantity) / 250) + 1;

  const remainingForNextSoup = 250 - (getQuantityInGrams(quantity) % 250);

  const isValidCustomTime = (date: Date, time: string) => {
    if (!date || !time) return false;

    const now = new Date();

    const [hour, minute] = time.split(":").map(Number);

    const delivery = new Date(date);
    delivery.setHours(hour, minute, 0, 0);

    const diff = (delivery.getTime() - now.getTime()) / (1000 * 60 * 60);

    return diff >= 12;
  };

  const showUnlockMessage = freeSoup > 0;
  const showUpsellMessage =
    freeSoup === 0 && getQuantityInGrams(quantity) < 250;

  const toggleVegetable = (veg: string) => {
    setSelectedVegetables((prev) => {
      // ✅ If user selects "No veg"
      if (veg === "No Vegetables") {
        return prev.includes("No Vegetables") ? [] : ["No Vegetables"];
      }

      let updated = prev.filter((v) => v !== "No Vegetables");

      // ✅ If selecting other veg → remove "no_veg"

      // Toggle logic
      if (updated.includes(veg)) {
        return updated.filter((v) => v !== veg);
      } else {
        return [...updated, veg];
      }
    });
  };

  const generateTimeOptions = () => {
    const times = [];

    for (let hour = 8; hour <= 20; hour++) {
      const h = hour.toString().padStart(2, "0");
      times.push(`${h}:00`);
    }

    return times;
  };

  const availableTimes = useMemo(() => {
    if (!deliveryDate) return [];

    return generateTimeOptions().filter((time) =>
      isValidCustomTime(deliveryDate, time),
    );
  }, [deliveryDate]);

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

  const isValidPercentageCombination = () => {
    return grainPercentage + meatPercentage <= 100;
  };

  const handleAddToCart = async () => {
    const user = localStorage.getItem("dumas_user");

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login first to subscribe.",
        variant: "destructive",
      });

      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    // ✅ FIX 1: Validate date
    if (!deliveryDate) {
      toast({
        title: "Select Delivery Date",
        description: "Please select a delivery date.",
        variant: "destructive",
      });
      return;
    }

    // ✅ FIX 2: Validate time slot
    if (!deliveryTime) {
      toast({
        title: "Select Time",
        description: "Please select a delivery time.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidCustomTime(deliveryDate, deliveryTime)) {
      toast({
        title: "Invalid Time",
        description: "Minimum 12 hours gap required.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPercentageCombination()) {
      toast({
        title: "Invalid Percentage",
        description: "Grain % and Meat % total cannot exceed 100%.",
        variant: "destructive",
      });

      return;
    }

    const finalFreeSoup = extraSoup === -1 ? 0 : freeSoup;

    const templateCode = product.variant_of || product.item_code;

    const variantRes = await findOrCreateVariant({
      templateItem: templateCode,
      foodType,
      grain: grainType,
      grainPercentage,
      meatPercentage,
      quantity,
    });

    const newCartItem = {
      // productId: product.item_code,
      productId: variantRes.item_code,
      templateItem: templateCode,
      name: `${product.item_name} (${grainType}, ${foodType}, grain ${grainPercentage}%, meat ${meatPercentage}% ) - ${quantity}`,

      // IMPORTANT FIX → ensure price goes to cart
      price: Number(product.standard_rate || 100),

      category: product.item_group,
      quantity: editMode
        ? cartItem?.quantity || 1
        : isPetFood
          ? 1
          : standardQuantity,
      image: product.image,

      purchaseType: "onetime" as const,

      subscription: {
        frequency: "once",
        date: deliveryDate,
        timeSlot: deliveryTime,
      },

      ...(isPetFood && {
        customization: {
          foodType,
          grainType,
          grainPercentage,
          gpvRatio,
          meatPercentage,

          // soup logic
          freeSoup: finalFreeSoup,
          extraSoup: extraSoup === -1 ? 0 : extraSoup,

          vegetables: selectedVegetables,

          ...(preparationInstructions && {
            preparationInstructions,
          }),
        },
      }),
    };

    if (editMode) {
      updateCartItem(cartIndex, newCartItem);
    } else {
      addToCart(newCartItem);
    }

    navigate("/cart");
  };

  const handleSubscribe = async () => {
    const finalFreeSoup = extraSoup === -1 ? 0 : freeSoup;

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

    if (!isValidPercentageCombination()) {
      toast({
        title: "Invalid Percentage",
        description: "Grain % and Meat % total cannot exceed 100%.",
        variant: "destructive",
      });

      return;
    }
    const templateCode = product.variant_of || product.item_code;

    const variantRes = await findOrCreateVariant({
      templateItem: templateCode,
      foodType,
      quantity,
      grain: grainType,
      grainPercentage,
      meatPercentage,
    });

    const newCartItem = {
      // productId: product.item_code,
      productId: variantRes.item_code,
      name: `${product.item_name} (${grainType}) (${foodType}) (${grainPercentage}) (${meatPercentage}) (${quantity})`,
      templateItem: templateCode,

      // IMPORTANT FIX → ensure price goes to cart
      price: Number(product.standard_rate || 100),

      quantity: editMode
        ? cartItem?.quantity || 1
        : isPetFood
          ? 1
          : standardQuantity,
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
          foodType,
          grainType,
          grainPercentage,
          meatPercentage,
          gpvRatio,
          freeSoup: finalFreeSoup,
          extraSoup: extraSoup === -1 ? 0 : extraSoup,
          vegetables: selectedVegetables,
          preparationInstructions,
        },
      }),
    };

    if (editMode) {
      updateCartItem(cartIndex, newCartItem);
    } else {
      addToCart(newCartItem);
    }

    navigate("/cart");
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = Number(h);

    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${m} ${ampm}`;
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
      <div className="container mx-auto px-4 pt-8">
        <Button
          variant="outline"
          className="whitespace-nowrap"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/shop");
            }
          }}
        >
          Continue Shopping
        </Button>
      </div>
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
                    : "https://placehold.co/600x400?text=No+Image"
                }
                alt={product.item_name}
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Right Column - Product Details */}
            <div className="flex flex-col justify-between   py-4">
              <div className="space-y-6 ">
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
                  <div className="">
                  <div className="space-y-6">
                    {/* Two Column Layout for Meat/Grain and Vegetables */}
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
                          {quantityOptions.map((item) => (
                            <SelectItem
                              key={item.attribute_value}
                              value={item.attribute_value}
                            >
                              {item.attribute_value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>


             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      {/* Left: Meat Type and Grain Type */}
  <div className="md:col-span-2">
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">



                      <div className="">
                        <div>
                          <Label
                            htmlFor="meat-type"
                            className="text-base font-semibold mb-2 block"
                          >
                            Food Type *
                          </Label>
                          <Select value={foodType} onValueChange={setFoodType}>
                            <SelectTrigger
                              id="meat-type"
                              className={cn(
                                foodType && "bg-primary/10 border-primary/30",
                              )}
                            >
                              <SelectValue placeholder="Default" />
                            </SelectTrigger>
                            <SelectContent className="bg-background">
                              {foodTypeOptions.map((item) => (
                                <SelectItem
                                  key={item.attribute_value}
                                  value={item.attribute_value}
                                >
                                  {item.attribute_value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
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
                            {grainTypeOptions.map((item) => (
                              <SelectItem
                                key={item.attribute_value}
                                value={item.attribute_value}
                              >
                                {item.attribute_value}
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
                          onValueChange={(val) => {
                            setGrainPercentage(Number(val));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select grain %" />
                          </SelectTrigger>

                          <SelectContent>
                            {grainPercentageOptions.map((item) => (
                              <SelectItem
                                key={item.attribute_value}
                                value={item.attribute_value}
                              >
                                {item.attribute_value}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-base font-semibold mb-2 block">
                          Meat Percentage (%)
                        </Label>

                        {/* <Select
                        value={meatPercentage.toString()}
                        onValueChange={(val) => setMeatPercentage(Number(val))}
                      > */}
                        <Select
                          value={meatPercentage.toString()}
                          onValueChange={(val) =>
                            setMeatPercentage(Number(val))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select meat %" />
                          </SelectTrigger>

                          <SelectContent>
                            {meatPercentageOptions.map((item) => (
                              <SelectItem
                                key={item.attribute_value}
                                value={item.attribute_value}
                              >
                                {item.attribute_value}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                    
</div>
    {/* ✅ Proper Working Skip Soup Checkbox */}
                    {/* 🍲 Soup Add-on Section */}
                    <div className="space-y-3 md:mt-5">
                      <Label className="text-base font-semibold block">
                        <Soup className="inline-block mr-2" />
                        Soup Add-on
                      </Label>

                      {/* ✅ Free Soup Info (show only when not skipped) */}
                      {extraSoup !== -1 && showUnlockMessage && (
                        <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg px-4 py-2 text-sm font-semibold">
                          <Gift className="inline-block h-4 w-4 mr-2" />
                          You unlocked <b>{freeSoup}</b> free soup
                          {freeSoup > 1 ? "s" : ""}!
                        </div>
                      )}

                      {/* ✅ Upsell Message (show only when not skipped) */}
                      {extraSoup !== -1 && showUpsellMessage && (
                        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg px-4 py-2 text-sm">
                          <Zap className="inline-block h-4 w-4 mr-2" />
                          Add <b>{remainingForNextSoup}g</b> more to unlock 1
                          free soup
                        </div>
                      )}

                      {/* Skip Soup Option */}
                      <div
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border transition",
                          extraSoup === -1
                            ? "bg-primary/10 border-primary/30"
                            : "border-border hover:bg-muted/50",
                        )}
                      >
                        <Checkbox
                          checked={extraSoup === -1}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setExtraSoup(-1); // skip soup
                            } else {
                              setExtraSoup(0); // restore normal soup flow
                            }
                          }}
                          className="border-primary data-[state=checked]:bg-primary"
                        />

                        <span
                          onClick={() =>
                            setExtraSoup((prev) => (prev === -1 ? 0 : -1))
                          }
                          className={cn(
                            "text-sm font-medium cursor-pointer",
                            extraSoup === -1 && "text-primary",
                          )}
                        >
                          Skip Soup
                        </span>
                      </div>

                      {/* Extra Soup Controls */}
                      {extraSoup !== -1 && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm">Add extra soup:</span>

                          <Button
                            variant="outline"
                            className="h-10 w-10 rounded-xl"
                            onClick={() =>
                              setExtraSoup((prev) => Math.max(0, prev - 1))
                            }
                          >
                            <Minus className="h-4 w-4 stroke-[4]" />
                          </Button>

                          <span className="font-semibold">{extraSoup}</span>

                          <Button
                            variant="outline"
                            className="h-10 w-10 rounded-xl"
                            onClick={() => setExtraSoup((prev) => prev + 1)}
                          >
                            <Plus className="h-4 w-4 stroke-[4]" />
                          </Button>

                          <span className="text-xs text-muted-foreground">
                            (₹10 per soup)
                          </span>
                        </div>
                      )}
                    </div>
</div>
                         {/* Right: Vegetables Radio Selection */}
                    <div className=" ">
                      <Label className="text-base font-semibold mb-3 block">
                        Vegetables
                      </Label>

                      <div className="space-y-3">
                        {vegetableOptions.map((veg) => {
                          const isSelected = selectedVegetables.includes(
                            veg.attribute_value,
                          );

                          return (
                            <div
                              key={veg.attribute_value}
                              onClick={() =>
                                toggleVegetable(veg.attribute_value)
                              }
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:bg-muted/50",
                              )}
                            >
                              {/* Custom Square Box */}
                              <div
                                className={cn(
                                  "h-4 w-4 min-w-[18px] border-2 flex items-center justify-center rounded",
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "bg-white border-gray-400",
                                )}
                              >
                                {isSelected && (
                                  <Check className="h-3 w-3 text-white stroke-[2]" />
                                )}
                              </div>

                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  isSelected && "text-primary",
                                )}
                              >
                                {veg.attribute_value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>



                   
                    </div>

{/* 
                    <div>
                      <Label className="text-base font-semibold mb-2 block">
                        GPV Ratio (Grain : Protein : Veg)
                      </Label>

                      <div className="p-3 rounded-lg border bg-muted">
                        <p className="text-sm font-semibold">
                          {gpvRatio || "0-0-100"}
                        </p>
                      </div>
                    </div> */}


                  

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
            <div className="mb-8">
              <Label className="text-base font-semibold mb-4 block">
                Purchase Type
              </Label>

              <RadioGroup
                value={purchaseType}
                onValueChange={(value: "onetime" | "subscription") =>
                  setPurchaseType(value)
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* One Time Purchase */}
                <div
                  className={cn(
                    "flex items-center space-x-3 rounded-xl border p-4 cursor-pointer transition-all",
                    purchaseType === "onetime"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <RadioGroupItem value="onetime" id="onetime" />

                  <Label
                    htmlFor="onetime"
                    className="cursor-pointer flex flex-col"
                  >
                    <span className="font-semibold">One-Time Purchase</span>

                    <span className="text-sm text-muted-foreground">
                      Buy once only
                    </span>
                  </Label>
                </div>

                {/* Subscription */}
                <div
                  className={cn(
                    "flex items-center space-x-3 rounded-xl border p-4 cursor-pointer transition-all",
                    purchaseType === "subscription"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <RadioGroupItem value="subscription" id="subscription" />

                  <Label
                    htmlFor="subscription"
                    className="cursor-pointer flex flex-col"
                  >
                    <span className="font-semibold">Subscription</span>

                    <span className="text-sm text-muted-foreground">
                      Save more with recurring delivery
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* One-Time Purchase */}

            {purchaseType === "onetime" && (
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
                          // disabled={(date) =>
                          //   date < new Date(new Date().setHours(20, 0, 0, 0))
                          // }

                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            const selected = new Date(date);
                            selected.setHours(0, 0, 0, 0);

                            // ❌ block today + past
                            return selected <= today;
                          }}
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
                      value={deliveryTime}
                      onValueChange={setDeliveryTime}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery time" />
                      </SelectTrigger>

                      <SelectContent className="max-h-60 overflow-y-auto">
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
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
                  {editMode ? "Update Cart" : "Add to Cart"}
                </Button>
              </div>
            )}

            {/* Subscribe & Save */}
            {purchaseType === "subscription" && (
              <div className="bg-background p-8 rounded-2xl shadow-lg flex flex-col min-h-[320px]">
                <h3 className="text-2xl font-bold mb-6">Subscribe & Save</h3>
                <div className="grid md:grid-cols-1 gap-6 flex-1">
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
                          <SelectItem value="noon">
                            Noon (12PM - 4PM)
                          </SelectItem>
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
            )}
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs - White Background */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-8 h-auto">
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
