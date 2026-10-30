export type Gender = "" | "male" | "female";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  city: string;
  birthday: string;
  gender: Gender;
  avatarUrl: string | null;
  createdAt: string;
}

export interface StoredUser extends AuthUser {
  passwordHash: string;
  salt: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  city?: string;
  birthday?: string;
  gender?: Gender;
  avatarUrl?: string | null;
  newPassword?: string;
}