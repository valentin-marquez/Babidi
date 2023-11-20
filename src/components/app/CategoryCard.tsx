import React from 'react';
import { Cpu, LampFloor, Shirt, Book, Dumbbell, Gamepad, PencilRuler, HeartPulse, Medal } from "lucide-react";

interface CategoryProps {
    category: string;
}

const categoryIcons: Record<string, JSX.Element> = {
    'Tecnología': <Cpu size={24} />,
    'Hogar': <LampFloor size={24} />,
    'Ropa y Accesorios': <Shirt size={24} />,
    'Libros y Material de lectura': <Book size={24} />,
    'Deportes y Actividades al Aire Libre': <Dumbbell size={24} />,
    'Juguetes y Juegos': <Gamepad size={24} />,
    'Instrumentos Musicales': <PencilRuler size={24} />,
    'Arte y Manualidades': <HeartPulse size={24} />,
    'Salud y Belleza': <Medal size={24} />,
    'Coleccionables': <Cpu size={24} />, // Icono predeterminado
};

const getCategoryIcon = (category: string): JSX.Element => {
    return categoryIcons[category] || categoryIcons['Coleccionables']; // Devuelve el icono predeterminado si no se encuentra la categoría
};


const CategoryCard: React.FC<CategoryProps> = ({ category }) => {
    return (
        <a href="#" className="group">
            <div
                className="flex h-40 w-36 flex-col items-center rounded-xl bg-base-200 p-5 transition-transform duration-300 ease-in-out hover:border hover:border-primary hover:transition-all "
            >
                {getCategoryIcon(category) && (
                    <div className="m-auto transform transition-all group-hover:scale-110 group-hover:text-primary flex items-center">
                        {getCategoryIcon(category)}
                    </div>
                )}
                <p
                    className="line-clamp-2 text-center font-sora text-sm font-bold text-base-content"
                    style={{ textWrap: "balance" }}
                >
                    {category}
                </p>
            </div>
        </a>

    );
};

export default CategoryCard;