import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে 2 অক্ষরের হতে হবে").trim(),

  phone: z
    .string()
    .min(1, "ফোন নম্বর খালি হতে পারবে না")
    .regex(/^\+?[0-9]\d{1,14}$/, "অবৈধ ফোন নম্বর"),

  email: z.string().email("অবৈধ ইমেইল ঠিকানা"),
  address: z.string().min(1, "ঠিকানা খালি হতে পারবে না"),
  profession: z.string().min(2, "পেশা কমপক্ষে 2 অক্ষরের হতে হবে").trim(),

  professionBio: z.string().min(10, "পেশার বিবরণ কমপক্ষে 10 অক্ষরের হতে হবে").trim(),

  welcomeMessage: z
    .string()
    .min(4, "স্বাগত বার্তা কমপক্ষে 4 অক্ষরের হতে হবে")
    .max(44, "স্বাগত বার্তা সর্বোচ্চ 44 অক্ষরের হতে পারে")
    .trim(),

  socialMedia: z
    .array(
      z.object({
        platformName: z.string().min(1, "প্ল্যাটফর্মের নাম প্রয়োজন"),
        platformLink: z.string().url("অবৈধ লিংক"),
      })
    )
    .min(1, "কমপক্ষে একটি সোশ্যাল লিংক প্রয়োজন"),

  metaDescription: z.string().trim().optional(),

  primaryImage: z
    .union([z.instanceof(File), z.string().url()])
    .refine(
      (value) => typeof value === "string" ? value.length > 0 : value instanceof File,
      { message: "ছবি অবশ্যই প্রয়োজন এবং এটি একটি ফাইল বা বৈধ URL হতে হবে" }
    )
    .refine(
      (value) => value instanceof File ? ["image/jpeg", "image/png", "image/svg+xml"].includes(value.type) : true,
      { message: "শুধু JPEG, PNG, SVG ফরম্যাট গ্রহণযোগ্য" }
    )
    .refine(
      (value) => value instanceof File ? value.size <= 30 * 1024 * 1024 : true,
      { message: "ছবির সাইজ সর্বোচ্চ 30MB হতে পারবে" }
    ),

  secondaryImage: z
    .union([z.instanceof(File), z.string().url()])
    .refine(
      (value) => typeof value === "string" ? value.length > 0 : value instanceof File,
      { message: "ছবি অবশ্যই প্রয়োজন এবং এটি একটি ফাইল বা বৈধ URL হতে হবে" }
    )
    .refine(
      (value) => value instanceof File ? ["image/jpeg", "image/png", "image/svg+xml"].includes(value.type) : true,
      { message: "শুধু JPEG, PNG, SVG ফরম্যাট গ্রহণযোগ্য" }
    )
    .refine(
      (value) => value instanceof File ? value.size <= 30 * 1024 * 1024 : true,
      { message: "ছবির সাইজ সর্বোচ্চ 30MB হতে পারবে" }
    ),

  metaImage: z
    .union([z.instanceof(File), z.string().url(), z.null(), z.undefined()])
    .optional()
    .refine(
      (value) => !value || typeof value === "string" || ["image/jpeg", "image/png", "image/svg+xml"].includes(value.type),
      { message: "শুধু JPEG, PNG, SVG ফরম্যাট গ্রহণযোগ্য" }
    )
    .refine(
      (value) => !value || typeof value === "string" || value.size <= 30 * 1024 * 1024,
      { message: "ছবির সাইজ সর্বোচ্চ 30MB হতে পারবে" }
    ),

  openGraphImage: z
    .union([z.instanceof(File), z.string().url(), z.null(), z.undefined()])
    .optional()
    .refine(
      (value) => !value || typeof value === "string" || ["image/jpeg", "image/png", "image/svg+xml"].includes(value.type),
      { message: "শুধু JPEG, PNG, SVG ফরম্যাট গ্রহণযোগ্য" }
    )
    .refine(
      (value) => !value || typeof value === "string" || value.size <= 30 * 1024 * 1024,
      { message: "ছবির সাইজ সর্বোচ্চ 30MB হতে পারবে" }
    ),

  twitterImage: z
    .union([z.instanceof(File), z.string().url(), z.null(), z.undefined()])
    .optional()
    .refine(
      (value) => !value || typeof value === "string" || ["image/jpeg", "image/png", "image/svg+xml"].includes(value.type),
      { message: "শুধু JPEG, PNG, SVG ফরম্যাট গ্রহণযোগ্য" }
    )
    .refine(
      (value) => !value || typeof value === "string" || value.size <= 30 * 1024 * 1024,
      { message: "ছবির সাইজ সর্বোচ্চ 30MB হতে পারবে" }
    )
});

     


