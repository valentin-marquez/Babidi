import React, { useState, useEffect, useRef, useCallback } from "react";

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Card from "@app/Card";
import type { Article, Category } from "@lib/types";

interface SearchAppProps {
  initialQuery: string;
  initialCategory: string;
  initialCategories: Category[];
  initialArticles: Article[];
  initialTotalArticles: number;
  status: string[];
}

export default function SearchApp({
  initialQuery,
  initialCategory,
  initialCategories,
  initialArticles,
  initialTotalArticles,
  status,
}: SearchAppProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [posts, setPosts] = useState<Article[]>(initialArticles);
  const [totalArticles, setTotalArticles] = useState(initialTotalArticles);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState(status);
  const [allPosts, setAllPosts] = useState<Article[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [page, totalPages],
  );

  useEffect(() => {
    if (category !== "all") {
      // search into categories for the category name and set selectedCategory
      const categoryObj = categories.find((cat) => cat.slug === category);
      if (categoryObj) {
        setSelectedCategory(categoryObj.slug);
      }
    }

    let filteredPosts = allPosts;
    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category_slug === selectedCategory,
      );
    }

    if (selectedStatus) {
      filteredPosts = filteredPosts.filter(
        (post) => post.status.replace("_", " ") === selectedStatus,
      );
    }

    setPosts(filteredPosts);
  }, [category, selectedCategory, selectedStatus, allPosts, categories]);

  const handleSetPage = async (newPage) => {
    setPage(newPage);
    const response = await fetch(
      `/api/search?query=${query}&category=${category}&page=${newPage}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const { articles: posts, totalArticles } = await response.json();
    setPosts(posts);
    setAllPosts((prevPosts) => {
      const newPosts = [...prevPosts, ...posts];
      return newPosts.reduce((acc, current) => {
        const duplicateIndex = acc.findIndex((post) => post.id === current.id);
        if (duplicateIndex === -1) {
          acc.push(current);
        }
        return acc;
      }, []);
    });
    setTotalArticles(totalArticles);
  };

  const handleClearAll = () => {
    setSelectedCategory(null);
    setCategory("all");
    setSelectedStatus(null);
    setPosts(allPosts);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    const filteredPosts = allPosts.filter((post) =>
      post.title.toLowerCase().includes(event.target.value.toLowerCase()),
    );
    setPosts(filteredPosts);
  };
  return (
    <div className="container mx-auto mt-4 px-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <h2 className="font-syne text-3xl font-semibold uppercase leading-[48px] brightness-150">
            Resultados
          </h2>
          <div className="collapse collapse-arrow mt-4 w-full grow-0 rounded-3xl border border-base-300 bg-base-200 shadow-sm md:collapse-open">
            <input type="checkbox" className="peer" />
            <h2 className="collapse-title flex flex-row items-center justify-center font-syne text-xl brightness-150">
              Filtros
            </h2>
            <div className="collapse-content">
              <div className="mb-4">
                <div className="mt-2 flex flex-col space-y-2">
                  <button className="btn btn-sm">
                    Categoria:{" "}
                    {categories.find((cat) => cat.slug === selectedCategory)
                      ?.name || "Todas"}
                  </button>
                  <button className="btn btn-sm">
                    Estado: {selectedStatus || "Todos"}
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleClearAll()}
                  >
                    Limpiar todo
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-control w-full" htmlFor="categorySelect">
                  <div className="label">
                    <span className="label-text font-sora font-semibold">
                      Categorías
                    </span>
                  </div>
                  <select
                    name=""
                    id="categorySelect"
                    className="select select-bordered transition-colors hover:select-primary"
                    value={selectedCategory || "all"}
                    onChange={(e) => {
                      const newCategory =
                        e.target.value === "all" ? null : e.target.value;
                      setSelectedCategory(newCategory);
                      setCategory(newCategory);
                    }}
                  >
                    <option value="all">Todas</option>
                    {categories.map((category) => (
                      <option
                        className="capitalize"
                        key={category.id}
                        value={category.slug}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mb-4">
                <label className="form-control" htmlFor="statusSelect">
                  <div className="label">
                    <span className="label-text font-sora font-semibold">
                      Estado
                    </span>
                  </div>
                  <select
                    name=""
                    id="statusSelect"
                    className="select select-bordered transition-colors hover:select-primary"
                    value={selectedStatus || "all"}
                    onChange={(e) =>
                      setSelectedStatus(
                        e.target.value === "all" ? null : e.target.value,
                      )
                    }
                  >
                    <option value="all">Todos</option>
                    {statusFilter.map((status, index) => (
                      <option className="capitalize" key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/4">
          <div className="mb-4 flex flex-col items-center justify-between lg:flex-row lg:items-end lg:justify-end">
            <div className="flex w-full flex-row items-center justify-end lg:w-auto">
              <input
                className="input join-item input-bordered input-secondary w-full focus:input-primary lg:w-auto"
                placeholder="Buscar en resultados"
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {posts.length > 0 &&
              posts.map((post, index) => {
                if (posts.length === index + 1) {
                  return (
                    <div ref={lastPostElementRef} key={index}>
                      <Card
                        post={{
                          title: post.title,
                          post_status: post.status.replace("_", " "),
                          slug: post.slug,
                          post_id: post.post_id,
                          image_urls: post.image_urls,
                        }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <Card
                      key={index}
                      post={{
                        title: post.title,
                        post_status: post.status.replace("_", " "),
                        slug: post.slug,
                        post_id: post.post_id,
                        image_urls: post.image_urls,
                      }}
                    />
                  );
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
