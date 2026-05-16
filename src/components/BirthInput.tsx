"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Gender } from "@/lib/bazi/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/lib/i18n/context";

interface BirthInputProps {
  onCalculate: (birthday: string, birthTime: string | undefined, gender: Gender) => void;
  isLoading?: boolean;
}

export default function BirthInput({ onCalculate, isLoading }: BirthInputProps) {
  const { t } = useLocale();

  const formSchema = z.object({
    birthday: z.string().min(1, t("err_birthday_required")),
    birth_time: z.string().optional(),
    gender: z.enum(["男", "女"]),
  });
  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { gender: "男" },
  });

  const gender = watch("gender");

  const onSubmit = (data: FormData) => {
    onCalculate(data.birthday, data.birth_time || undefined, data.gender);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="birthday" className="text-base">
          {t("label_birthday")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="birthday"
          type="date"
          {...register("birthday")}
          className="h-12"
          min="1900-01-01"
          max={new Date().toISOString().split("T")[0]}
        />
        {errors.birthday && (
          <p className="text-sm text-red-500">{errors.birthday.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_time" className="text-base">
          {t("label_birth_time")} <span className="text-gray-400">{t("optional_marker")}</span>
        </Label>
        <Input
          id="birth_time"
          type="time"
          {...register("birth_time")}
          className="h-12"
        />
        <p className="text-xs text-gray-500">{t("hint_birth_time")}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender" className="text-base">
          {t("label_gender")} <span className="text-red-500">*</span>
        </Label>
        <Select
          value={gender}
          onValueChange={(value) => setValue("gender", value as Gender)}
        >
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder={t("placeholder_gender")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="男">{t("gender_male")}</SelectItem>
            <SelectItem value="女">{t("gender_female")}</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-sm text-red-500">{errors.gender.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {t("btn_calculating")}
          </span>
        ) : (
          t("btn_calculate")
        )}
      </Button>
    </form>
  );
}