export const blogFormSchema = z.object({
  title: z
    .string()
    .min(4, "টাইটেল কমপক্ষে 4 অক্ষরের হতে হবে")
    .trim(),

  content: z
    .string()
    .min(10, "কনটেন্ট কমপক্ষে 10 অক্ষরের হতে হবে")
    .trim(),

  image: z
    .union([z.instanceof(File), z.string().url(), z.null(), z.undefined()])
    .optional()
    .refine(
      (value) => {
        if (!value || typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/svg+xml"].includes(value.type);
      },
      { message: "শুধুমাত্র JPEG, PNG, SVG ফরম্যাট সমর্থিত" }
    )
    .refine(
      (value) => {
        if (!value || typeof value === "string") return true;
        return value.size <= 30 * 1024 * 1024;
      },
      { message: "ছবির সাইজ 30MB বা তার কম হতে হবে" }
    ),
});

const educationSchema = z.object({
  degree: z
    .string()
    .min(2, "ডিগ্রির নাম কমপক্ষে 2 অক্ষরের হতে হবে")
    .trim(),
  institution: z
    .string()
    .min(2, "প্রতিষ্ঠানের নাম কমপক্ষে 2 অক্ষরের হতে হবে")
    .trim(),
  startYear: z
    .string()
    .regex(/^\d{4}$/, "শুরুর বছরটি 4 সংখ্যার হতে হবে")
    .refine((val) => Number(val) <= new Date().getFullYear(), {
      message: "শুরুর বছর বর্তমান বছরের বেশি হতে পারবে না",
    }),
  endYear: z
    .string()
    .regex(/^\d{4}$|^Present$/, "শেষ বছরটি 4 সংখ্যার বা 'Present' হতে হবে")
    .refine((val) => {
      if (val === "Present") return true;
      return Number(val) >= 1900 && Number(val) <= new Date().getFullYear();
    }, {
      message: "শেষ বছর 1900 থেকে বর্তমান বছরের মধ্যে হতে হবে অথবা 'Present'",
    }),
  desc: z
    .string()
    .min(10, "বর্ণনাটি কমপক্ষে 10 অক্ষরের হতে হবে")
    .trim(),
  cgpa: z
    .number({
      invalid_type_error: "CGPA অবশ্যই একটি সংখ্যা হতে হবে",
      required_error: "CGPA আবশ্যক",
    })
    .min(0, "CGPA কমপক্ষে 0 হতে হবে")
    .max(10, "CGPA সর্বোচ্চ 10 হতে পারবে"),
});


const experienceSchema = z.object({
  profession: z
    .string()
    .min(4, "পেশার নাম কমপক্ষে 4 অক্ষরের হতে হবে")
    .trim(),
  company: z
    .string()
    .min(2, "কোম্পানির নাম কমপক্ষে 2 অক্ষরের হতে হবে")
    .trim(),
  desc: z
    .string()
    .min(6, "বর্ণনাটি কমপক্ষে 6 অক্ষরের হতে হবে")
    .trim(),
  technology: z.array(z.object({ value: z.string() })),
});

export const resumeFormSchema = z.object({
  educationSchema: z
    .array(educationSchema)
    .min(1, "কমপক্ষে 1টি শিক্ষাগত যোগ্যতা যুক্ত করুন"),
  experienceSchema: z
    .array(experienceSchema)
    .min(1, "কমপক্ষে 1টি অভিজ্ঞতা যুক্ত করুন"),
});



const pacakageSchema = z.object({
  title: z
    .string()
    .min(4, "শিরোনাম কমপক্ষে 4 অক্ষরের হতে হবে")
    .trim(),
  desc: z
    .string()
    .min(10, "বর্ণনা কমপক্ষে 10 অক্ষরের হতে হবে")
    .trim(),
  price: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim() === "") return undefined;
      return Number(val);
    },
    z
      .number({
        required_error: "মূল্য আবশ্যক",
        invalid_type_error: "মূল্য অবশ্যই একটি সংখ্যা হতে হবে",
      })
      .min(0, "মূল্য অবশ্যই 0 বা তার চেয়ে বেশি হতে হবে")
  ),
  features: z.array(
    z.object({
      value: z.string().min(1, "প্রতিটি বৈশিষ্ট্য অবশ্যই 1 অক্ষরের বেশি হতে হবে"),
    })
  ),
});

export const pricingFormSchema = z.object({
  basic: pacakageSchema,
  standard: pacakageSchema,
  premium: pacakageSchema,
  orderLink: z
    .string()
    .url("অবৈধ লিংক প্রদান করা হয়েছে")
    .optional()
    .or(z.literal("")),
});


