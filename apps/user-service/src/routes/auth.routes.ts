import Router from "elysia";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";

const router = new Router();

// Simplified user registration example
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();
    res.statusCode = 201; // Created
    return res.json({ message: "User created" });
  } catch (error) {
    res.statusCode = 500; // Internal Server Error
    return res.json({ message: "Error creating user" });
  }
});

// More routes (login, etc.) here...

export default router;
