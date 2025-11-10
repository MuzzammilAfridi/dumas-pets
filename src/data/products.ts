export type ProductCategory = 'PET FOOD' | 'TREATS' | 'CAKES';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  specifications?: string;
  testimonials?: Array<{
    author: string;
    rating: number;
    comment: string;
  }>;
}

export const products: Product[] = [
  // PET FOOD
  {
    id: 'pf1',
    name: 'Premium Chicken & Rice',
    category: 'PET FOOD',
    price: 24.99,
    originalPrice: 29.99,
    image: '/src/assets/product-1.jpg',
    description: 'High-quality protein-rich meal with wholesome grains, perfect for active dogs.',
    specifications: 'Cook at 350°F for 15-20 minutes. Store in cool, dry place. Shelf life: 6 months.',
    testimonials: [
      { author: 'Sarah M.', rating: 5, comment: 'My dog loves this! Great quality ingredients.' },
      { author: 'John D.', rating: 4, comment: 'Excellent product, my pup is more energetic.' }
    ]
  },
  {
    id: 'pf2',
    name: 'Buffalo & Grain Mix',
    category: 'PET FOOD',
    price: 27.99,
    image: '/src/assets/product-2.jpg',
    description: 'Rich buffalo protein with whole grains for a balanced diet.',
    specifications: 'Serve at room temperature. Mix with warm water if needed.',
    testimonials: [
      { author: 'Emily R.', rating: 5, comment: 'Best food for my sensitive pup!' }
    ]
  },
  {
    id: 'pf3',
    name: 'Fish & Vegetable Delight',
    category: 'PET FOOD',
    price: 26.99,
    image: '/src/assets/product-3.jpg',
    description: 'Omega-3 rich fish with farm-fresh vegetables.',
    specifications: 'Rich in omega fatty acids. Refrigerate after opening.',
    testimonials: [
      { author: 'Mike T.', rating: 5, comment: 'Shiny coat after just 2 weeks!' }
    ]
  },
  {
    id: 'pf4',
    name: 'Mutton & Sweet Potato',
    category: 'PET FOOD',
    price: 28.99,
    originalPrice: 32.99,
    image: '/src/assets/product-4.jpg',
    description: 'Tender mutton with nutrient-rich sweet potatoes.',
    specifications: 'High protein formula. Best served warm.',
    testimonials: [
      { author: 'Lisa K.', rating: 4, comment: 'Great for older dogs with sensitive stomachs.' }
    ]
  },
  {
    id: 'pf5',
    name: 'Grain-Free Chicken',
    category: 'PET FOOD',
    price: 29.99,
    image: '/src/assets/product-5.jpg',
    description: 'Pure chicken protein without any grains, perfect for allergies.',
    specifications: 'Grain-free formula. Consult vet for portion sizes.',
    testimonials: [
      { author: 'Tom W.', rating: 5, comment: 'Finally found something for my allergic dog!' }
    ]
  },
  {
    id: 'pf6',
    name: 'Complete Nutrition Mix',
    category: 'PET FOOD',
    price: 25.99,
    image: '/src/assets/product-6.jpg',
    description: 'Balanced blend of proteins, grains, and vegetables.',
    specifications: 'All-in-one nutrition. Suitable for all breeds.',
    testimonials: [
      { author: 'Anna P.', rating: 5, comment: 'Both my dogs love this mix!' }
    ]
  },

  // TREATS
  {
    id: 'tr1',
    name: 'Crunchy Chicken Bites',
    category: 'TREATS',
    price: 12.99,
    image: '/src/assets/product-1.jpg',
    description: 'Crispy chicken treats perfect for training and rewards.',
    specifications: 'Keep sealed. Use within 3 months of opening.',
    testimonials: [
      { author: 'Rachel S.', rating: 5, comment: 'Perfect training treats!' }
    ]
  },
  {
    id: 'tr2',
    name: 'Peanut Butter Bones',
    category: 'TREATS',
    price: 10.99,
    originalPrice: 13.99,
    image: '/src/assets/product-2.jpg',
    description: 'Delicious peanut butter flavored bone-shaped treats.',
    specifications: 'No artificial colors. Made with natural peanut butter.',
    testimonials: [
      { author: 'David L.', rating: 5, comment: 'My dog goes crazy for these!' }
    ]
  },
  {
    id: 'tr3',
    name: 'Dental Chew Sticks',
    category: 'TREATS',
    price: 14.99,
    image: '/src/assets/product-3.jpg',
    description: 'Healthy dental treats that clean teeth while they chew.',
    specifications: 'Promotes dental health. Long-lasting chew.',
    testimonials: [
      { author: 'Karen B.', rating: 4, comment: 'Great for keeping teeth clean!' }
    ]
  },
  {
    id: 'tr4',
    name: 'Sweet Potato Chips',
    category: 'TREATS',
    price: 11.99,
    image: '/src/assets/product-4.jpg',
    description: 'Crispy sweet potato slices, naturally delicious.',
    specifications: 'Single ingredient. No preservatives.',
    testimonials: [
      { author: 'Steve H.', rating: 5, comment: 'Healthy and tasty!' }
    ]
  },
  {
    id: 'tr5',
    name: 'Beef Jerky Strips',
    category: 'TREATS',
    price: 15.99,
    image: '/src/assets/product-5.jpg',
    description: 'Premium beef jerky strips for the ultimate reward.',
    specifications: 'High protein. Made from real beef.',
    testimonials: [
      { author: 'Nancy G.', rating: 5, comment: 'Best treats ever!' }
    ]
  },
  {
    id: 'tr6',
    name: 'Veggie Crunch Mix',
    category: 'TREATS',
    price: 9.99,
    image: '/src/assets/product-6.jpg',
    description: 'Mixed vegetable treats for health-conscious pups.',
    specifications: 'Low calorie. Rich in vitamins.',
    testimonials: [
      { author: 'Pat M.', rating: 4, comment: 'Guilt-free treats!' }
    ]
  },

  // CAKES
  {
    id: 'ck1',
    name: 'Birthday Celebration Cake',
    category: 'CAKES',
    price: 34.99,
    image: '/src/assets/product-1.jpg',
    description: 'Special birthday cake for your furry friend celebration.',
    specifications: 'Serves 6-8 pets. Refrigerate and consume within 3 days.',
    testimonials: [
      { author: 'Jennifer C.', rating: 5, comment: 'Made my dog\'s birthday special!' }
    ]
  },
  {
    id: 'ck2',
    name: 'Peanut Butter Pupcake',
    category: 'CAKES',
    price: 29.99,
    originalPrice: 34.99,
    image: '/src/assets/product-2.jpg',
    description: 'Delicious peanut butter flavored individual cupcakes.',
    specifications: 'Pack of 4. Freeze for longer storage.',
    testimonials: [
      { author: 'Chris A.', rating: 5, comment: 'My pup loved every bite!' }
    ]
  },
  {
    id: 'ck3',
    name: 'Carrot & Banana Cake',
    category: 'CAKES',
    price: 32.99,
    image: '/src/assets/product-3.jpg',
    description: 'Healthy carrot and banana cake with cream cheese frosting.',
    specifications: 'No sugar added. Natural sweetness from fruits.',
    testimonials: [
      { author: 'Amanda F.', rating: 5, comment: 'Healthy and delicious!' }
    ]
  },
  {
    id: 'ck4',
    name: 'Mini Celebration Pack',
    category: 'CAKES',
    price: 24.99,
    image: '/src/assets/product-4.jpg',
    description: 'Pack of 6 mini cakes perfect for small gatherings.',
    specifications: 'Variety pack. Individual serving size.',
    testimonials: [
      { author: 'Ryan S.', rating: 4, comment: 'Perfect for doggy playdates!' }
    ]
  },
  {
    id: 'ck5',
    name: 'Pumpkin Spice Cake',
    category: 'CAKES',
    price: 31.99,
    image: '/src/assets/product-5.jpg',
    description: 'Seasonal pumpkin spice cake with yogurt frosting.',
    specifications: 'Fall favorite. Rich in fiber.',
    testimonials: [
      { author: 'Michelle W.', rating: 5, comment: 'Perfect for fall celebrations!' }
    ]
  },
  {
    id: 'ck6',
    name: 'Apple Cinnamon Delight',
    category: 'CAKES',
    price: 30.99,
    image: '/src/assets/product-6.jpg',
    description: 'Warm apple cinnamon cake with honey drizzle.',
    specifications: 'Warm before serving. All natural ingredients.',
    testimonials: [
      { author: 'Brian K.', rating: 5, comment: 'Smells and tastes amazing!' }
    ]
  },
];

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter(p => p.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};
