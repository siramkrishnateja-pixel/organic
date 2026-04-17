// Mock product data with real Unsplash images
export type Category = 'dairy' | 'vegetables' | 'oils' | 'farm';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  stock: number;
  image: string;
  farmName: string;
  farmLocation: string;
  certification: string;
  description: string;
  isSubscriptionEligible: boolean;
  rating: number;
  reviews: number;
  tag?: string;
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Fresh A2 Cow Milk',
    category: 'dairy',
    price: 70,
    unit: '1 Litre',
    stock: 120,
    image: '/products/milk.png',
    farmName: 'Green Pasture Farm',
    farmLocation: 'Anand, Gujarat',
    certification: 'NPOP Certified',
    description: 'Pure A2 milk from desi Gir cows. No additives, no hormones. Delivered fresh every morning.',
    isSubscriptionEligible: true,
    rating: 4.9,
    reviews: 312,
    tag: 'Best Seller'
  },
  {
    id: 'p2',
    name: 'Organic Desi Ghee',
    category: 'dairy',
    price: 650,
    unit: '500 ml',
    stock: 45,
    image: '/products/ghee.png',
    farmName: 'Green Pasture Farm',
    farmLocation: 'Anand, Gujarat',
    certification: 'India Organic',
    description: 'Handcrafted desi ghee using traditional Bilona method from A2 cow milk. Rich aroma, golden color.',
    isSubscriptionEligible: true,
    rating: 4.8,
    reviews: 198,
    tag: 'Premium'
  },
  {
    id: 'p3',
    name: 'Probiotic Curd',
    category: 'dairy',
    price: 55,
    unit: '500 gm',
    stock: 80,
    image: '/products/curd.png',
    farmName: 'Sunrise Organics',
    farmLocation: 'Pune, Maharashtra',
    certification: 'NPOP Certified',
    description: 'Thick, creamy curd set overnight from fresh organic milk. Naturally probiotic, no preservatives.',
    isSubscriptionEligible: true,
    rating: 4.7,
    reviews: 145
  },
  {
    id: 'p4',
    name: 'Fresh Paneer',
    category: 'dairy',
    price: 120,
    unit: '250 gm',
    stock: 30,
    image: '/products/paneer.png',
    farmName: 'Sunrise Organics',
    farmLocation: 'Pune, Maharashtra',
    certification: 'India Organic',
    description: 'Soft, fresh paneer made daily from organic full-fat milk. High protein, no additives.',
    isSubscriptionEligible: false,
    rating: 4.6,
    reviews: 87
  },
  {
    id: 'p5',
    name: 'Organic Vegetable Box',
    category: 'vegetables',
    price: 249,
    unit: '2 kg mix',
    stock: 60,
    image: '/products/vegetables.png',
    farmName: 'Earth Fresh Farms',
    farmLocation: 'Nashik, Maharashtra',
    certification: 'NPOP Certified',
    description: 'Seasonal organic vegetables — spinach, tomatoes, carrots, beans harvested same morning.',
    isSubscriptionEligible: true,
    rating: 4.8,
    reviews: 224,
    tag: 'Fresh Today'
  },
  {
    id: 'p6',
    name: 'Baby Spinach',
    category: 'vegetables',
    price: 45,
    unit: '250 gm',
    stock: 55,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
    farmName: 'Earth Fresh Farms',
    farmLocation: 'Nashik, Maharashtra',
    certification: 'NPOP Certified',
    description: 'Tender baby spinach leaves, grown without pesticides. Rich in iron and vitamins.',
    isSubscriptionEligible: true,
    rating: 4.7,
    reviews: 112
  },
  {
    id: 'p7',
    name: 'Organic Tomatoes',
    category: 'vegetables',
    price: 60,
    unit: '500 gm',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
    farmName: 'Earth Fresh Farms',
    farmLocation: 'Nashik, Maharashtra',
    certification: 'India Organic',
    description: 'Juicy vine-ripened organic tomatoes. Deep red, naturally sweet, no chemical ripening.',
    isSubscriptionEligible: true,
    rating: 4.6,
    reviews: 94
  },
  {
    id: 'p8',
    name: 'Cold-Pressed Coconut Oil',
    category: 'oils',
    price: 380,
    unit: '500 ml',
    stock: 35,
    image: '/products/coconut-oil.png',
    farmName: 'Kerala Nature Farms',
    farmLocation: 'Thrissur, Kerala',
    certification: 'India Organic',
    description: 'Wood-pressed virgin coconut oil. Retains natural fragrance and nutrients. Cold-processed.',
    isSubscriptionEligible: true,
    rating: 4.9,
    reviews: 276,
    tag: 'Cold Pressed'
  },
  {
    id: 'p9',
    name: 'Groundnut Oil',
    category: 'oils',
    price: 290,
    unit: '1 Litre',
    stock: 42,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    farmName: 'Deccan Oil Mills',
    farmLocation: 'Tandur, Telangana',
    certification: 'NPOP Certified',
    description: 'Traditional cold-pressed peanut oil with rich nutty flavour. Unrefined, unfiltered.',
    isSubscriptionEligible: true,
    rating: 4.7,
    reviews: 163
  },
  {
    id: 'p10',
    name: 'Sesame (Gingelly) Oil',
    category: 'oils',
    price: 320,
    unit: '500 ml',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    farmName: 'Deccan Oil Mills',
    farmLocation: 'Tandur, Telangana',
    certification: 'India Organic',
    description: 'Pure sesame oil extracted from organic sesame seeds using traditional rotary press.',
    isSubscriptionEligible: false,
    rating: 4.8,
    reviews: 142
  },
  {
    id: 'p11',
    name: 'Raw Forest Honey',
    category: 'farm',
    price: 450,
    unit: '500 gm',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80',
    farmName: 'Wild Bloom Apiaries',
    farmLocation: 'Coorg, Karnataka',
    certification: 'India Organic',
    description: 'Unfiltered raw forest honey from wild beehives. Contains natural pollen, enzymes, antioxidants.',
    isSubscriptionEligible: false,
    rating: 4.9,
    reviews: 387,
    tag: 'Wild Harvest'
  },
  {
    id: 'p12',
    name: 'Free-Range Farm Eggs',
    category: 'farm',
    price: 90,
    unit: '6 pieces',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d2221?w=400&q=80',
    farmName: 'Happy Hen Farm',
    farmLocation: 'Coimbatore, Tamil Nadu',
    certification: 'NPOP Certified',
    description: 'Eggs from happy free-range hens. No hormones, no antibiotics. Deep orange yolk.',
    isSubscriptionEligible: true,
    rating: 4.7,
    reviews: 208
  }
];

export const categories = [
  { id: 'all', label: 'All Products', icon: '🌿' },
  { id: 'dairy', label: 'Milk & Dairy', icon: '🥛' },
  { id: 'vegetables', label: 'Organic Veggies', icon: '🥦' },
  { id: 'oils', label: 'Organic Oils', icon: '🫙' },
  { id: 'farm', label: 'Farm Products', icon: '🍯' },
];
