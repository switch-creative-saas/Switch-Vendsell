# Switch VendSell - Nigerian eCommerce Platform

A complete eCommerce platform designed specifically for African creators and entrepreneurs. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Instant Store Setup**: Create your online store in minutes with our drag-and-drop builder
- **Nigerian Payments**: Integrated Paystack & Flutterwave for seamless Naira transactions
- **Mobile-First Design**: Your store looks perfect on every device, especially mobile
- **AI-Powered Tools**: Generate product descriptions and get smart pricing suggestions
- **Sales Analytics**: Track your performance with detailed insights and reports
- **Custom Domains**: Use your own domain or get a free .switch.store subdomain

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Paystack Integration
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd switch-creative-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Paystack Configuration
   PAYSTACK_SECRET_KEY=your-paystack-secret-key
   PAYSTACK_PUBLIC_KEY=your-paystack-public-key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database migrations**:
   ```bash
   # Copy the SQL from supabase-schema.sql
   # and run it in your Supabase SQL editor
   ```

3. **Configure Row Level Security (RLS)**:
   - The schema includes RLS policies for data security
   - Users can only access their own data
   - Store owners can only manage their own stores and products

## 📁 Project Structure

```
switch-creative-saas/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── dashboard-layout.tsx
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── auth.ts           # Authentication service
│   ├── database.ts       # Database operations
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── supabase-schema.sql   # Database schema
```

## 🎨 Customization

### Themes
The app uses a custom theme system with CSS variables. You can customize colors in `app/globals.css`.

### Components
All UI components are built with shadcn/ui and can be customized in the `components/ui/` directory.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- Use TypeScript for all new files
- Follow the existing component patterns
- Use Tailwind CSS for styling
- Prefer functional components with hooks

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
NEXT_PUBLIC_APP_URL=your-production-url
```

## 🔒 Security Features

- Supabase RLS (Row Level Security) is enabled
- Users can only access their own data
- Store owners can only manage their own stores
- Secure authentication with Supabase Auth
- Environment variables for sensitive data

## 📞 Support

For support, email support@switchvend.com or join our Discord community.

## 📄 License

This project is licensed under the MIT License. 