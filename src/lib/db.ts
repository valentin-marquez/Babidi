import { prisma } from "@lib/prisma-client";
import { Prisma, status_type } from "@prisma/client";
import { supabase } from "@lib/supabase-client";
import type { UserLocation } from "@lib/interfaces";

export async function updateUserLocation(
  userLocation: UserLocation,
): Promise<boolean> {
  const { error } = await supabase.rpc("update_user_location", {
    userid: userLocation.id,
    longitude: userLocation.longitude,
    latitude: userLocation.latitude,
  });
  if (error) {
    console.error(error);
    return false;
  }
  return true;
}

export async function getIsOnboarding(userId: string): Promise<boolean> {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      is_onboarding: true,
    },
  });
  return user.is_onboarding;
}

export async function setIsOnboarding(
  userId: string,
  isOnboarding: boolean,
): Promise<boolean> {
  const user = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      is_onboarding: isOnboarding,
    },
  });
  return user.is_onboarding;
}

interface Profile {
  id: string;
  username: string;
  full_name: string;
  status: string;
}

export async function getProfileInfo(id: string): Promise<Profile> {
  const profile = await prisma.profiles
    .findUnique({
      where: {
        user_id: id,
      },
      select: {
        user_id: true,
        username: true,
        full_name: true,
        status: true,
      },
    })
    .finally(() => {
      prisma.$disconnect();
    });
  return {
    id: profile.user_id,
    username: profile.username,
    full_name: profile.full_name,
    status: profile.status,
  };
}

export async function getCategories(): Promise<
  Array<{ id: number; name: string; slug: string }>
> {
  const categories = await prisma.categories
    .findMany({
      select: {
        category_id: true,
        name: true,
        slug: true,
      },
    })
    .finally(() => {
      prisma.$disconnect();
    });
  return categories.map((category) => ({
    id: category.category_id,
    name: category.name,
    slug: category.slug,
  }));
}

export async function getStatusTypes(): Promise<string[]> {
  const statusTypes: Array<{ type: string }> =
    await prisma.$queryRaw`SELECT unnest(enum_range(NULL::status_type))::text AS type`;
  return statusTypes.map((statusType) => statusType.type);
}

export function getStatusType(status: string): status_type {
  switch (status) {
    case "nuevo":
      return status_type.nuevo;
    case "casi usado":
      return status_type.casi_usado;
    case "usado":
      return status_type.usado;
    case "muy usado":
      return status_type.muy_usado;
    default:
      throw new Error(`Invalid status: ${status}`);
  }
}
export async function createPost(postData: {
  user_id: string;
  title: string;
  description: string;
  status: status_type;
  category_id?: number;
  images: { url: string; file_id: string }[];
}): Promise<string | null> {
  try {
    const post = await prisma.posts.create({
      data: {
        title: postData.title,
        description: postData.description,
        status: postData.status as status_type,
        category_id: postData.category_id,
        author_id: postData.user_id,
      },
    });

    const imagePromises = postData.images.map((image) =>
      prisma.post_images.create({
        data: {
          post_id: post.post_id,
          image_url: image.url,
          file_id: image.file_id,
        },
      }),
    );

    await Promise.all(imagePromises);

    return post.slug; // return the slug of the post
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
interface Post {
  post_id: number;
  title: string;
  description: string;
  author_id: string;
  created_at: Date;
  status: string;
  category_id: number;
  emoji: string | null;
  busca_descripcion: string | null;
  updated_at: Date;
  slug: string;
  image_urls: string[];
  profile_picture: string | null;
  full_name: string;
  username: string;
}

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const posts = await prisma.$queryRaw`
      SELECT * FROM post_details WHERE slug = ${slug}
    `;
    if (posts && posts.length > 0) {
      const post = posts[0];
      post.image_urls = post.image_urls.split(",");
      return post as Post;
    }
    return null;
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
