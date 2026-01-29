/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
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

export async function PATCH(req: Request) {
  try {
    const { id, job_title, company, label_skill } = await req.json();

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid job id" }, { status: 400 });
    }

    const update: {
      job_title?: string;
      company?: string;
      label_skill?: string;
    } = {};

    if (typeof job_title === "string") {
      const trimmedTitle = job_title.trim();
      if (!trimmedTitle) {
        return NextResponse.json(
          { error: "Job title is required" },
          { status: 400 }
        );
      }
      update.job_title = trimmedTitle;
    }

    if (typeof company === "string") {
      const trimmedCompany = company.trim();
      if (!trimmedCompany) {
        return NextResponse.json(
          { error: "Company is required" },
          { status: 400 }
        );
      }
      update.company = trimmedCompany;
    }

    if (typeof label_skill === "string") {
      update.label_skill = label_skill.trim();
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No update fields provided" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updated = await DataJob.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job: updated }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid job id" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await DataJob.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
