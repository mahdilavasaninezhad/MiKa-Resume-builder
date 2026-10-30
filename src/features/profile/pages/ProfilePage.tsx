import {
  AtSign,
  Cake,
  Camera,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  UserRound,
  VenusAndMars,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../auth/store/auth.store";

import type {
  Gender,
} from "../../auth/types/auth.types";

import { verifyLocalPassword } from "../../auth/services/auth.service";

import { ConfirmModal } from "../../../shared/components/feedback/ConfirmModal";

import { notify } from "../../../shared/lib/notify";

type PasswordStep =
  | "current"
  | "new"
  | "confirm"
  | "ready";

export function ProfilePage() {
  const navigate =
    useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const user =
    useAuthStore(
      (state) =>
        state.user,
    );

  const updateProfile =
    useAuthStore(
      (state) =>
        state.updateProfile,
    );

  const logout =
    useAuthStore(
      (state) =>
        state.logout,
    );

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    passwordValue,
    setPasswordValue,
  ] = useState("");

  const [
    pendingNewPassword,
    setPendingNewPassword,
  ] = useState("");

  const [
    passwordStep,
    setPasswordStep,
  ] =
    useState<PasswordStep>(
      "current",
    );

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    checkingPassword,
    setCheckingPassword,
  ] = useState(false);

  const [
    displayName,
    setDisplayName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    birthday,
    setBirthday,
  ] = useState("");

  const [
    gender,
    setGender,
  ] =
    useState<Gender>("");

  const [
    avatar,
    setAvatar,
  ] = useState<
    string | null
  >(null);

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    logoutModalOpen,
    setLogoutModalOpen,
  ] = useState(false);

  function resetPasswordChange() {
    setPasswordValue("");

    setPendingNewPassword(
      "",
    );

    setPasswordStep(
      "current",
    );

    setShowPassword(
      false,
    );

    setCheckingPassword(
      false,
    );
  }

  function loadUserData() {
    if (!user) {
      return;
    }

    setUsername(
      user.username,
    );

    setDisplayName(
      user.displayName ||
        user.username,
    );

    setEmail(
      user.email || "",
    );

    setPhoneNumber(
      user.phoneNumber ||
        "",
    );

    setCity(
      user.city || "",
    );

    setBirthday(
      user.birthday || "",
    );

    setGender(
      user.gender || "",
    );

    setAvatar(
      user.avatarUrl ||
        null,
    );

    resetPasswordChange();
  }

  useEffect(() => {
    loadUserData();
  }, [user]);

  async function handleAvatarChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      notify.error(
        "Please Select a Valid Image.",
      );

      return;
    }

    if (
      file.size >
      1_000_000
    ) {
      notify.error(
        "Image Is Too Large.",
        "Please Select An Image Smaller Than 1 MB.",
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload =
      async () => {
        if (
          typeof reader.result !==
          "string"
        ) {
          return;
        }

        try {
          await updateProfile({
            avatarUrl:
              reader.result,
          });

          setAvatar(
            reader.result,
          );

          notify.success(
            "Profile Photo Updated.",
          );
        } catch (error) {
          notify.error(
            error instanceof Error
              ? error.message
              : "Could Not Update Profile Photo.",
          );
        }
      };

    reader.onerror =
      () => {
        notify.error(
          "Could Not read Selected Image.",
        );
      };

    reader.readAsDataURL(
      file,
    );

    event.target.value =
      "";
  }

  async function handleRemoveAvatar() {
    try {
      await updateProfile({
        avatarUrl: null,
      });

      setAvatar(
        null,
      );

      notify.success(
        "Profile Photo Removed.",
      );
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Could Not Remove Profile Photo.",
      );
    }
  }

  function handleStartEdit() {
    loadUserData();

    setIsEditing(
      true,
    );
  }

  function handleCancelEdit() {
    loadUserData();

    setIsEditing(
      false,
    );
  }

  async function handlePasswordConfirm() {
    if (
      passwordStep ===
      "current"
    ) {
      if (
        !passwordValue
      ) {
        notify.error(
          "Please Enter Your Current Password.",
        );

        return;
      }

      if (!user) {
        return;
      }

      setCheckingPassword(
        true,
      );

      try {
        const isCorrect =
          await verifyLocalPassword(
            user.id,
            passwordValue,
          );

        if (!isCorrect) {
          notify.error(
            "Current Password Is Incorrect.",
          );

          setPasswordValue(
            "",
          );

          return;
        }

        setPasswordValue(
          "",
        );

        setPasswordStep(
          "new",
        );

        setShowPassword(
          false,
        );

        notify.success(
          "Current Password Confirmed.",
        );
      } catch (error) {
        notify.error(
          error instanceof Error
            ? error.message
            : "Could Not Verify Password.",
        );
      } finally {
        setCheckingPassword(
          false,
        );
      }

      return;
    }

    if (
      passwordStep ===
      "new"
    ) {
      if (
        passwordValue.length <
        8
      ) {
        notify.error(
          "Password Must Contain At Least 8 Characters.",
        );

        return;
      }

      setPendingNewPassword(
        passwordValue,
      );

      setPasswordValue(
        "",
      );

      setPasswordStep(
        "confirm",
      );

      setShowPassword(
        false,
      );

      return;
    }

    if (
      passwordStep ===
      "confirm"
    ) {
      if (
        !passwordValue
      ) {
        notify.error(
          "Please Confirm Your New Password.",
        );

        return;
      }

      if (
        passwordValue !==
        pendingNewPassword
      ) {
        notify.error(
          "Passwords Do Not Match.",
        );

        setPasswordValue(
          "",
        );

        return;
      }

      setPasswordValue(
        "",
      );

      setPasswordStep(
        "ready",
      );

      setShowPassword(
        false,
      );

      notify.success(
        "Password Change Is Ready To Save.",
      );
    }
  }

  async function handleSave() {
    const cleanEmail =
      email.trim();

    if (cleanEmail) {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          cleanEmail,
        )
      ) {
        notify.error(
          "Please Enter a Valid Email Address.",
        );

        return;
      }
    }

    setSaving(true);

    try {
      await updateProfile({
        username,

        email:
          cleanEmail,

        displayName,

        phoneNumber,

        city,

        birthday,

        gender,

        newPassword:
          passwordStep ===
          "ready"
            ? pendingNewPassword
            : undefined,
      });

      resetPasswordChange();

      setIsEditing(
        false,
      );

      notify.success(
        "Profile Updated Successfully.",
      );
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Could Not Update Profile.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }

  function handleLogout() {
    setLogoutModalOpen(
      false,
    );

    logout();

    navigate(
      "/login",
      {
        replace: true,
      },
    );

    notify.success(
      "Logged Out Successfully.",
    );
  }

  const inputClass = `
    form-field
    h-12
    w-full
    rounded-2xl
    px-4
    outline-none
    transition-all
    disabled:cursor-default
    disabled:opacity-100
  `;

  const passwordPlaceholder =
    !isEditing
      ? "••••••••"
      : passwordStep ===
          "Current"
        ? "Enter Your Current Password"
        : passwordStep ===
            "New"
          ? "Enter Your New Password"
          : passwordStep ===
              "Confirm"
            ? "Confirm Your New Password"
            : "Password Change Ready";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mx-auto max-w-6xl place-items-center">
      <section
        className="
          w-full
          max-w-lg
          row-span-2
          lg:order-0
          order-1
          glass-panel
          relative
          rounded-[36px]
          px-6
          pb-10
          pt-4
          md:px-10
        "
      >
        <div className="mt-5 space-y-3">
          <label className="flex justify-evenly gap-5">
            <span className="min-w-15 flex flex-col gap-1 justify-center items-center text-xs text-[var(--muted)]">
              <AtSign
                size={15}
              />

              User Name
            </span>

            <input
              value={
                username
              }
              onChange={(
                event,
              ) =>
                setUsername(
                  event
                    .target
                    .value,
                )
              }
              disabled={
                !isEditing
              }
              data-filled={
                username.length >
                0
              }
              autoComplete="username"
              placeholder="Username"
              className={`
                ${inputClass}
                max-w-90
              `}
            />
          </label>

          <label className="flex justify-evenly gap-5">
            <span className="min-w-15 flex flex-col gap-1 justify-center items-center text-xs text-[var(--success)]">
              <KeyRound
                size={15}
              />

              Password
            </span>

            <div className="relative w-full max-w-90">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  passwordValue
                }
                onChange={(
                  event,
                ) =>
                  setPasswordValue(
                    event
                      .target
                      .value,
                  )
                }
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                      "Enter" &&
                    isEditing &&
                    passwordStep !==
                      "ready"
                  ) {
                    event.preventDefault();

                    handlePasswordConfirm();
                  }
                }}
                disabled={
                  !isEditing ||
                  passwordStep ===
                    "ready"
                }
                data-filled={
                  isEditing &&
                  (passwordValue.length >
                    0 ||
                    passwordStep ===
                      "ready")
                }
                autoComplete={
                  passwordStep ===
                  "current"
                    ? "current-password"
                    : "new-password"
                }
                placeholder={
                  passwordPlaceholder
                }
                className={`
                  ${inputClass}
                  max-w-90
                  ${
                    isEditing
                      ? "pr-24"
                      : ""
                  }
                  ${
                    passwordStep ===
                    "ready"
                      ? "!text-[var(--success)]"
                      : ""
                  }
                `}
              />

              {isEditing &&
                passwordStep !==
                  "ready" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (
                            current,
                          ) =>
                            !current,
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      title={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="
                        neo-button
                        absolute right-12 -bottom-2 flex h-5.5 w-5.5
                        items-center
                        justify-center
                        rounded-lg
                        transition
                        hover:!text-[var(--accent)]
                      "
                    >
                      {showPassword ? (
                        <EyeOff
                          size={
                            14
                          }
                        />
                      ) : (
                        <Eye
                          size={
                            14
                          }
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={
                        handlePasswordConfirm
                      }
                      disabled={
                        checkingPassword
                      }
                      aria-label="Confirm password"
                      title="Confirm"
                      className="
                        neo-button
                        absolute right-4 -bottom-2 flex h-5.5 w-5.5
                        items-center
                        justify-center
                        rounded-lg
                        transition
                        hover:!text-[var(--success)]
                      "
                    >
                      <Check
                        size={
                          17
                        }
                      />
                    </button>
                  </>
                )}

              {isEditing &&
                passwordStep ===
                  "ready" && (
                  <div
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-xl
                      text-[var(--success)]
                    "
                  >
                    <Check
                      size={
                        18
                      }
                    />
                  </div>
                )}
            </div>
          </label>

          <label className="flex justify-evenly gap-5">
            <span className="min-w-15 flex flex-col gap-1 justify-center items-center text-xs text-[var(--muted)]">
              <UserRound
                size={15}
              />

              Name
            </span>

            <input
              value={
                displayName
              }
              onChange={(
                event,
              ) =>
                setDisplayName(
                  event
                    .target
                    .value,
                )
              }
              disabled={
                !isEditing
              }
              data-filled={
                displayName.length >
                0
              }
              placeholder="Name"
              className={`
                ${inputClass}
                max-w-90
              `}
            />
          </label>

          <label className="flex justify-evenly gap-5">
            <span className="min-w-15 flex flex-col gap-1 justify-center items-center text-xs text-[var(--muted)]">
              <Mail
                size={15}
              />

              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(
                event,
              ) =>
                setEmail(
                  event
                    .target
                    .value,
                )
              }
              disabled={
                !isEditing
              }
              data-filled={
                email.length >
                0
              }
              autoComplete="email"
              placeholder="Email Address"
              className={`
                ${inputClass}
                max-w-90
              `}
            />
          </label>

          <label className="flex justify-evenly gap-5">
            <span className="min-w-15 flex flex-col gap-1 justify-center items-center text-xs text-[var(--muted)]">
              <Phone
                size={15}
              />

              Phone
            </span>

            <input
              type="tel"
              value={
                phoneNumber
              }
              onChange={(
                event,
              ) =>
                setPhoneNumber(
                  event
                    .target
                    .value,
                )
              }
              disabled={
                !isEditing
              }
              data-filled={
                phoneNumber.length >
                0
              }
              autoComplete="tel"
              placeholder="Phone Number"
              className={`
                ${inputClass}
                max-w-90
              `}
            />
          </label>

          <label className="flex justify-evenly gap-5">
            <span className="min-w-15 flex flex-col gap-1 justify-center items-center text-xs text-[var(--muted)]">
              <MapPin
                size={15}
              />

              City
            </span>

            <input
              value={city}
              onChange={(
                event,
              ) =>
                setCity(
                  event
                    .target
                    .value,
                )
              }
              disabled={
                !isEditing
              }
              data-filled={
                city.length >
                0
              }
              autoComplete="address-level2"
              placeholder="City"
              className={`
                ${inputClass}
                max-w-90
              `}
            />
          </label>

          <label className="flex justify-evenly gap-5">
            <span className="min-w-15 flex flex-col gap-1 justify-center items-center text-xs text-[var(--muted)]">
              <Cake
                size={16}
              />

              Birthday
            </span>

            <input
              type="date"
              value={
                birthday
              }
              onChange={(
                event,
              ) =>
                setBirthday(
                  event
                    .target
                    .value,
                )
              }
              disabled={
                !isEditing
              }
              data-filled={
                birthday.length >
                0
              }
              className={`
                ${inputClass}
                max-w-90
                !text-[var(--muted)]
              `}
            />
          </label>

          <label className="flex justify-evenly gap-5">
            <span className="min-w-15 flex flex-col gap-1 justify-center items-center text-xs text-[var(--muted)]">
              <VenusAndMars
                size={15}
              />

              Gender
            </span>

            <select
              value={
                gender
              }
              onChange={(
                event,
              ) =>
                setGender(
                  event
                    .target
                    .value as Gender,
                )
              }
              disabled={
                !isEditing
              }
              data-filled={
                gender.length >
                0
              }
              className={`
                ${inputClass}
                appearance-none
                text-[var(--muted)]
                max-w-90
              `}
            >
              <option value="">
                Select Gender
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>
            </select>
          </label>
        </div>

        <div className="absolute -bottom-5 right-7">
          {!isEditing ? (
            <button
              type="button"
              onClick={
                handleStartEdit
              }
              aria-label="Edit profile"
              className="
                shadow-button
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                hover:!text-[var(--warning)]
              "
            >
              <Pencil
                size={18}
              />
            </button>
          ) : (
            <div className="flex gap-5">
              <button
                type="button"
                onClick={
                  handleCancelEdit
                }
                disabled={
                  saving
                }
                aria-label="Cancel changes"
                className="
                  shadow-button
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  disabled:opacity-50
                  hover:!text-[var(--danger)]
                "
              >
                <X
                  size={20}
                />
              </button>

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  saving
                }
                aria-label="Save changes"
                className="
                  shadow-button
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  disabled:opacity-50
                  hover:!text-[var(--success)]
                "
              >
                <Check
                  size={20}
                />
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        className="
          min-w-2xs
          glass-panel
          rounded-4xl
          bg-[var(--danger-soft)]
          p-5
          my-5
        "
      >
        <div className="flex justify-center">
          <div className="relative h-60 w-60">
            <div
              className="
                neo-inset
                flex
                h-full
                w-full
                items-center
                justify-center
                overflow-hidden
                rounded-[40px]
                text-[var(--accent)]
              "
            >
              {avatar ? (
                <img
                  src={
                    avatar
                  }
                  alt={
                    displayName ||
                    username ||
                    "Profile"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound
                  size={
                    80
                  }
                />
              )}
            </div>

            {avatar && (
              <button
                type="button"
                onClick={
                  handleRemoveAvatar
                }
                aria-label="Remove profile picture"
                className="
                  shadow-button
                  absolute
                  -bottom-9
                  left-3
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  hover:!text-[var(--danger)]
                "
              >
                <Trash2
                  size={18}
                />
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                fileInputRef
                  .current
                  ?.click()
              }
              aria-label="Change profile picture"
              className="
                shadow-button
                absolute
                -bottom-9
                right-3
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                hover:!text-[var(--accent)]
              "
            >
              <Camera
                size={
                  20
                }
              />
            </button>

            <input
              ref={
                fileInputRef
              }
              type="file"
              accept="image/*"
              onChange={
                handleAvatarChange
              }
              className="hidden"
            />
          </div>
        </div>
      </section>

      <section
        className="
          w-full
          max-w-md
          order-2
          glass-panel
          rounded-[32px]
          bg-[var(--danger-soft)]
          p-6
          my-5
        "
      >
        <div className="max-w-3xs mb-1">
          <div className="flex flex-col items-center">
            <h2 className="font-semibold text-[var(--danger)]">
              Log Out
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              End Your Current
              Pulse Session.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setLogoutModalOpen(
                true,
              )
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              !bg-[var(--danger)]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              opacity-90
              hover:opacity-100
              shadow-button
              absolute
              right-7
              -bottom-6
            "
          >
            <LogOut
              size={17}
            />

            Log Out
          </button>
        </div>
      </section>

      <ConfirmModal
        open={
          logoutModalOpen
        }
        title="Log Out Of Pulse?"
        description="Your Current Session Will End. You Can Sign Back In Anytime Using Your Username And Password."
        confirmText="Log Out"
        cancelText="Stay Logged In"
        onClose={() =>
          setLogoutModalOpen(
            false,
          )
        }
        onConfirm={
          handleLogout
        }
      />
    </div>
  );
}