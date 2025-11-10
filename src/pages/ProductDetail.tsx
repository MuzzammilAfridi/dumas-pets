import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { getProductById } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Pet Food Customization States
  const [meatType, setMeatType] = useState<string>("");
  const [grainType, setGrainType] = useState<string>("");
  const [grainPercentage, setGrainPercentage] = useState<number>(0);
  const [vegetables, setVegetables] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<string>("100g");
  const [preparationInstructions, setPreparationInstructions] = useState<string>("");

  // Standard Product States
  const [standardQuantity, setStandardQuantity] = useState<number>(1);

  // Subscription States
  const [subscriptionDate, setSubscriptionDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<'morning' | 'noon' | 'evening'>('morning');

  // Review States
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

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

  const isPetFood = product.category === "PET FOOD";

  const handleVegetableToggle = (veg: string) => {
    setVegetables(prev =>
      prev.includes(veg) ? prev.filter(v => v !== veg) : [...prev, veg]
    );
  };

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: isPetFood ? 1 : standardQuantity,
      ...(isPetFood && {
        customization: {
          meatType,
          grainType,
          grainPercentage,
          vegetables,
          preparationInstructions,
        }
      })
    };

    addToCart(cartItem);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleSubscribe = () => {
    if (!subscriptionDate) {
      toast({
        title: "Select a Date",
        description: "Please select a delivery date for your subscription.",
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: isPetFood ? 1 : standardQuantity,
      subscription: {
        frequency: "monthly",
        date: subscriptionDate,
        timeSlot,
      },
      ...(isPetFood && {
        customization: {
          meatType,
          grainType,
          grainPercentage,
          vegetables,
          preparationInstructions,
        }
      })
    };

    addToCart(cartItem);
    toast({
      title: "Subscription Created",
      description: `Your subscription for ${product.name} has been set up.`,
    });
  };

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

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Product Header - White Background */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-lg text-muted-foreground mb-8">{product.description}</p>

              {/* PET FOOD Advanced Customization */}
              {isPetFood && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="meat-type" className="text-base font-semibold mb-2 block">
                      Meat Type *
                    </Label>
                    <Select value={meatType} onValueChange={setMeatType}>
                      <SelectTrigger id="meat-type">
                        <SelectValue placeholder="Select meat type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chicken">Chicken</SelectItem>
                        <SelectItem value="Buffalo">Buffalo</SelectItem>
                        <SelectItem value="Mutton">Mutton</SelectItem>
                        <SelectItem value="Fish">Fish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="grain-type" className="text-base font-semibold mb-2 block">
                      Grain Type *
                    </Label>
                    <Select value={grainType} onValueChange={(val) => {
                      setGrainType(val);
                      if (val === "No grain") setGrainPercentage(0);
                    }}>
                      <SelectTrigger id="grain-type">
                        <SelectValue placeholder="Select grain type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No grain">No grain</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                        <SelectItem value="Rice">Rice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {grainType && grainType !== "No grain" && (
                    <div>
                      <Label htmlFor="grain-percentage" className="text-base font-semibold mb-2 block">
                        Grain Percentage *
                      </Label>
                      <Select value={grainPercentage.toString()} onValueChange={(val) => setGrainPercentage(Number(val))}>
                        <SelectTrigger id="grain-percentage">
                          <SelectValue placeholder="Select percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(pct => (
                            <SelectItem key={pct} value={pct.toString()}>{pct}%</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Vegetables</Label>
                    <div className="space-y-3">
                      {["Carrot", "Pumpkin", "Sweet Potato", "No veg"].map(veg => (
                        <div key={veg} className="flex items-center space-x-2">
                          <Checkbox
                            id={veg}
                            checked={vegetables.includes(veg)}
                            onCheckedChange={() => handleVegetableToggle(veg)}
                          />
                          <label htmlFor={veg} className="text-sm font-medium cursor-pointer">
                            {veg}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="text-base font-semibold mb-2 block">
                      Quantity *
                    </Label>
                    <Select value={quantity} onValueChange={setQuantity}>
                      <SelectTrigger id="quantity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["100g", "200g", "300g", "400g", "500g", "600g", "700g", "800g", "900g", "1kg"].map(q => (
                          <SelectItem key={q} value={q}>{q}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="prep-instructions" className="text-base font-semibold mb-2 block">
                      Preparation Instructions
                    </Label>
                    <Textarea
                      id="prep-instructions"
                      value={preparationInstructions}
                      onChange={(e) => setPreparationInstructions(e.target.value)}
                      placeholder="Enter any special preparation instructions..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              )}

              {/* TREATS & CAKES Standard Selection */}
              {!isPetFood && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="std-quantity" className="text-base font-semibold mb-2 block">
                      Quantity
                    </Label>
                    <Select value={standardQuantity.toString()} onValueChange={(val) => setStandardQuantity(Number(val))}>
                      <SelectTrigger id="std-quantity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => (
                          <SelectItem key={q} value={q.toString()}>{q}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Options - Orange Background */}
      <section className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Add to Cart */}
            <div className="bg-background p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">One-Time Purchase</h3>
              <Button size="xl" onClick={handleAddToCart} className="w-full text-lg">
                Add to Cart
              </Button>
            </div>

            {/* Subscribe */}
            <div className="bg-background p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Subscribe & Save</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Delivery Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !subscriptionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {subscriptionDate ? format(subscriptionDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={subscriptionDate}
                        onSelect={setSubscriptionDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Time Slot</Label>
                  <Select value={timeSlot} onValueChange={(val: any) => setTimeSlot(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                      <SelectItem value="noon">Noon (12PM - 4PM)</SelectItem>
                      <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button size="xl" onClick={handleSubscribe} variant="secondary" className="w-full text-lg">
                Subscribe Now
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
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Cooking & Specs</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="review">Write Review</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <h3 className="text-2xl font-bold">Product Description</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4">
              <h3 className="text-2xl font-bold">Cooking Instructions & Specifications</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{product.specifications}</p>
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
                          i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-2">{testimonial.comment}</p>
                  <p className="text-sm font-semibold">— {testimonial.author}</p>
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
                  <Select value={reviewRating.toString()} onValueChange={(val) => setReviewRating(Number(val))}>
                    <SelectTrigger id="review-rating">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map(r => (
                        <SelectItem key={r} value={r.toString()}>{r} Stars</SelectItem>
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
                <Button type="submit" size="lg">Submit Review</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition Scheme</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
