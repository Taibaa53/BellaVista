import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Image URLs use Pexels CDN (compress + width) — reliable for hotlinking in dev.
 * INR pricing — mid-range dine-in.
 */
const menuItems = [
  // Starters
  {
    name: "Bruschetta Trio",
    category: "Starters",
    price: 395,
    image:
      "https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Caprese Salad",
    category: "Starters",
    price: 445,
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Roasted Tomato Soup",
    category: "Starters",
    price: 335,
    image:
      "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Crispy Spring Rolls",
    category: "Starters",
    price: 365,
    image:
      "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Herb Stuffed Mushrooms",
    category: "Starters",
    price: 415,
    image:
      "https://images.pexels.com/photos/621074/pexels-photo-621074.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  // Main course
  {
    name: "Grilled Salmon",
    category: "Main Course",
    price: 925,
    image:
      "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: true,
  },
  {
    name: "Wood-Fired Margherita",
    category: "Main Course",
    price: 595,
    image:
      "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Chargrilled Ribeye",
    category: "Main Course",
    price: 1085,
    image:
      "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Pasta Carbonara",
    category: "Main Course",
    price: 675,
    image:
      "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: true,
  },
  {
    name: "Butter Chicken & Naan",
    category: "Main Course",
    price: 695,
    image:
      "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  // Desserts
  {
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 395,
    image:
      "https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Classic Tiramisu",
    category: "Desserts",
    price: 425,
    image:
      "https://images.pexels.com/photos/6210746/pexels-photo-6210746.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Berry Parfait",
    category: "Desserts",
    price: 345,
    image:
      "https://images.pexels.com/photos/1565294/pexels-photo-1565294.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Vanilla Bean Ice Cream",
    category: "Desserts",
    price: 315,
    image:
      "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  // Beverages
  {
    name: "Fresh Mint Lemonade",
    category: "Beverages",
    price: 185,
    image:
      "https://images.pexels.com/photos/1200355/pexels-photo-1200355.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Double Espresso",
    category: "Beverages",
    price: 165,
    image:
      "https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "House Red Wine (Glass)",
    category: "Beverages",
    price: 485,
    image:
      "https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
  {
    name: "Mango Lassi",
    category: "Beverages",
    price: 195,
    image:
      "https://images.pexels.com/photos/5949880/pexels-photo-5949880.jpeg?auto=compress&cs=tinysrgb&w=800",
    isChefsSpecial: false,
  },
];

async function main() {
  await prisma.menu.deleteMany({});
  for (const item of menuItems) {
    await prisma.menu.create({ data: item });
  }
  console.log("Seeded", menuItems.length, "menu items (INR)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
