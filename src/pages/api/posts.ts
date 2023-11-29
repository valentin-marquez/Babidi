import type { APIRoute, APIContext } from "astro";
import { TokenVerification } from "@lib/decorators";
import {
  // getPosts,
  createPost,
  updatePost,
  deletePost,
  getStatusType,
} from "@lib/db";
import { uploadImage } from "@lib/auth";

// export const GET: APIRoute = TokenVerification(
//   async ({ request }: APIContext) => {
//     try {
//       const posts = await getPosts();
//       return new Response(JSON.stringify(posts), {
//         status: 200,
//         headers: {
//           "content-type": "application/json",
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//         status: 500,
//         headers: {
//           "content-type": "application/json",
//         },
//       });
//     }
//   },
// );

export const POST: APIRoute = TokenVerification(
  async ({ request }: APIContext) => {
    try {
      const formData = await request.formData();
      const userId = formData.get("id") as string;
      const title = formData.get("title") as string;
      const description: string = formData.get("description") as string;
      const status = formData.get("status") as string;
      const categoryId: number = Number(formData.get("category_id"));
      const images: File[] = formData.getAll("images") as File[];

      const uploadPromises: Promise<{ url: string; file_id: string }>[] =
        images.map((image: File) => uploadImage(image as File));
      const uploadResults: { url: string; file_id: string }[] =
        await Promise.all(uploadPromises);

      const slug = await createPost({
        user_id: userId as string,
        title: title as string,
        description: description as string,
        status: getStatusType(status),
        category_id: categoryId,
        images: uploadResults,
      });
      return new Response(JSON.stringify(slug), {
        status: 201,
        headers: {
          "content-type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error creating post:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  },
);
