

export type ProfileInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  profession: string;
  professionBio: string;
  welcomeMessage: string;
  socialMedia: { platformName: string; platformLink: string }[];
  metaDescription?: string;
  primaryImage: string;
  secondaryImage: string;
  metaImage?:string | null;
  openGraphImage?: string | null;
  twitterImage?: string | null;

};

export type BlogInput = {
  title: string;
  content: string;
  image: string;
};

type Education = {
  id: string;
  degree: string;
  institution: string;
  cgpa: number;
  desc: string;
  startYear: string;
  endYear: string;
  resumeId: string;
};

type Experience = {
  id: string;
  profession: string;
  company: string;
  desc: string;
  technology: string[];
  resumeId: string;
};

export type ResumeInputType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  education: Education[];
  experience: Experience[];
};

export type PackageInput = {
  title: string;
  desc: string;
  price: number;
  features: { value: string }[];
};

export type PricingInput = {
  basic: PackageInput;
  standard: PackageInput;
  premium: PackageInput;
  orderLink?: string;
};

export type PortfolioInput = {
  title: string;
  desc: string;
  externalLink?: string;
  react: number;
  technology: {image:string}[];
  image: string;
};

 type Technology = {
  id: string;
  image: string;
  porfolioId: string;
};

export type ResponsePortfolioInput = {
  id: string;
  title: string;
  desc: string;
  image: string;
  react: number;
  externalLink?: string;
  createdAt: Date;
  updatedAt: Date;
  technology: Technology[]; 
};

export type ResponseBlogInput = {
  id:string
  title: string;
  content: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceInput = {
  title: string;
  desc: string;
  services: { value: string }[];
};

export type SkillInput = {
  id?:string;
  name: string;
  desc: string;
  image: string;
};

export type AllSkillsInput = {
  id?:string
  title: string;
  skills: SkillInput[];
}[];

export type TestimonialInput = {
  name: string;
  authorProfession: string;
  companyName: string;
  image: string;
  projectTitle: string;
  platform: string;
  startDate: Date;
  endDate: Date;
  message: string;
  rating: number;
};


export type TestimonialResponseType = {
  id: string;
  name: string;
  authorProfession: string;
  companyName: string;
  projectTitle: string;
  platform: string;
  image: string;
  message: string;
  rating: number;
  startDate: Date; // formatted or serialized
  endDate: Date;   // formatted or serialized
};


export type SkillTypeResponse = {
  id: string;
  name: string;
  skills: {
    id: string;
    name: string;
    desc: string;
    skillImage: string;
    skillTypeId: string;
  }[];
};

export type ServiceResponseType = {
  id: string;
  title: string;
  desc: string;
  services: string[];
  createdAt: Date;        
  updatedAt: Date;       


}


export type ResponseProfileType = {
  id: string;
  name: string;
  phone: string;
  email: string;
  profession: string;
  address:string;
  professionBio: string;
  openGraphImage?: string;
  twitterImage?: string;
  metaImage?:string;
  metaDescription?: string;
  welcomeMessage: string;
  primaryImage: string;
  secondaryImage: string;
  socialMedia: SocialMedia[];
  createdAt: Date;
  updatedAt: Date;
};

type SocialMedia = {
  id: string;
  platformName: string;
  platformLink: string;
  profileId: string;
};