import React from "react";
import {
  Cpu,
  LampFloor,
  Shirt,
  Book,
  Dumbbell,
  Gamepad,
  PencilRuler,
  HeartPulse,
  Medal,
} from "lucide-react";

const categoryIcons: Record<string, JSX.Element> = {
  Tecnología: <Cpu size={24} />,
  Hogar: <LampFloor size={24} />,
  "Ropa y Accesorios": <Shirt size={24} />,
  "Libros y Material de lectura": <Book size={24} />,
  "Deportes y Actividades al Aire Libre": <Dumbbell size={24} />,
  "Juguetes y Juegos": <Gamepad size={24} />,
  "Instrumentos Musicales": <PencilRuler size={24} />,
  "Arte y Manualidades": <HeartPulse size={24} />,
  "Salud y Belleza": <Medal size={24} />,
  Coleccionables: <Cpu size={24} />, // Icono predeterminado
};

interface CategoryProps {
  category: string;
}
const getCategoryIcon = (category: string): JSX.Element => {
  return categoryIcons[category] || categoryIcons["Coleccionables"]; // Devuelve el icono predeterminado si no se encuentra la categoría
};

const CategoryCard: React.FC<CategoryProps> = ({ category }) => {
  return (
    <a href="#" className="group">
      <div
        className="flex h-24 w-24 flex-col items-center rounded-xl border-neutral bg-gradient-to-br from-base-200 to-base-300 p-3 transition-transform duration-300 ease-in-out hover:border hover:border-primary hover:transition-all focus:shadow-lg focus:shadow-primary sm:h-40 sm:w-36 sm:p-5"
        style={{
          boxShadow:
            "0 0 20px rgba(0, 0, 0, 0.2), 0 0 40px rgba(0, 0, 0, 0.1) inset",
          transition:
            "box-shadow 200ms ease-in-out, border-color 200ms ease-in-out",
        }}
      >
        {getCategoryIcon(category) && (
          <div className="m-auto flex transform items-center transition-all group-hover:scale-110 group-hover:text-primary">
            {getCategoryIcon(category)}
          </div>
        )}
        <p
          className="line-clamp-2 text-center font-sora text-xs font-bold text-base-content sm:text-sm"
          style={{
            textWrap: "balance",
            transition: "color 200ms ease-in-out",
          }}
        >
          {category}
        </p>
      </div>
    </a>
  );
};

export default CategoryCard;
