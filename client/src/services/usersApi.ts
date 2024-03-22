import { UpdateUserInput } from "@/components/content/users/forms";
import { UploadProfilePictureInput } from "@/components/image-uploader";
import { CacheResource } from "@/context/cacheKey";
import { UserWhereInput } from "@/context/user";
import { BaseApiService } from "./baseApiService";
import { GenericResponse, HttpListResponse, Pagination, QueryOptionArgs, User } from "./types";

import { authApi } from "./authApi";

export class UserApiService extends BaseApiService<UserWhereInput, User> {
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new UserApiService(CacheResource.User);
  }

  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: UserWhereInput["where"];
      pagination: Pagination;
      include?: UserWhereInput["include"];
    },
  ): Promise<HttpListResponse<User>> {
    const url = `/${this.repo}`;
    const { filter, pagination, include } = where;

    const { data } = await authApi.get(url, {
      ...opt,
      params: {
        filter,
        pagination,
        include,
        orderBy: {
          updatedAt: "desc",
        },
      },
    });
    return data;
  }

  async find(
    opt: QueryOptionArgs,
    where: {
      filter: { id: string | undefined; };
      include?: UserWhereInput["include"];
    },
  ): Promise<GenericResponse<User, "user"> | undefined> {
    const { filter: { id }, include } = where;
    const url = `/${this.repo}/detail/${id}`;

    if (!id) return;
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include },
    });
    return data;
  }

  async findProfile(
    opt: QueryOptionArgs,
    where: {
      username: string | undefined;
    },
  ): Promise<GenericResponse<User, "user"> | undefined> {
    const { username } = where;
    const url = `/users/profile/${username}`;

    if (!username) return;
    const { data } = await authApi.get(url, {
      ...opt,
    });
    return data;
  }

  async block(
    { userId, remark }: { userId: string; remark?: string; },
  ): Promise<GenericResponse<User, "user">> {
    const url = `/${this.repo}/block-user`;

    const { data } = await authApi.patch(url, {
      userId,
      remark,
    });
    return data;
  }

  async unblock(
    { blockedUserId }: { blockedUserId: string; },
  ): Promise<GenericResponse<User, "user">> {
    const url = `/${this.repo}/unblock-user/${blockedUserId}`;

    const { data } = await authApi.patch(url);
    return data;
  }

  async uploadProfilePicture(
    upload: UploadProfilePictureInput,
  ): Promise<GenericResponse<User, "user">> {
    const url = `/me/upload/profile-picture`;

    const formData = new FormData();
    formData.append("profile", upload.image[0]);

    const res = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async uploadCoverPhoto(upload: UploadProfilePictureInput) {
    const url = `/me/upload/cover-photo`;

    const formData = new FormData();
    formData.append("profile", upload.image[0]);

    const res = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async update(
    arg: { id: string; payload: UpdateUserInput; },
  ): Promise<GenericResponse<User, "user">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }
}
