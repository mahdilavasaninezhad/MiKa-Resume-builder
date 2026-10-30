import type {
  AuthUser,
  Gender,
  StoredUser,
  UpdateProfileData,
} from "../types/auth.types";

const USERS_KEY = "pulse.users";
const SESSION_KEY = "pulse.session";

const encoder = new TextEncoder();

function normalizeStoredUser(
  user: StoredUser,
): StoredUser {
  return {
    ...user,

    displayName:
      user.displayName ||
      user.username,

    email:
      user.email || "",

    phoneNumber:
      user.phoneNumber || "",

    city:
      user.city || "",

    birthday:
      user.birthday || "",

    gender:
      (user.gender || "") as Gender,

    avatarUrl:
      user.avatarUrl || null,
  };
}

function getUsers(): StoredUser[] {
  try {
    const value =
      localStorage.getItem(
        USERS_KEY,
      );

    if (!value) {
      return [];
    }

    const users =
      JSON.parse(
        value,
      ) as StoredUser[];

    return users.map(
      normalizeStoredUser,
    );
  } catch {
    return [];
  }
}

function saveUsers(
  users: StoredUser[],
) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users),
  );
}

function bytesToBase64(
  bytes: Uint8Array,
) {
  let binary = "";

  bytes.forEach((byte) => {
    binary +=
      String.fromCharCode(byte);
  });

  return btoa(binary);
}

function base64ToBytes(
  value: string,
) {
  const binary = atob(value);

  return Uint8Array.from(
    binary,
    (character) =>
      character.charCodeAt(0),
  );
}

function createSalt() {
  return bytesToBase64(
    crypto.getRandomValues(
      new Uint8Array(16),
    ),
  );
}

async function hashPassword(
  password: string,
  salt: string,
) {
  const keyMaterial =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );

  const derivedBits =
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt:
          base64ToBytes(salt),
        iterations: 150_000,
        hash: "SHA-256",
      },
      keyMaterial,
      256,
    );

  return bytesToBase64(
    new Uint8Array(
      derivedBits,
    ),
  );
}

function createSession(
  user: StoredUser,
): AuthUser {
  const normalized =
    normalizeStoredUser(user);

  const session: AuthUser = {
    id:
      normalized.id,

    username:
      normalized.username,

    email:
      normalized.email,

    displayName:
      normalized.displayName,

    phoneNumber:
      normalized.phoneNumber,

    city:
      normalized.city,

    birthday:
      normalized.birthday,

    gender:
      normalized.gender,

    avatarUrl:
      normalized.avatarUrl,

    createdAt:
      normalized.createdAt,
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session),
  );

  return session;
}

export function getSession():
  AuthUser | null {
  try {
    const value =
      localStorage.getItem(
        SESSION_KEY,
      );

    if (!value) {
      return null;
    }

    const session =
      JSON.parse(
        value,
      ) as AuthUser;

    return {
      ...session,

      email:
        session.email || "",

      displayName:
        session.displayName ||
        session.username,

      phoneNumber:
        session.phoneNumber || "",

      city:
        session.city || "",

      birthday:
        session.birthday || "",

      gender:
        session.gender || "",

      avatarUrl:
        session.avatarUrl || null,
    };
  } catch {
    return null;
  }
}

export function getRegisteredUsersCount() {
  return getUsers().length;
}

export async function registerLocalUser(
  username: string,
  password: string,
) {
  const cleanUsername =
    username.trim();

  if (
    cleanUsername.length < 3
  ) {
    throw new Error(
      "Username must contain at least 3 characters.",
    );
  }

  if (
    password.length < 8
  ) {
    throw new Error(
      "Password must contain at least 8 characters.",
    );
  }

  const users = getUsers();

  const alreadyExists =
    users.some(
      (user) =>
        user.username.toLowerCase() ===
        cleanUsername.toLowerCase(),
    );

  if (alreadyExists) {
    throw new Error(
      "This username already exists.",
    );
  }

  const salt = createSalt();

  const user: StoredUser = {
    id:
      crypto.randomUUID(),

    username:
      cleanUsername,

    email: "",

    displayName:
      cleanUsername,

    phoneNumber: "",

    city: "",

    birthday: "",

    gender: "",

    avatarUrl: null,

    passwordHash:
      await hashPassword(
        password,
        salt,
      ),

    salt,

    createdAt:
      new Date().toISOString(),
  };

  users.push(user);

  saveUsers(users);

  return createSession(
    user,
  );
}

