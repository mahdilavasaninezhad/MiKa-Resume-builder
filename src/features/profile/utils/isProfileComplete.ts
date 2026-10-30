import type { AuthUser } from "../../auth/types/auth.types";

export function getMissingProfileFields(
  user: AuthUser | null,
) {
  if (!user) {
    return [];
  }

  const missingFields: string[] = [];

  if (!user.username.trim()) {
    missingFields.push("User Name");
  }

  if (!user.displayName.trim()) {
    missingFields.push("Name");
  }

  if (!user.email.trim()) {
    missingFields.push("Email",);
  }

  if (!user.phoneNumber.trim()) {
    missingFields.push("Phone");
  }

  if (!user.city.trim()) {
    missingFields.push("City");
  }

  if (!user.birthday.trim()) {
    missingFields.push("Birthday");
  }

  if (!user.gender) {
    missingFields.push("Gender");
  }

  return missingFields;
}

export function isProfileComplete(
  user: AuthUser | null,
) {
  if (!user) {
    return false;
  }

  return getMissingProfileFields(user,).length === 0;
}