import type { APIRoute, APIContext } from "astro";
import { getCategories } from "@lib/db"; // replace with your actual function

export const GET: APIRoute = async ({ request }: APIContext) => {
  try {
    // return category with id
    const categories = await getCategories();
    if (categories && categories.length > 0) {
      return new Response(JSON.stringify({ categories }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    } else {
      return new Response(JSON.stringify({ error: "No categories found" }), {
        status: 404,
        statusText: "No categories found",
        headers: {
          "content-type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
};
