import { Project, SubTask, Mentor } from './types';

export const INITIAL_PROJECT: Project = {
  id: 'shopez-ecommerce',
  title: 'SHOPEZ : E-commerce Application',
  tags: ['Retail', 'Group'],
  description: 'ShopEZ is your one-stop destination for effortless online shopping. With a user-friendly interface and a comprehensive product catalog, finding the perfect items has never been easier. Seamlessly navigate through detailed product descriptions, customer reviews, and available discounts to make informed decisions. Enjoy a secure checkout process and receive instant order confirmation. For sellers, our robust dashboard provides efficient order management and insightful analytics to drive business growth. Experience the future of online shopping with ShopEZ today.',
  skillsRequired: [
    'HTML5',
    'CSS3',
    'JavaScript',
    'React.js (Javascript Library)',
    'Node.js (Javascript Library)',
    'Express.js (Javascript Library)',
    'MongoDB',
    '.NET Development'
  ],
  complexity: 'Medium',
  duration: '56m',
  status: 'pending', // Starts as 'pending' to showcase the "Accept Project Requirements" screen!
  progress: 0
};

export const DEFAULT_MENTOR: Mentor = {
  name: "Sarah Jenkins",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  role: "Senior Full Stack Dev & Project Mentor"
};

export const INITIAL_SUBTASKS: SubTask[] = [
  // Backend Dev tasks
  {
    id: 'back-1',
    title: 'Initialize Node/Express backend & set up routing framework',
    description: 'Set up package.json, configure tsconfig for backend TypeScript compilation, initialize Express application, and define robust folder structure (controllers, models, routes).',
    status: 'todo',
    category: 'backend',
    detailedSteps: [
      'Create standard express entrypoint in server.ts',
      'Mount middlewares for parsing json requests and cors settings',
      'Create folder structure for models, views, and controller endpoints',
      'Set up a healthcheck API route and verify server starts properly'
    ]
  },
  {
    id: 'back-2',
    title: 'Implement User JWT Authentication & secure middlewares',
    description: 'Create endpoints for user register and login. Implement secure password hashing with bcrypt, sign JSON Web Tokens, and write a verification middleware to secure private routes.',
    status: 'todo',
    category: 'backend',
    detailedSteps: [
      'Design register and login controllers with credential checks',
      'Hash passwords securely using bcrypt/bcryptjs prior to storage',
      'Generate JWT tokens on successful logins',
      'Write checkAuth middleware to authorize specific REST endpoints'
    ]
  },
  {
    id: 'back-3',
    title: 'Create RESTful APIs for Products and Cart CRUD operations',
    description: 'Build robust controllers to handle fetching products with search/filters, and managing items inside the persistent shopping cart.',
    status: 'todo',
    category: 'backend',
    detailedSteps: [
      'Write route for GET /api/products with title and tag queries',
      'Write API route for POST /api/cart to append/update product quantities',
      'Implement item removal and clear cart endpoints'
    ]
  },

  // Frontend Dev tasks
  {
    id: 'front-1',
    title: 'Build responsive product catalog & category filters',
    description: 'Create clean, grid-aligned card layouts for products featuring high-contrast typography, interactive zoom effects, price labels, and category selector pills.',
    status: 'todo',
    category: 'frontend',
    detailedSteps: [
      'Design modular ProductCard component using modern Tailwind styles',
      'Implement interactive Search bar and filtering tabs',
      'Set up state manager to store filtered search results',
      'Ensure grid transitions smoothly across small and large viewports'
    ]
  },
  {
    id: 'front-2',
    title: 'Develop Interactive Cart drawer & Checkout process',
    description: 'Create an engaging slide-out cart panel summarizing selected items, subtotal calculation, quantity steppers, and a Multi-step Checkout layout.',
    status: 'todo',
    category: 'frontend',
    detailedSteps: [
      'Write interactive drawer component showing cart item counts',
      'Add plus/minus buttons to adjust checkout product amounts',
      'Design responsive checkout page containing shipment address forms',
      'Hook submit button to call the secure backend checkout API'
    ]
  },
  {
    id: 'front-3',
    title: 'Add status animations & real-time order tracking',
    description: 'Enhance visual quality using motion transition effects on item additions, checkout status updates, and a progress tracker for active shipments.',
    status: 'todo',
    category: 'frontend',
    detailedSteps: [
      'Animate button clicks with active scale feedback',
      'Render a visual stepper diagram detailing order preparation states',
      'Display helpful alert banners upon checkout complete'
    ]
  },

  // Database Management tasks
  {
    id: 'db-1',
    title: 'Design MongoDB collections schemas & indexing configurations',
    description: 'Structure Mongoose schemas for User, Product, and Order models. Setup appropriate validation constraints and indexes to optimize lookup speeds.',
    status: 'todo',
    category: 'database',
    detailedSteps: [
      'Draft mongoose schema definitions with type validation rules',
      'Configure product name and category fields with lookup index tags',
      'Set up database connection module with auto-reconnect listeners'
    ]
  },
  {
    id: 'db-2',
    title: 'Set up Seed script with rich dummy inventory records',
    description: 'Write a background utility script to populate the database with varied product records, high-resolution image links, and inventory thresholds.',
    status: 'todo',
    category: 'database',
    detailedSteps: [
      'Create data list detailing product prices, images, and descriptions',
      'Write seed script to purge existing collections and inject records',
      'Integrate command to allow mentor/developer to trigger seeds'
    ]
  }
];

export const HARDWARE_REQUIREMENTS = [
  {
    title: 'Processor',
    icon: 'memory',
    value: 'Intel Core i5 (8th Gen+)'
  },
  {
    title: 'RAM',
    icon: 'developer_board',
    value: '8 GB (16 GB Recommended)'
  },
  {
    title: 'Storage',
    icon: 'hard_drive',
    value: '1 GB Free Space'
  },
  {
    title: 'Display',
    icon: 'monitor',
    value: '1366x768 or higher'
  }
];
