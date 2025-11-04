import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createAdminLog = async (req: Request, res: Response) => {
  try {
    const { admin_id, action, details } = req.body;

    if (!admin_id || !action) {
      return res.status(400).json({ error: "admin_id and action are required" });
    }

    const admin = await prisma.user.findUnique({
      where: { id: admin_id },
    });

    if (!admin || admin.role !== "ADMIN") {
      return res.status(404).json({ error: "Admin not found or invalid role" });
    }

    const log = await prisma.adminLog.create({
      data: {
        admin_fk: admin_id,
        action,
        details,
      },
      include: {
        admin: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });

    res.status(201).json(log);
  } catch (error) {
    console.error("Error creating admin log:", error);
    res.status(500).json({ error: "Failed to create admin log" });
  }
};

export const getAllAdminLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.adminLog.findMany({
      include: {
        admin: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    res.status(500).json({ error: "Failed to fetch admin logs" });
  }
};
