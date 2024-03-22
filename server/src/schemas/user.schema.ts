import { object, string, z } from "zod";

const params = {
  params: object({
    userId: string({ required_error: "User ID is required" }),
  }),
};

export const createUserSchema = object({
  body: object({
    name: string({ required_error: "Username is required" })
      .min(1)
      .max(128),
    email: string({ required_error: "Email is required" })
      .email(),
    password: string({ required_error: "Password id required" })
      .min(8)
      .max(32),
    passwordConfirm: string({
      required_error: "Please confirm your password",
    }),
  }).refine(data => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Password do not match",
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: "Email is required" })
      .email(),
    password: string({ required_error: "Password id required" }),
  }),
});

export const getUserSchema = object({
  ...params,
});

export const getUserByUsernameSchema = object({
  params: object({
    username: string({ required_error: "Username is required" }),
  }),
});

export const uploadImageProfileSchema = object({
  body: object({
    image: string({ required_error: "Image is required" }),
  }),
});

export const veriffyEmailSchema = object({
  params: object({
    verificationCode: string(),
  }),
});

// Update by `superuser`
export const updateUserSchema = {
  update: object({
    ...params,
    body: object({
      roleId: string().nullable().optional(),
      shopownerProviderId: string().nullable().optional(),
    }),
  }),
  createBlockUser: object({
    body: object({
      userId: string({ required_error: "User id is required." }),
      remark: string().max(1024).optional(),
    }),
  }),
  removeBlockdUser: object({
    params: object({
      blockedUserId: string({
        required_error: "Blocked user id is required.",
      }),
    }),
  }),
  // deleteUser: object({})
};

// Update by `self`
export const updateSelfUserSchema = {
  changeEmail: object({
    body: object({
      email: string().email({ message: "Email is required." }),
    }),
  }),
  changePassword: object({
    body: object({
      password: string({ required_error: "Password id required" })
        .min(8)
        .max(32),
      passwordConfirm: string({
        required_error: "Please confirm your password",
      }),
    }).refine(data => data.password === data.passwordConfirm, {
      path: ["passwordConfirm"],
      message: "Password do not match",
    }),
  }),
  changeUsername: object({
    body: object({
      username: string({ required_error: "Username is required." }).min(3)
        .max(12),
    }),
  }),
};

export const resendEmailVerificationSchema = object({
  body: object({
    id: string({ required_error: "User id is required." }).min(24).max(24),
    code: string({ required_error: "Code is required." }).min(64).max(64),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type LoginUserInput = z.infer<typeof loginUserSchema>["body"];
export type GetUserInput = z.infer<typeof getUserSchema>["params"];
export type GetUserByUsernameInput = z.infer<
  typeof getUserByUsernameSchema
>["params"];
export type UploadImageUserInput = z.infer<
  typeof uploadImageProfileSchema
>["body"];
export type VerificationEmailInput = z.infer<
  typeof veriffyEmailSchema
>["params"];
export type ResendEmailVerificationInput = z.infer<
  typeof resendEmailVerificationSchema
>["body"];

export type CreateBlockUserInput = z.infer<
  typeof updateUserSchema["createBlockUser"]
>;
export type RemoveBlockedUserInput = z.infer<
  typeof updateUserSchema["removeBlockdUser"]
>;
export type UpdateUserInput = z.infer<typeof updateUserSchema["update"]>;

export type ChangeEmailInput = z.infer<
  typeof updateSelfUserSchema["changeEmail"]
>;
export type ChangePasswordInput = z.infer<
  typeof updateSelfUserSchema["changePassword"]
>;
export type ChangeUsernameInput = z.infer<
  typeof updateSelfUserSchema["changeUsername"]
>;
