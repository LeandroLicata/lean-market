import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function getUsers() {
  try {
    const users = await prisma.users.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Error fetching users", { status: 500 });
  }
}