export const portfolioFormSchema = z.object({
  title: z
    .string()
    .min(4, "শিরোনাম কমপক্ষে 4 অক্ষরের হতে হবে")
    .trim(),
  desc: z
    .string()
    .min(6, "বর্ণনা কমপক্ষে 6 অক্ষরের হতে হবে")
    .trim(),
  externalLink: z
    .string()
    .url("অবৈধ লিংক প্রদান করা হয়েছে")
    .optional()
    .or(z.literal("")),
  react: z.coerce
    .number({
      invalid_type_error: "React অবশ্যই একটি সংখ্যা হতে হবে",
      required_error: "React আবশ্যক",
    })
    .min(1, "React কমপক্ষে 1 হতে হবে"),
  technology: z.array(
    z.object({
      image: z.string().url("অবৈধ লিংক প্রদান করা হয়েছে"),
    })
  ),
  image: z
    .union([z.instanceof(File), z.string().url(), z.null()])
    .refine(
      (value) => {
        if (typeof value === "string") {
          return value.length > 0;
        }
        return value instanceof File;
      },
      { message: "ছবি আবশ্যক এবং এটি বৈধ ফাইল বা লিংক হতে হবে" }
    )
    .refine(
      (value) => {
        if (value instanceof File) {
          return [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
            "image/bmp",
            "image/tiff",
            "image/x-icon",
            "image/heic",
          ].includes(value.type);
        }
        return true;
      },
      {
        message:
          "অবৈধ ফাইল ফরম্যাট। অনুমোদিত ফরম্যাট: JPG, PNG, WEBP, GIF, SVG, PDF ইত্যাদি",
      }
    )
    .refine(
      (value) => {
        if (value instanceof File) {
          return value.size <= 30 * 1024 * 1024;
        }
        return true;
      },
      { message: "ফাইলের আকার 30MB এর মধ্যে হতে হবে" }
    ),
});

export const serviceSchema = z.object({
  title: z
    .string()
    .min(4, "শিরোনাম কমপক্ষে 4 অক্ষরের হতে হবে")
    .trim(),
  desc: z
    .string()
    .min(8, "বর্ণনা কমপক্ষে 8 অক্ষরের হতে হবে")
    .trim(),
  services: z
    .array(z.object({ value: z.string().min(1, "সার্ভিস অবশ্যই দিতে হবে") }))
    .min(1, "কমপক্ষে একটি সার্ভিস যুক্ত করতে হবে"),
});

const singleSkillSchema = z.object({
  name: z.string().min(1, "স্কিলের নাম আবশ্যক"),
  desc: z.string().min(1, "স্কিলের বর্ণনা আবশ্যক"),
  image: z
    .union([z.instanceof(File), z.string().url()])
    .refine(
      (value) => {
        if (typeof value === "string") return value.length > 0;
        return value instanceof File;
      },
      { message: "ছবি অবশ্যই প্রদান করতে হবে এবং এটি ফাইল অথবা বৈধ লিংক হতে হবে" }
    )
    .refine(
      (value) => {
        if (value instanceof File) {
          return ["image/jpeg", "image/png", "image/svg+xml"].includes(value.type);
        }
        return true;
      },
      { message: "শুধুমাত্র JPEG, PNG, SVG ফরম্যাট অনুমোদিত" }
    )
    .refine(
      (value) => {
        if (value instanceof File) {
          return value.size <= 30 * 1024 * 1024;
        }
        return true;
      },
      { message: "ছবির আকার 30MB এর কম হতে হবে" }
    ),
});

const skillSectorSchema = z.object({
  title: z.string().min(1, "সেক্টরের শিরোনাম আবশ্যক"),
  skills: z.array(singleSkillSchema).min(1, "কমপক্ষে একটি স্কিল প্রদান করতে হবে"),
});

export const allSkillsFormSchema = z.object({
  sectors: z.array(skillSectorSchema).min(1, "কমপক্ষে একটি সেক্টর প্রদান করতে হবে"),
});


export const testimonialFormSchema = z.object({
  name: z.string().min(1, "নাম প্রদান করা আবশ্যক"),
  authorProfession: z.string().min(1, "পেশা বা ভূমিকা প্রদান করা আবশ্যক"),
  companyName: z.string().min(1, "কোম্পানির নাম প্রদান করা আবশ্যক"),
  image: z
    .union([z.instanceof(File), z.string().url(), z.null()])
    .refine(
      (value) => {
        if (typeof value === "string") return value.length > 0;
        return value instanceof File;
      },
      { message: "ছবি অবশ্যই প্রদান করতে হবে এবং এটি একটি ফাইল বা বৈধ লিংক হতে হবে" }
    )
    .refine(
      (value) => {
        if (value instanceof File) {
          return ["image/jpeg", "image/png", "image/svg+xml"].includes(value.type);
        }
        return true;
      },
      { message: "শুধুমাত্র JPEG, PNG, SVG ফরম্যাট অনুমোদিত" }
    )
    .refine(
      (value) => {
        if (value instanceof File) {
          return value.size <= 30 * 1024 * 1024;
        }
        return true;
      },
      { message: "ছবির আকার 30MB এর কম হতে হবে" }
    ),
  projectTitle: z.string().min(1, "প্রকল্পের শিরোনাম আবশ্যক"),
  platform: z.string().min(1, "প্ল্যাটফর্ম প্রদান করা আবশ্যক"),
  startDate: z.coerce.date().default(new Date()), // বর্তমান তারিখ ডিফল্ট
  endDate: z.coerce.date().default(new Date()),
  message: z.string().min(10, "মন্তব্য অন্তত 10 অক্ষরের হতে হবে"),
  rating: z.number().min(0, "রেটিং 0 এর কম হতে পারবে না").max(5, "রেটিং সর্বোচ্চ 5 পর্যন্ত হতে পারবে"),
});