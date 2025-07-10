import {
  Brush,
  Wrench,
  Truck,
  Leaf,
  ShieldCheck,
  PawPrint,
  BookOpen,
  MonitorSmartphone,
  Sparkles,
  Utensils,
} from "lucide-react";

export const categories = [
  {
    name: "Cleaning",
    value: "cleaning",
    icon: <Brush className="h-8 w-8" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Handyman",
    value: "handyman",
    icon: <Wrench className="h-8 w-8" />,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    name: "Moving",
    value: "moving",
    icon: <Truck className="h-8 w-8" />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Gardening",
    value: "gardening",
    icon: <Leaf className="h-8 w-8" />,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Security",
    value: "security",
    icon: <ShieldCheck className="h-8 w-8" />,
    color: "bg-gray-100 text-gray-600",
  },
  {
    name: "Pet Care",
    value: "pet-care",
    icon: <PawPrint className="h-8 w-8" />,
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Tutoring",
    value: "tutoring",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    name: "IT Support",
    value: "it-support",
    icon: <MonitorSmartphone className="h-8 w-8" />,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    name: "Beauty Services",
    value: "beauty",
    icon: <Sparkles className="h-8 w-8" />,
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Cooking",
    value: "cooking",
    icon: <Utensils className="h-8 w-8" />,
    color: "bg-amber-100 text-amber-600",
  },
];


export const popularTask = [
  { label: "Cleaning", value: "cleaning" },
  { label: "Handyman", value: "handyman" },
  { label: "Moving", value: "moving" },
  { label: "Gardening", value: "gardening" },
];
export const categoryOptions = [
  { label: "Cleaning", value: "cleaning" },
  { label: "Handyman", value: "handyman" },
  { label: "Moving", value: "moving" },
  { label: "Gardening", value: "gardening" },
  { label: "Security", value: "security" },
  { label: "Pet Care", value: "pet-care" },
  { label: "Tutoring", value: "tutoring" },
  { label: "IT Support", value: "it-support" },
  { label: "Beauty Services", value: "beauty" },
  { label: "Cooking", value: "cooking" },
];



export const hourOptions = [
  { label: "1 hour", value: "1" },
  { label: "2 hours", value: "2" },
  { label: "3 hours", value: "3" },
  { label: "4 hours", value: "4" },
  { label: "5 hours", value: "5" },
  { label: "6 hours", value: "6" },
  { label: "7 hours", value: "7" },
  { label: "8 hours", value: "8" },
];
