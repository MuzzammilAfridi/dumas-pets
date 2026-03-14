import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useCart, CartItem } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Edit,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  Package,
  CalendarDays,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import buffaloMeal from "@/assets/buffalo-meal.webp";

// Mock cart items for UI preview
const MOCK_CART_ITEMS: CartItem[] = [
  {
    productId: "pf1",
    name: "Premium Chicken & Rice",
    price: 24.99,
    image: buffaloMeal,
    category: "PET FOOD",
    quantity: 1,
    purchaseType: "subscription",
    customization: {
      meatType: "Chicken",
      grainType: "Rice",
      vegetables: ["Carrot"],
    },
    subscription: {
      frequency: "weekly",
      startDate: new Date("2026-03-15"),
      endDate: new Date("2026-04-15"),
      timeSlot: "morning",
      deliveryDays: ["Mon", "Wed", "Fri"],
    },
  },
  {
    productId: "tr1",
    name: "Crunchy Chicken Bites",
    price: 12.99,
    image: buffaloMeal,
    category: "TREATS",
    quantity: 2,
    purchaseType: "onetime",
    subscription: {
      frequency: "once",
      date: new Date("2026-03-20"),
      timeSlot: "noon",
    },
  },
  {
    productId: "ck1",
    name: "Birthday Celebration Cake",
    price: 34.99,
    image: buffaloMeal,
    category: "CAKES",
    quantity: 1,
    purchaseType: "onetime",
    subscription: {
      frequency: "once",
      date: new Date("2026-03-22"),
      timeSlot: "evening",
    },
  },
  {
    productId: "pf3",
    name: "Fish & Vegetable Delight",
    price: 26.99,
    image: buffaloMeal,
    category: "PET FOOD",
    quantity: 1,
    purchaseType: "subscription",
    customization: {
      meatType: "Fish",
      grainType: "No grain",
      vegetables: ["Sweet Potato"],
    },
    subscription: {
      frequency: "weekly",
      startDate: new Date("2026-03-16"),
      endDate: new Date("2026-04-10"),
      timeSlot: "evening",
      deliveryDays: ["Tue", "Thu", "Sat"],
    },
  },
];

const timeSlotLabels: Record<string, string> = {
  morning: "Morning (8AM - 12PM)",
  noon: "Noon (12PM - 4PM)",
  evening: "Evening (4PM - 8PM)",
};

