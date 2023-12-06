import type { APIRoute, APIContext } from "astro";
import { searchArticles } from "@lib/db";

function replacer(key, value) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

export const GET: APIRoute = async ({ request }): APIContext => {
  try {
    const re = new Request(request);
    const params = new URL(re.url).searchParams;
    const query = params.get("query");
    const category = params.get("category");
    const page = Number(params.get("page")) || 1;
    const pageSize = Number(params.get("pageSize")) || 10;

    const { articles, totalArticles } = await searchArticles(
      query,
      category,
      page,
      pageSize,
    );

    if (articles.length > 0) {
      return new Response(
        JSON.stringify({ articles, totalArticles }, replacer),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    } else {
      return new Response(
        JSON.stringify({ error: "No articles found" }, replacer),
        {
          status: 404,
          statusText: "No articles found",
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }, replacer),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }
};
