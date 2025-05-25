import { Customer, Admin } from "../models/user.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.js";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  console.log(`Generated Access Token: ${accessToken}`);

  return { accessToken, refreshToken };
};

// Admin Login
export const loginAdmin = async (req, reply) => {
  try {
    const { phone, email } = req.body;
    let admin = await Admin.findOne({ phone, email });

    if (!admin) {
      admin = new Admin({
        phone,
        email,
        role: "Admin",
        isActivated: true,
      });
      await admin.save();
    }

    const { accessToken, refreshToken } = generateTokens(admin);
    return reply.send({
      message: "Admin login successful",
      accessToken,
      refreshToken,
      admin,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Customer Login
// Customer Login (no bcrypt)
export const loginCustomer = async (req, reply) => {
  try {
    const { phone, email, name, password } = req.body;

    // Validate required fields
    if (!phone || !email || !name || !password) {
      return reply.status(400).send({
        message: "Phone, email, name, and password are all required",
      });
    }

    // Find customer by phone or email
    let customer = await Customer.findOne({
      $or: [{ email }, { phone }],
    });

    if (!customer) {
      // Create new customer with posted data (password stored as is)
      customer = new Customer({
        phone,
        email,
        name,
        password, // plain text - NOT secure!
        role: "Customer",
        isActivated: true,
      });

      await customer.save();
    } else {
      // Customer exists, check plain text password match
      if (customer.password !== password) {
        return reply.status(401).send({ message: "Invalid credentials" });
      }
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(customer);

    // Send response (excluding password)
    return reply.send({
      message: "Customer login successful",
      accessToken,
      refreshToken,
      customer: {
        id: customer._id,
        phone: customer.phone,
        email: customer.email,
        name: customer.name,
        role: customer.role,
        isActivated: customer.isActivated,
      },
    });
  } catch (error) {
    console.error("Error logging in customer:", error);
    return reply
      .status(500)
      .send({ message: "An error occurred", error: error.message });
  }
};



// Refresh Tokens
export const refreshToken = async (req, reply) => {
  const { refreshToken: providedRefreshToken } = req.body;

  if (!providedRefreshToken) {
    return reply.status(401).send({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(providedRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    let user;
    if (decoded.role === "Admin") {
      user = await Admin.findById(decoded.userId);
    } else if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else {
      return reply.status(403).send({ message: "Invalid role" });
    }

    if (!user) {
      return reply.status(403).send({ message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    return reply.send({
      message: "Token refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return reply.status(403).send({ message: "Invalid refresh token", error });
  }
};

// Fetch Admin or Customer
export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;

    let user;
    if (role === "Admin") {
      user = await Admin.findById(userId).select("-password");
    } else if (role === "Customer") {
      user = await Customer.findById(userId).select("-password");
    } else {
      return reply.status(403).send({ message: "Invalid role" });
    }

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch Customer
export const fetchCustomer = async (req, reply) => {
  try {
    const { userId } = req.user;

    const customer = await Customer.findById(userId).select("-password");

    if (!customer) {
      return reply.status(404).send({ message: "Customer not found" });
    }

    return reply.send({
      message: "Customer fetched successfully",
      customer,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
