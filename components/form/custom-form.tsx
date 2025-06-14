import React, { useState } from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { GoStarFill } from "react-icons/go";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { ImageUploader } from "./image-uploader";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  field: any;
  label: string;
  placeHolder?: string;
  fieldType: "input" | "textarea" | "image";
  inputType?: "number" | "text" | "password";
  important?: boolean;
  error?: any;
  allowShowHidePassword?: boolean; // ✅ NEW
  previewImage?:string
}

export const CustomForm = ({
  field,
  placeHolder,
  label,
  fieldType,
  important,
  inputType = "text",
  allowShowHidePassword = false,
  previewImage,
 
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  let FieldComponent;

  switch (fieldType) {
    case "textarea":
      FieldComponent = (
        <Textarea placeholder={placeHolder} {...field} className="min-h-36" />
      );
      break;

    case "image":
      FieldComponent = <ImageUploader field={field} previewImage={previewImage}/>;
      break;

    case "input":
    default:
      const isPassword = inputType === "password" && allowShowHidePassword;

      // Custom onChange for number inputs to convert string to number
      const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Convert to number or undefined if empty
        const parsed = val === "" ? undefined : Number(val);
        // Update form value
        field.onChange(parsed);
      };

      FieldComponent = (
        <div className="relative">
          <Input
            placeholder={placeHolder}
            type={isPassword ? (showPassword ? "text" : "password") : inputType}
            {...field}
            onChange={
              inputType === "number"
                ? handleNumberChange
                : field.onChange
            }
            value={
              // To avoid uncontrolled/controlled warnings for number inputs
              inputType === "number" && (field.value === undefined || field.value === null)
                ? ""
                : field.value
            }
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
      );
      break;
  }

  return (
    <FormItem>
      <FormLabel className="text-accent-foreground flex gap-x-2 items-start text-base tracking-wider font-semibold capitalize">
        {label}
        {important && (
          <div className="shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_3px_rgba(0,0,0,0.25),-1px_-1px_4px_rgba(255,255,255,0.16)] p-0.5 rounded-full">
            <GoStarFill className="size-1.5 text-rose-600 dark:text-rose-800" />
          </div>
        )}
      </FormLabel>
      <FormControl>{FieldComponent}</FormControl>
      <FormMessage className="text-sm" />
    </FormItem>
  );
};
