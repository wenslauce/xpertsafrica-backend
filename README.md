# Xperts Africa Backend API

This is the backend API service for Xperts Africa, designed to be deployed on Render with static IP addresses for WHMCS integration.

## Features

- Express.js REST API with TypeScript
- WHMCS API integration
- CORS configuration for secure frontend communication
- Error handling and logging
- Type safety with TypeScript

## Project Structure

```
├── src/
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Express middlewares
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types/interfaces
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── .env                # Environment variables (not committed to git)
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the following example:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Settings
FRONTEND_URL=http://localhost:3000

# WHMCS API Configuration
WHMCS_API_URL=https://portal.xpertsafrica.com/includes/api.php
WHMCS_API_IDENTIFIER=your-identifier
WHMCS_API_SECRET=your-secret
```

### Development

Run the development server:

```bash
npm run dev
```

### Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Name**: xperts-africa-backend
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Region**: Choose a region close to your users
   - **Plan**: Select a plan with static IP addresses
   - **Environment Variables**: Add all variables from your `.env` file

4. Deploy your service

### Static IP Address

Render provides static IP addresses on paid plans which are essential for WHMCS integration. After deploying, get your static IP from the Render dashboard and whitelist it in your WHMCS admin panel.

## API Endpoints

### WHMCS API

- `POST /api/whmcs` - General WHMCS API endpoint
- `GET /api/whmcs/domains/pricing` - Get domain pricing
- `POST /api/whmcs/domains/check` - Check domain availability
- `GET /api/whmcs/products` - Get available products

## Frontend Integration

Update your frontend application to use the Render backend URL instead of local API routes. In your Next.js application, you'll need to configure the API client to point to the new backend.