function countDeliveryDaysInRange(
  start: Date,
  end: Date,
  days: string[]
): number {
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const selectedDayNumbers = days.map((d) => dayMap[d]);
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    if (selectedDayNumbers.includes(current.getDay())) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

const Cart = () => {
  const { items: cartItems, removeFromCart, updateQuantity, clearCart, getItemCount } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use mock items if cart is empty for preview
  const displayItems = cartItems.length > 0 ? cartItems : MOCK_CART_ITEMS;
  const isUsingMock = cartItems.length === 0;

  // Customer details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Checkout mobile collapse
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const getItemTotal = (item: CartItem) => {
    if (item.purchaseType === "subscription" && item.subscription?.startDate && item.subscription?.endDate && item.subscription?.deliveryDays) {
      const deliveryCount = countDeliveryDaysInRange(
        item.subscription.startDate,
        item.subscription.endDate,
        item.subscription.deliveryDays
      );
      const subscriptionPrice = item.price * 0.84;
      return subscriptionPrice * item.quantity * deliveryCount;
    }
    return item.price * item.quantity;
  };

  const getDeliveryDayCount = (item: CartItem) => {
    if (item.subscription?.startDate && item.subscription?.endDate && item.subscription?.deliveryDays) {
      return countDeliveryDaysInRange(item.subscription.startDate, item.subscription.endDate, item.subscription.deliveryDays);
    }
    return 0;
  };

  const subtotal = displayItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  const deliveryCharge = subtotal > 100 ? 0 : 5.99;
  const subscriptionDiscount = displayItems
    .filter((i) => i.purchaseType === "subscription")
    .reduce((sum, item) => {
      const dayCount = getDeliveryDayCount(item);
      return sum + item.price * 0.16 * item.quantity * (dayCount || 1);
    }, 0);
  const grandTotal = subtotal + deliveryCharge;

  const handleQuantityChange = (productId: string, delta: number, current: number) => {
    const newQty = Math.max(1, current + delta);
    if (!isUsingMock) updateQuantity(productId, newQty);
  };

  const handleRemove = (productId: string) => {
    if (!isUsingMock) removeFromCart(productId);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email is required";
    if (!phone.trim() || phone.length < 10) errs.phone = "Valid phone number is required";
    if (!address.trim()) errs.address = "Address is required";
    if (!pincode.trim() || pincode.length < 5) errs.pincode = "Valid pincode is required";
    if (paymentMethod === "card") {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Valid card number required";
      if (!cardExpiry.trim()) errs.cardExpiry = "Expiry date required";
      if (!cardCvv.trim() || cardCvv.length < 3) errs.cardCvv = "Valid CVV required";
      if (!cardName.trim()) errs.cardName = "Name on card required";
    }
    if (paymentMethod === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) errs.upiId = "Valid UPI ID required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderId(`ORD-${Date.now().toString().slice(-6)}`);
      setOrderSuccess(true);
      if (!isUsingMock) clearCart();
    }, 2000);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="max-w-lg w-full p-10 text-center space-y-6 shadow-xl rounded-2xl">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
            <p className="text-muted-foreground">Your order has been confirmed and is being processed.</p>
            <div className="bg-primary/10 rounded-xl p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-2xl font-bold text-primary">{orderId}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-left space-y-1">
              <p className="text-sm font-semibold">Order Summary</p>
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Delivery</span><span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge.toFixed(2)}`}</span></div>
              {subscriptionDiscount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Subscription Savings</span><span>-₹{subscriptionDiscount.toFixed(2)}</span></div>}
              <Separator className="my-1" />
              <div className="flex justify-between font-bold"><span>Grand Total</span><span className="text-primary">₹{grandTotal.toFixed(2)}</span></div>
            </div>
            <Button size="xl" className="w-full" onClick={() => navigate("/shop")}>
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Empty cart state (only when actually empty and no mock)
  if (cartItems.length === 0 && !isUsingMock) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-muted-foreground">Looks like you haven't added any items yet.</p>
          <Button size="lg" onClick={() => navigate("/shop")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          Shopping Cart
          <Badge variant="secondary" className="text-base px-3 py-1">
            {displayItems.length} {displayItems.length === 1 ? "item" : "items"}
          </Badge>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT — Cart Items (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            {displayItems.map((item, idx) => {
              const isSubscription = item.purchaseType === "subscription";
              const dayCount = getDeliveryDayCount(item);
              const subscriptionPrice = (item.price * 0.84);
              const itemTotal = getItemTotal(item);

              return (
                <Card key={`${item.productId}-${idx}`} className="p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Image */}
                    <img
                      src={item.image || buffaloMeal}
                      alt={item.name}
                      className="w-full sm:w-32 h-32 object-cover rounded-xl"
                    />

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                              {item.category || "PET FOOD"}
                            </Badge>
                            <Badge
                              className={cn(
                                "text-xs",
                                isSubscription
                                  ? "bg-primary/10 text-primary border-primary/30"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {isSubscription ? "Subscription" : "One Time"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => handleRemove(item.productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Customization */}
                      {item.customization && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {item.customization.meatType && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                              🥩 {item.customization.meatType}
                            </span>
                          )}
                          {item.customization.grainType && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                              🌾 {item.customization.grainType}
                            </span>
                          )}
                          {item.customization.vegetables && item.customization.vegetables.length > 0 && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                              🥕 {item.customization.vegetables.join(", ")}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Delivery Info */}
                      {isSubscription && item.subscription ? (
                        <div className="bg-primary/5 rounded-xl p-3 space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarDays className="w-4 h-4 text-primary" />
                            <span>
                              {item.subscription.startDate && format(item.subscription.startDate, "MMM d")} —{" "}
                              {item.subscription.endDate && format(item.subscription.endDate, "MMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{item.subscription.timeSlot ? timeSlotLabels[item.subscription.timeSlot] : "—"}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.subscription.deliveryDays?.map((d) => (
                              <Badge key={d} variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary">
                                {d}
                              </Badge>
                            ))}
                          </div>
                          <Separator />
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Delivery Days</span>
                              <p className="font-bold text-primary">{dayCount}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Daily Qty</span>
                              <p className="font-bold">{item.quantity}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total Qty</span>
                              <p className="font-bold">{item.quantity * dayCount}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Price/Day</span>
                              <p className="font-bold text-primary">₹{subscriptionPrice.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4 text-primary" />
                            <span>{item.subscription?.date ? format(item.subscription.date, "MMM d, yyyy") : "—"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{item.subscription?.timeSlot ? timeSlotLabels[item.subscription.timeSlot] : "—"}</span>
                          </div>
                        </div>
                      )}

                      {/* Quantity + Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleQuantityChange(item.productId, -1, item.quantity)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleQuantityChange(item.productId, 1, item.quantity)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-primary ml-2" onClick={() => navigate(`/product/${item.productId}`)}>
                            <Edit className="w-3 h-3 mr-1" /> Edit
                          </Button>
                        </div>
                        <div className="text-right">
                          {isSubscription && (
                            <p className="text-xs text-muted-foreground line-through">₹{(item.price * item.quantity * (dayCount || 1)).toFixed(2)}</p>
                          )}
                          <p className="text-lg font-bold text-primary">₹{itemTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* RIGHT — Checkout (1/3 width, sticky) */}
          <div className="lg:col-span-1">
            {/* Mobile toggle */}
            <Button
              variant="outline"
              className="w-full lg:hidden mb-4"
              onClick={() => setCheckoutOpen(!checkoutOpen)}
            >
              {checkoutOpen ? "Hide Checkout" : "Proceed to Checkout"}
            </Button>

            <div className={cn("lg:sticky lg:top-24 space-y-6", !checkoutOpen && "hidden lg:block")}>
              {/* Customer Details */}
              <Card className="p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Delivery Details
                </h3>
                <div className="space-y-3">
                  <FormField label="Full Name" value={fullName} onChange={setFullName} error={errors.fullName} placeholder="John Doe" />
                  <FormField label="Email" value={email} onChange={setEmail} error={errors.email} placeholder="john@example.com" type="email" />
                  <FormField label="Phone Number" value={phone} onChange={setPhone} error={errors.phone} placeholder="+1 555 000 0000" type="tel" />
                  <FormField label="Delivery Address" value={address} onChange={setAddress} error={errors.address} placeholder="123 Main Street" />
                  <FormField label="Landmark" value={landmark} onChange={setLandmark} placeholder="Near park" />
                  <FormField label="Pincode" value={pincode} onChange={setPincode} error={errors.pincode} placeholder="97201" />
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                </h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                  <label className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all", paymentMethod === "card" && "bg-primary/10 border-primary/30")}>
                    <RadioGroupItem value="card" className="border-primary text-primary" />
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Credit / Debit Card</span>
                  </label>
                  <label className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all", paymentMethod === "upi" && "bg-primary/10 border-primary/30")}>
                    <RadioGroupItem value="upi" className="border-primary text-primary" />
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">UPI</span>
                  </label>
                  <label className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all", paymentMethod === "cod" && "bg-primary/10 border-primary/30")}>
                    <RadioGroupItem value="cod" className="border-primary text-primary" />
                    <Banknote className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Cash on Delivery</span>
                  </label>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-3 pt-2">
                    <FormField label="Card Number" value={cardNumber} onChange={setCardNumber} error={errors.cardNumber} placeholder="1234 5678 9012 3456" />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Expiry" value={cardExpiry} onChange={setCardExpiry} error={errors.cardExpiry} placeholder="MM/YY" />
                      <FormField label="CVV" value={cardCvv} onChange={setCardCvv} error={errors.cardCvv} placeholder="123" />
                    </div>
                    <FormField label="Name on Card" value={cardName} onChange={setCardName} error={errors.cardName} placeholder="John Doe" />
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="pt-2">
                    <FormField label="UPI ID" value={upiId} onChange={setUpiId} error={errors.upiId} placeholder="name@upi" />
                  </div>
                )}
              </Card>

              {/* Order Summary */}
              <Card className="p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-lg font-bold">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cart Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <span className="font-medium">{deliveryCharge === 0 ? <span className="text-green-600">Free</span> : `₹${deliveryCharge.toFixed(2)}`}</span>
                  </div>
                  {subscriptionDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Subscription Savings</span>
                      <span className="font-medium">-${subscriptionDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                {subscriptionDiscount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <p className="text-sm text-green-700 font-semibold">
                      🎉 You're saving ${subscriptionDiscount.toFixed(2)} with subscriptions!
                    </p>
                  </div>
                )}
                <Button
                  size="xl"
                  className="w-full text-lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay Now — ${grandTotal.toFixed(2)}
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable form field
function FormField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold mb-1 block">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "rounded-lg",
          value && "bg-primary/10 border-primary/30",
          error && "border-destructive"
        )}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default Cart;
