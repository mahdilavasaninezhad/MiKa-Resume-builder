import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  Globe2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { FloatingField as Field } from "../../../../shared/components/form/FloatingField";
import { resumePersonalFormSchema } from "../../schemas/resume.schema";
import type { Resume, UpdateResumeInput } from "../../types/resume.types";

type PersonalFormValues = z.infer<typeof resumePersonalFormSchema>;

interface PersonalSectionProps {
  resume: Resume;
  onUpdate: (data: UpdateResumeInput) => void;
}

export function PersonalSection({
  resume,
  onUpdate,
}: PersonalSectionProps) {
  const {
    control,
    formState: { errors },
  } = useForm<PersonalFormValues>({
    resolver: zodResolver(resumePersonalFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: resume.personal.fullName,
      email: resume.personal.email,
      phoneNumber: resume.personal.phoneNumber,
      city: resume.personal.city,
      country: resume.personal.country,
      jobTitle: resume.personal.jobTitle,
    },
  });

  return (
    <div
      className="
        grid grid-cols-1 gap-x-3 gap-y-2.5
        w-[calc(100%_-_0.875rem)] max-w-[340px]
        min-w-0 ml-3.5
      "
    >
      <Controller
        name="fullName"
        control={control}
        render={({ field }) => (
          <Field
            label="Full Name"
            icon={UserRound}
            value={field.value}
            error={errors.fullName?.message}
          >
            <input
              {...field}
              onChange={(event) => {
                field.onChange(event);
                onUpdate({
                  personal: { fullName: event.target.value },
                });
              }}
              placeholder="Your full name"
              className="min-w-0 w-full bg-transparent !text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </Field>
        )}
      />

      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <Field
            label="Professional Title"
            icon={BriefcaseBusiness}
            value={field.value}
            error={errors.jobTitle?.message}
          >
            <input
              {...field}
              onChange={(event) => {
                field.onChange(event);
                onUpdate({
                  personal: { jobTitle: event.target.value },
                });
              }}
              placeholder="Your professional title"
              className="min-w-0 w-full bg-transparent !text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </Field>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Field
            label="Email"
            icon={Mail}
            value={field.value}
            error={errors.email?.message}
          >
            <input
              {...field}
              type="email"
              onChange={(event) => {
                field.onChange(event);
                onUpdate({
                  personal: { email: event.target.value },
                });
              }}
              placeholder="Your email"
              autoComplete="email"
              className="min-w-0 w-full bg-transparent !text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </Field>
        )}
      />

      <Controller
        name="phoneNumber"
        control={control}
        render={({ field }) => (
          <Field
            label="Phone"
            icon={Phone}
            value={field.value}
            error={errors.phoneNumber?.message}
          >
            <input
              {...field}
              type="tel"
              onChange={(event) => {
                field.onChange(event);
                onUpdate({
                  personal: { phoneNumber: event.target.value },
                });
              }}
              placeholder="Your phone number"
              autoComplete="tel"
              className="min-w-0 w-full bg-transparent !text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </Field>
        )}
      />

      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <Field
            label="City"
            icon={MapPin}
            value={field.value}
            error={errors.city?.message}
          >
            <input
              {...field}
              onChange={(event) => {
                field.onChange(event);
                onUpdate({
                  personal: { city: event.target.value },
                });
              }}
              placeholder="Your city"
              autoComplete="address-level2"
              className="min-w-0 w-full bg-transparent !text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </Field>
        )}
      />

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <Field
            label="Country"
            icon={Globe2}
            value={field.value}
            error={errors.country?.message}
          >
            <input
              {...field}
              onChange={(event) => {
                field.onChange(event);
                onUpdate({
                  personal: { country: event.target.value },
                });
              }}
              placeholder="Your country"
              autoComplete="country-name"
              className="min-w-0 w-full bg-transparent !text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </Field>
        )}
      />
    </div>
  );
}