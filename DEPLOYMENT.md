# Deployment Instructions

This document outlines the steps to deploy both the backend API on Render and connect the frontend on Vercel.

## Backend Deployment to Render

1. **Create a Render Account**
   - Sign up at [render.com](https://render.com) if you don't already have an account

2. **Create a New Web Service**
   - Click on "New +" and select "Web Service"
   - Connect your GitHub repository (or use the manual deploy option)
   - Select the backend repository (`xperts-africa-backend`)

3. **Configure the Service**
   - **Name**: `xperts-africa-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose a plan with static IPs (Standard plan or higher)

4. **Set Environment Variables**
   - Click on "Environment" and add the following variables:
     ```
     NODE_ENV=production
     PORT=4000
     FRONTEND_URL=https://xperts-africa.vercel.app
     WHMCS_API_URL=https://portal.xpertsafrica.com/includes/api.php
     WHMCS_API_IDENTIFIER=6407sVKbi6KJ2xodYA8gnK8gKN82ZDL8
     WHMCS_API_SECRET=3jWCGDTapFKbaj8pMWt8im3S1ktBtTjI
     ```

5. **Deploy the Service**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete

6. **Get Static IP Address**
   - Once deployed, go to the dashboard
   - Look for "Static IPs" in your service
   - Copy the IP address to whitelist in WHMCS

7. **Test the Deployment**
   - Visit `https://xperts-africa-backend.onrender.com` (or your service URL)
   - You should see the test interface
   - Test the health endpoint and API endpoints

## Frontend Configuration for Vercel

1. **Update Environment Variables**
   - In your Vercel project settings, add or update the environment variable:
     ```
     NEXT_PUBLIC_BACKEND_API_URL=https://xperts-africa-backend.onrender.com/api
     ```

2. **Update WHMCS Configuration**
   - Log in to your WHMCS admin panel
   - Navigate to Setup > General Settings > Security
   - Add the static IP address from Render to the API IP whitelist

3. **Redeploy the Frontend**
   - Trigger a new deployment of your Vercel project
   - This will make the frontend use the new backend API

## Local Development

### Running the Backend Locally
```bash
# Navigate to the backend directory
cd xperts-africa-backend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running the Frontend with Local Backend
Make sure the `.env.local` file in the frontend has:
```
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000/api
```

Then start the frontend:
```bash
# Navigate to the frontend directory
cd xperts-africa

# Start development server
npm run dev
```

## Testing the Integration

1. Make requests from the frontend to the backend
2. Check browser console for any errors
3. Verify that WHMCS API calls are working correctly
4. Test critical functionalities like domain checks and product listings

## Troubleshooting

If you encounter issues with WHMCS API calls, check:
1. IP whitelisting in WHMCS admin panel
2. API credentials in backend environment variables
3. CORS configuration in both frontend and backend
4. Network logs in browser developer tools
