import {
  Home,
  User,
  Pencil,
  FileText,
  Briefcase,
  Image,
  Wrench,
  Settings,
  Brain,
  MessageSquare,
} from "lucide-react";


export const navItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Resume", icon: FileText, href: "/dashboard/resume" },
  { name: "Gig", icon: Briefcase, href: "/dashboard/gig" },
  { name: "Services", icon: Wrench, href: "/dashboard/services" },
  { name: "Skill", icon: Brain, href: "/dashboard/skill" },
  { name: "Testimonials", icon: MessageSquare, href: "/dashboard/testimonials" },
    { name: "Portfolio", icon: Image, href: "/dashboard/portfolio" },
    { name: "Blog", icon: Pencil, href: "/dashboard/blog" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];