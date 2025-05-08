# ᴄᴏᴡᴏʀᴋɪɴɢ 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It uses the App Router (`/app` directory) and is styled with modern tools for a fast, responsive web experience.

## 🧑‍💻 Project Description

A coworking space booking platform that allows users to browse, book, and manage office spaces, with real-time availability, invoice generation, and admin dashboard.

---

## 📁 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Font Optimization**: [`@next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Hooks + Context API
- **Authentication**: JWT & OTP-based login
- **Database**: MongoDB + Mongoose
- **PDF Generation**: PDFKit
- **Deployment**: [Vercel](https://vercel.com)

---

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install

📂 Folder Structure
/
├── app/                 # App Router directory (pages & layouts)
│   ├── layout.js        # Root layout
│   └── page.js          # Home page
├── components/          # Reusable UI components
├── public/              # Static assets
├── styles/              # Global styles and Tailwind config
├── utils/               # Helper functions
├── middleware.ts        # Middleware (auth, redirects)
├── lib/                 # DB, auth logic, etc.
├── api/                 # Serverless API routes
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS config
└── .env.local           # Environment variables

🔐 Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3000/api
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token

📜 Scripts
Command-: Description
dev-: Starts the development server
build-: Builds the app for production
start-: Starts the production server
lint-: Lints the code using ESLint
format-: Formats code with Prettier

📦 Deployment
Vercel.com
render.com

🧪 Learn More
Next.js Documentation
Tailwind CSS Docs
Framer Motion
Vercel Deployment Docs

📸 Screenshots


![image](https://github.com/user-attachments/assets/a278d76d-b924-485a-ada7-99bc3b827a39)

![image](https://github.com/user-attachments/assets/65cb1661-3e83-4969-8699-3973fd37b07a) 

🧑‍🎓 Author
Name: RITESH

GitHub: @ritesh637

LinkedIn: RITESH KUMAR GOSWAMI
