import type { APIRoute, APIContext } from "astro";
import { TokenVerification } from "@lib/decorators";
import { uploadAvatar, deleteAvatar } from "@lib/auth";
import { updateProfile } from "@lib/db";

export const POST: APIRoute = TokenVerification(
  async ({ request }: APIContext) => {
    try {
      const formData = await request.formData();
      const userId = formData.get("id") as string;
      const fullName = formData.get("fullName") as string;
      const username = formData.get("username") as string;
      const bio = formData.get("bio") as string;
      const avatar: File = formData.get("avatar") as File;
      const file_id: string = formData.get("file_id") as string;

      const uploadResult: { url: string; file_id: string } = await uploadAvatar(
        avatar,
        userId,
      );

      const updatedUser = await updateProfile({
        user_id: userId,
        full_name: fullName,
        username: username,
        bio: bio,
        avatar: uploadResult.url,
        avatar_id: file_id,
      });

      if (updatedUser) {
        const deleteResult = await deleteAvatar(file_id);
        if (!deleteResult) {
          console.error("Error deleting avatar");
        }
      }

      return new Response(JSON.stringify(updatedUser), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  },
);
