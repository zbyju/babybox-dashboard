// src/server.ts
import { Elysia } from "elysia";
import connectDB from "./db";
import userRoutes from "./routes/user.routes"; // Import your user routes
import authRoutes from "./routes/auth.routes"; // Import your auth routes

// Connect to MongoDB
connectDB();

// Initialize Elysia server
const server = new Elysia().get("/v1/users");

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
