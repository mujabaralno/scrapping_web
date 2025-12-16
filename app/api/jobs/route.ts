/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import DataJob from "@/lib/database/models/datajobs.model";

export async function GET() {
  try {
    await connectToDatabase();
    const jobs = await DataJob.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
