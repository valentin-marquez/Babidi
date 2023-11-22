import React, { useRef, useEffect, useState } from 'react';
import CategoryCard from "@app/CategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MagicMotion } from 'react-magic-motion';

const CarouselItems = ({ categories }) => {
    const containerRef = useRef(null);
    const [isLeftDisabled, setIsLeftDisabled] = useState(true);
    const [isRightDisabled, setIsRightDisabled] = useState(false);
    const [itemWidth, setItemWidth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const container = containerRef.current;
                const isEndReached = container.scrollLeft + container.clientWidth >= container.scrollWidth;

                setIsLeftDisabled(container.scrollLeft === 0);
                setIsRightDisabled(isEndReached);
            }
        };

        // Attach the scroll event listener to the container
        containerRef.current.addEventListener('scroll', handleScroll);

        // Cleanup the event listener when the component unmounts
        return () => {
            containerRef.current.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (containerRef.current && containerRef.current.children.length > 0) {
            // Obtener el ancho del primer hijo (suponemos que todos los elementos tienen el mismo ancho)
            const firstItem = containerRef.current.children[0];
            setItemWidth(firstItem.clientWidth);
        }
    }, [categories]);

    const scroll = (scrollDirection) => {
        const scrollAmount = itemWidth * scrollDirection;

        containerRef.current.scrollTo({
            left: containerRef.current.scrollLeft + scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="w-11/12 mx-auto container">
            <div className="m-6 flex flex-col gap-4">
                <div className="mb-4 inline-flex items-center">
                    <div className="inline-flex flex-1 items-center">
                        <h2 className="title pointer-events-none font-sora text-3xl font-bold leading-3 brightness-150">
                            Explorar por Categoría
                        </h2>
                        <a
                            href="#"
                            className="text-gray btn btn-ghost rounded-btn btn-xs ml-4 inline-flex items-center font-sora text-sm text-base-content transition-colors capitalize hover:text-focus-content"
                        >
                            Todas las Categorías
                            <ChevronRight className="text-bold ml-1 h-5 w-5" />
                        </a>
                    </div>
                    <div className="flex-0 inline-flex space-x-4 items-center">
                        <span
                            className={`btn btn-primary btn-sm ${isLeftDisabled ? 'btn-disabled' : ''}`}
                            onClick={() => scroll(-2)}
                        >
                            <ChevronLeft className="text-bold h-5 w-5" />
                        </span>
                        <span
                            className={`btn btn-primary btn-sm ${isRightDisabled ? 'btn-disabled' : ''}`}
                            onClick={() => scroll(2)}
                        >
                            <ChevronRight className="text-bold h-5 w-5" />
                        </span>
                    </div>
                </div>
                <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-hidden" ref={containerRef}>
                    {categories &&
                        categories.map((category, index) => (
                            <CategoryCard key={index} category={category} />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default CarouselItems;
