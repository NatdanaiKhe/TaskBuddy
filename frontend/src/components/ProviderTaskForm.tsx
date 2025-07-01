import type { TaskFormProps } from "@/types/taskTypes";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/mock";
import type { CityType } from "@/types";
import { Button } from "./ui/button";

function ProviderTaskForm({ form, onSubmit, initialData }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const image_url =
    import.meta.env.VITE_IMAGE_ENDPOINT + initialData?.image_url;
    console.log("image url:",initialData?.image_url);
    

  const [cities, setCities] = useState<CityType[]>([]);
  const [imagePreview, setImagePreview] = useState("");

  // Load city data
  useEffect(() => {
    fetch("th.json")
      .then(res => res.json())
      .then(data => setCities(data));
  }, []);

  useEffect(() => {
    register("category", { required: "Category is required" });
    register("location", { required: "Location is required" });
  }, [register]);

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("price", initialData.price);
      setValue("category", initialData.category);
      setValue("location", initialData.location);
      setValue("description", initialData.description);
      setImagePreview(image_url)
    }

    register("image", {
      required: !initialData?.image_url ? "Image is required" : false,
    });
    
  }, [initialData, setValue,register]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setValue("image", undefined);
  };

  return (
    <form
      id="task-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          {...register("title", {
            required: "Title is required",
            pattern: {
              value: /^[A-Za-z\s'-]+$/,
              message: "Only letters, spaces, apostrophes, and hyphens allowed",
            },
          })}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price">Price (฿)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min={0}
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
          })}
        />
        {errors.price && (
          <p className="text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      {/* Category & Location */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            defaultValue={initialData?.category}
            onValueChange={val => setValue("category", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>All Categories</SelectLabel>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Select
            defaultValue={initialData?.location}
            onValueChange={val => setValue("location", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>All Locations</SelectLabel>
                {cities.map(city => (
                  <SelectItem key={city.name_en} value={city.name_en}>
                    {city.name_en}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.location && (
            <p className="text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-lg border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          {...register("description", {
            required: "Description is required",
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <Label>Task Image</Label>
        {!imagePreview ? (
          <Label htmlFor="image" className="cursor-pointer">
            <div className="w-full border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 text-blue-600 hover:text-blue-500">
                Upload an image
              </div>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </Label>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <Button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {errors.image && (
          <p className="text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>
    </form>
  );
}


export default ProviderTaskForm;
