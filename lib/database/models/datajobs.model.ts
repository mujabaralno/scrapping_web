import mongoose, { Schema, Document, models } from "mongoose";

export interface IDataJob extends Document {
  url: string;
  job_title: string;
  company: string;
  location: string;
  requirements_text: string;
  label_skill: string;
  date_scraped: Date;
}

const DataJobSchema = new Schema<IDataJob>(
  {
    url: { type: String,},
    job_title: { type: String, },
    company: { type: String,},
    location: { type: String, },
    requirements_text: { type: String, required: true },
    label_skill: { type: String },
  },
  { timestamps: true }
);


const DataJob =
  models.DataJob || mongoose.model<IDataJob>("DataJob", DataJobSchema);

export default DataJob;
