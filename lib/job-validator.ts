type JobInput = {
  url?: string;
  job_title?: string;
  company?: string;
  location?: string;
  requirements_text: string;
  label_skill?: string;
};

export class JobValidator {
  static validate(data: JobInput) {
    if (!data.requirements_text || data.requirements_text.trim() === "") {
      throw new Error("Requirements text is mandatory");
    }

    if (data.url && !/^https?:\/\//i.test(data.url.trim())) {
      throw new Error("URL must start with http:// or https://");
    }

    if (data.job_title !== undefined && data.job_title.trim().length < 2) {
      throw new Error("Job title format is invalid");
    }

    if (data.company !== undefined && data.company.trim().length < 2) {
      throw new Error("Company format is invalid");
    }

    if (data.label_skill !== undefined && data.label_skill.trim() === "") {
      throw new Error("Label skill format is invalid");
    }

    return true;
  }
}