export async function loginLocalUser(
  username: string,
  password: string,
) {
  const users = getUsers();

  const user =
    users.find(
      (item) =>
        item.username.toLowerCase() ===
        username
          .trim()
          .toLowerCase(),
    );

  if (!user) {
    throw new Error(
      "Username or password is incorrect.",
    );
  }

  const passwordHash =
    await hashPassword(
      password,
      user.salt,
    );

  if (
    passwordHash !==
    user.passwordHash
  ) {
    throw new Error(
      "Username or password is incorrect.",
    );
  }

  return createSession(
    user,
  );
}

export async function updateLocalProfile(
  userId: string,
  data: UpdateProfileData,
) {
  const users = getUsers();

  const userIndex =
    users.findIndex(
      (user) =>
        user.id === userId,
    );

  if (
    userIndex === -1
  ) {
    throw new Error(
      "User was not found.",
    );
  }

  const currentUser =
    users[userIndex];

  const username =
    data.username !== undefined
      ? data.username.trim()
      : currentUser.username;

  if (
    username.length < 3
  ) {
    throw new Error(
      "Username must contain at least 3 characters.",
    );
  }

  const usernameExists =
    users.some(
      (user) =>
        user.id !== userId &&
        user.username.toLowerCase() ===
          username.toLowerCase(),
    );

  if (
    usernameExists
  ) {
    throw new Error(
      "This username already exists.",
    );
  }

  const displayName =
    data.displayName !== undefined
      ? data.displayName.trim()
      : currentUser.displayName;

  if (
    displayName.length < 2
  ) {
    throw new Error(
      "Name must contain at least 2 characters.",
    );
  }

  const email =
    data.email !== undefined
      ? data.email.trim()
      : currentUser.email || "";

  let salt =
    currentUser.salt;

  let passwordHash =
    currentUser.passwordHash;

  if (
    data.newPassword
  ) {
    if (
      data.newPassword.length < 8
    ) {
      throw new Error(
        "Password must contain at least 8 characters.",
      );
    }

    salt =
      createSalt();

    passwordHash =
      await hashPassword(
        data.newPassword,
        salt,
      );
  }

  const updatedUser:
    StoredUser = {
    ...currentUser,

    username,

    email,

    displayName,

    phoneNumber:
      data.phoneNumber !==
      undefined
        ? data.phoneNumber.trim()
        : currentUser.phoneNumber,

    city:
      data.city !== undefined
        ? data.city.trim()
        : currentUser.city,

    birthday:
      data.birthday !==
      undefined
        ? data.birthday
        : currentUser.birthday,

    gender:
      data.gender !== undefined
        ? data.gender
        : currentUser.gender,

    avatarUrl:
      data.avatarUrl !==
      undefined
        ? data.avatarUrl
        : currentUser.avatarUrl,

    salt,

    passwordHash,
  };

  users[userIndex] =
    updatedUser;

  saveUsers(users);

  return createSession(
    updatedUser,
  );
}

export async function verifyLocalPassword(
  userId: string,
  password: string,
) {
  const users = getUsers();

  const user = users.find(
    (item) =>
      item.id === userId,
  );

  if (!user) {
    throw new Error(
      "User was not found.",
    );
  }

  const passwordHash =
    await hashPassword(
      password,
      user.salt,
    );

  return (
    passwordHash ===
    user.passwordHash
  );
}

export async function changeLocalPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (
    newPassword.length < 8
  ) {
    throw new Error(
      "New password must contain at least 8 characters.",
    );
  }

  const users = getUsers();

  const userIndex =
    users.findIndex(
      (user) =>
        user.id === userId,
    );

  if (
    userIndex === -1
  ) {
    throw new Error(
      "User was not found.",
    );
  }

  const user =
    users[userIndex];

  const currentPasswordHash =
    await hashPassword(
      currentPassword,
      user.salt,
    );

  if (
    currentPasswordHash !==
    user.passwordHash
  ) {
    throw new Error(
      "Current password is incorrect.",
    );
  }

  const newSalt =
    createSalt();

  users[userIndex] = {
    ...user,

    salt:
      newSalt,

    passwordHash:
      await hashPassword(
        newPassword,
        newSalt,
      ),
  };

  saveUsers(users);
}

export function logoutLocalUser() {
  localStorage.removeItem(
    SESSION_KEY,
  );
}