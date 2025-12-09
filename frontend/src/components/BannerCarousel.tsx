import React, { useEffect, useState } from "react";

const images = [
  { url: "https://via.placeholder.com/1200x400?text=Promo+1", title: "Promoção da semana 1" },
  { url: "https://via.placeholder.com/1200x400?text=Promo+2", title: "Promoção da semana 2" },
  { url: "https://via.placeholder.com/1200x400?text=Promo+3", title: "Compre mais, gaste menos" },
];

export default function BannerCarousel(){
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(()=> setIndex(i => (i+1) % images.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="w-full rounded overflow-hidden">
      <img src={images[index].url} alt={images[index].title} className="w-full h-56 object-cover md:h-80" />
      <div className="p-4">
        <h3 className="text-xl md:text-2xl font-semibold">{images[index].title}</h3>
      </div>
    </div>
  );
}
