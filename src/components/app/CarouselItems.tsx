import React, { useRef, useEffect, useState } from "react";
import CategoryCard from "@app/CategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselItems = ({ categories }) => {
  const containerRef = useRef(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);
  const [itemWidth, setItemWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const isEndReached =
          container.scrollLeft + container.clientWidth >= container.scrollWidth;

        setIsLeftDisabled(container.scrollLeft === 0);
        setIsRightDisabled(isEndReached);
      }
    };

    containerRef.current.addEventListener("scroll", handleScroll);

    return () => {
      containerRef.current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current && containerRef.current.children.length > 0) {
      const firstItem = containerRef.current.children[0];
      setItemWidth(firstItem.clientWidth);
    }
  }, [categories]);

  const scroll = (scrollDirection) => {
    const scrollAmount = itemWidth * scrollDirection;

    containerRef.current.scrollTo({
      left: containerRef.current.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mx-auto max-w-xs sm:min-w-full ">
      <div className="m-2 flex flex-col gap-2 sm:m-6 sm:gap-4">
        <div className="flex flex-row items-center justify-between sm:flex-row">
          <div className="flex flex-col items-center sm:mb-0 sm:flex-row sm:space-x-4 lg:mb-2">
            <h2 className="title text-md pointer-events-none select-none font-sora font-bold leading-3 brightness-150 sm:text-3xl">
              Explorar por Categoría
            </h2>
            <a
              href="/categorias/all"
              className=" text-gray hover:text-focus-content btn btn-ghost btn-xs ml-2 inline-flex items-center rounded-btn font-sora text-xs capitalize text-base-content transition-colors sm:ml-4 lg:text-sm"
            >
              Todas las Categorías
              <ChevronRight className="text-bold ml-1 h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </div>
          <div className="flex-0 inline-flex items-center space-x-2 sm:space-x-4 lg:space-x-4">
            <span
              className={`btn btn-primary btn-sm ${
                isLeftDisabled ? "btn-disabled" : ""
              }`}
              onClick={() => scroll(-2)}
            >
              <ChevronLeft className="text-bold h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5" />
            </span>
            <span
              className={`btn btn-primary btn-sm ${
                isRightDisabled ? "btn-disabled" : ""
              }`}
              onClick={() => scroll(2)}
            >
              <ChevronRight className="text-bold h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5" />
            </span>
          </div>
        </div>
        <div
          className="grid select-none auto-cols-max grid-flow-col gap-2 overflow-x-hidden sm:gap-4 lg:gap-4"
          ref={containerRef}
        >
          {categories &&
            categories.map((category) => (
              <CategoryCard key={category.id} category={category.name} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselItems;
