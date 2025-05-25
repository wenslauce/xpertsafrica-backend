import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import whmcsRoutes from './routes/whmcs.routes';
import { apiKeyAuth, requestLogger } from './middlewares/auth.middleware';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API key auth disabled for testing
// if (process.env.NODE_ENV === 'production') {
//   app.use('/api', apiKeyAuth as express.RequestHandler);
// }

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Get allowed origins from env var and split by comma
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',');
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Origin ${origin} not allowed by CORS`);
      callback(null, true); // Temporarily allow all origins while testing
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY']
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes - available at both paths for compatibility
app.use('/api/whmcs', whmcsRoutes);
// Also make routes available without /api prefix for direct testing
app.use('/whmcs', whmcsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    result: 'error',
    message: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export default app;
