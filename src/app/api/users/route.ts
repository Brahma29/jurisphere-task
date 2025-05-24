import { NextResponse } from "next/server";
import { data } from "@/constants/dummy-data";

export async function GET() {
  try {
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
