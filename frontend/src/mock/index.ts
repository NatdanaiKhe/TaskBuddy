import type { TaskCardProps } from "@/types/taskTypes";

export const popularTask = ["House Cleaning", "Furniture Assembly", "Home Repairs", "Moving Help", "Delivery"];
export const categories = [
  { label: "Cleaning", value: "cleaning" },
  { label: "Handyman", value: "handyman" },
  { label: "Moving", value: "moving" },
  { label: "Gardening", value: "gardening" },
];

export const tasks: TaskCardProps[] = [
  {
    title: "Deep House Cleaning",
    category: "cleaning",
    price: 85,
    location: "Remote & Local",
    description:
      "Thorough home cleaning service with eco-friendly products. We provide all cleaning supplies and equipment. Our professional cleaners are experienced and background-checked.",
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Furniture Assembly",
    category: "handyman",
    price: 60,
    location: "Bangkok",
    description:
      "Efficient furniture assembly for IKEA and other brands. Tools provided.",
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Grocery Shopping & Delivery",
    category: "gardening",
    price: 40,
    location: "Bangkok",
    description: "Personalized grocery shopping and doorstep delivery service.",
    isActive: false,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Moving Assistance",
    category: "moving",
    price: 120,
    location: "Bangkok",
    description: "Reliable help with packing, lifting, and transporting items.",
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1580709839515-54b8991e2813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
];
