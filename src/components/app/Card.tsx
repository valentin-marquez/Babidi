import React from "react";
import { MoreHorizontal } from "lucide-react";

interface UserPost {
  title: string;
  post_status: string;
  slug: string;
  post_id: string;
  image_urls: string;
}

interface CardProps {
  post: UserPost;
  isSame?: boolean;
}

const Card: React.FC<CardProps> = ({ post, isSame = false }) => {
  return (
    <div className="bg-card text-card-foreground w-full rounded-3xl border border-base-300 bg-base-200 shadow-sm">
      <div className="p-4">
        <div className="relative rounded-3xl">
          <img
            src={post.image_urls.split(",")[0]}
            alt="Abstract Art"
            className="h-auto w-full rounded-3xl"
            width="260"
            height="260"
            style={{ aspectRatio: "260 / 260", objectFit: "cover" }}
          />
          {isSame && (
            <div className="absolute right-2 top-2 flex items-center space-x-1">
              <details className="dropdown dropdown-left">
                <summary className="btn btn-circle btn-xs ">
                  <MoreHorizontal className="h-4 w-4" />
                </summary>
                <ul className="menu dropdown-content z-10 w-52 rounded-box bg-base-100 p-2 shadow">
                  <li>
                    <a href="#"> Editar</a>
                    <a href="#"> Eliminar</a>
                  </li>
                </ul>
              </details>
            </div>
          )}
        </div>
        <div className="mt-4">
          <a href={`/post/${post.slug}`}>
            <h3 className="h-6 overflow-hidden overflow-ellipsis text-lg font-semibold">
              {post.title}
            </h3>
          </a>
          <div className="mt-2">
            <span className="badge badge-neutral badge-outline px-2 py-1 text-xs font-medium capitalize">
              {post.post_status}
            </span>
          </div>
          <div className="mt-4">
            <a
              className="btn btn-square btn-primary btn-block capitalize"
              href={`/post/${post.slug}`}
            >
              Ver publicación
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
