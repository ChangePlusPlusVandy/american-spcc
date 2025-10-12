import { Request, Response } from "express";
import prisma from "../config/prisma";

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Public (for now)
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 * @desc Get a single user by ID
 * @route GET /api/users/:id
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

/**
 * @desc Create a new user
 * @route POST /api/users
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, role } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const newUser = await prisma.user.create({
      data: { email, lastName, role },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

/**
 * @desc Update user info
 * @route PUT /api/users/:id
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { firstName, lastName, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, role },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

/**
 * @desc Delete a user
 * @route DELETE /api/users/:id
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
