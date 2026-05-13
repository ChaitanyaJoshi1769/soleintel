import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: 'Shoes',
    slug: 'shoes',
    icon: '👟',
    color: '#FF6B6B',
    description: 'Track shoe prices across athletic, casual, and designer brands',
    subcategories: ['Athletic Shoes', 'Running Shoes', 'Casual Shoes', 'Designer Shoes', 'Boots', 'Sandals', 'Work Shoes'],
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: '📱',
    color: '#4ECDC4',
    description: 'Monitor prices on phones, laptops, and tech gadgets',
    subcategories: ['Smartphones', 'Laptops', 'Headphones', 'Tablets', 'Smart Watches', 'Cameras', 'Gaming'],
  },
  {
    name: 'Apparel',
    slug: 'apparel',
    icon: '👕',
    color: '#95E1D3',
    description: 'Track clothing and fashion prices from top retailers',
    subcategories: ['T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Dresses', 'Pants', 'Sweaters'],
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    icon: '🏠',
    color: '#F7DC6F',
    description: 'Monitor furniture, appliances, and kitchen item prices',
    subcategories: ['Bedding', 'Kitchen Appliances', 'Furniture', 'Home Decor', 'Tools', 'Cookware'],
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    icon: '⚽',
    color: '#BB8FCE',
    description: 'Track sports equipment and outdoor gear prices',
    subcategories: ['Athletic Equipment', 'Outdoor Gear', 'Camping', 'Fitness', 'Bikes', 'Yoga'],
  },
];

async function main() {
  console.log('🌱 Starting to seed categories...');

  for (const cat of CATEGORIES) {
    try {
      const category = await prisma.productCategory.upsert({
        where: { slug: cat.slug },
        update: {
          description: cat.description,
          productCount: 0,
          activeTrackers: 0,
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          color: cat.color,
          description: cat.description,
          productCount: 0,
          activeTrackers: 0,
          scrapingRules: {},
          retailerCompatibility: {},
        },
      });

      console.log(`✅ Created/Updated category: ${cat.name}`);

      for (const subName of cat.subcategories) {
        const slug = subName.toLowerCase().replace(/\s+/g, '-');
        await prisma.productSubcategory.upsert({
          where: {
            categoryId_slug: {
              categoryId: category.id,
              slug,
            },
          },
          update: {},
          create: {
            categoryId: category.id,
            name: subName,
            slug,
            description: `${subName} in ${cat.name.toLowerCase()}`,
            productCount: 0,
          },
        });
      }

      console.log(`   └─ Created ${cat.subcategories.length} subcategories`);
    } catch (error) {
      console.error(`❌ Error creating category ${cat.name}:`, error);
    }
  }

  console.log('✨ Seeding complete!');
  console.log('');
  console.log('📊 Summary:');
  const categoryCount = await prisma.productCategory.count();
  const subcategoryCount = await prisma.productSubcategory.count();
  console.log(`   • ${categoryCount} root categories`);
  console.log(`   • ${subcategoryCount} subcategories`);
  console.log('');

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  });
