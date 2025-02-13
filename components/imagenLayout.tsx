import { Image } from "@heroui/image";
import Link from "next/link";

const sections = [
  { id: 1, name: "Cocina 1", path: "/cocinas", style: { top: "21%", left: "24.35%", width: "7%", height: "16.5%" } },
  { id: 2, name: "Cocina 2", path: "/cocinas", style: { top: "21%", left: "31.65%", width: "7%", height: "16.5%" } },
  { id: 3, name: "Cocina 3", path: "/cocinas", style: { top: "21%", left: "38.8%", width: "7%", height: "16.5%" } },
  { id: 4, name: "Cocina 4", path: "/cocinas", style: { top: "55.9%", left: "24.35%", width: "7%", height: "18%" } },
  { id: 5, name: "Cocina 5", path: "/cocinas", style: { top: "55.9%", left: "31.65%", width: "6.9%", height: "18%" } },
  { id: 6, name: "Cocina 6", path: "/cocinas", style: { top: "55.9%", left: "39%", width: "6.9%", height: "18%" } },
  { id: 7, name: "Enfriador 1", path: "/enfriadores", style: { top: "21%", left: "46.3%", width: "7%", height: "16.5%" } },
  { id: 8, name: "Enfriador 2", path: "/enfriadores", style: { top: "21%", left: "53.5%", width: "6.9%", height: "16.5%" } },
  { id: 9, name: "Enfriador 3", path: "/enfriadores", style: { top: "21%", left: "60.8%", width: "6.9%", height: "16.5%" } },
  { id: 10, name: "Enfriador 4", path: "/enfriadores", style: { top: "21%", left: "68.1%", width: "6.9%", height: "16.5%" } },
  { id: 11, name: "Enfriador 5", path: "/enfriadores", style: { top: "55.9%", left: "46.3%", width: "6.9%", height: "18%" } },
  { id: 12, name: "Enfriador 6", path: "/enfriadores", style: { top: "55.9%", left: "53.5%", width: "6.9%", height: "18%" } },
  { id: 13, name: "Enfriador 7", path: "/enfriadores", style: { top: "55.9%", left: "60.8%", width: "6.9%", height: "18%" } },
  { id: 14, name: "Enfriador 8", path: "/enfriadores", style: { top: "55.9%", left: "68.1%", width: "6.9%", height: "18%" } }
];

export function ImagenLayout() {
  return (
    <div className="w-full h-full relative flex justify-center items-center">
      <Image
        className="h-[75vh] w-full z-1"
        radius="md"
        src="/layout.png"
        alt="Imagen de prueba"
      />
      {sections.map((section) => (
        <Link key={section.id} href={section.path} className="z-999">
          <span
            className="absolute bg-black shadow border text-white z-999"
            style={section.style}
          >
            {section.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
