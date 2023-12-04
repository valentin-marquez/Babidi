import type { APIRoute, APIContext } from "astro";
import { TokenVerification } from "@lib/decorators";
import { uploadAvatar } from "@lib/auth";
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

      
      const uploadResult: { url: string; file_id: string } = await uploadAvatar(
        avatar,
        userId,
        );
        console.log("userId", userId);
        console.log("fullName", fullName);
        console.log("username", username);
        console.log("bio", bio);
        console.log("avatar", avatar);
        console.log("uploadResult", uploadResult);
        
      const updatedUser = await updateProfile({
        user_id: userId,
        full_name: fullName,
        username: username,
        bio: bio,
        avatar: uploadResult.url,
        avatar_id: uploadResult.file_id,
      });

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
