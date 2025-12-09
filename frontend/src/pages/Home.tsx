import React, { useEffect, useState } from "react";
import BannerCarousel from "../components/BannerCarousel";
import HorizontalScroller from "../components/HorizontalScroller";
import API from "../api";
import { Product } from "../types";

export default function Home({ addToCart }:{addToCart:(p:Product)=>void}){
  const [novidades, setNovidades] = useState<Product[]>([]);

  useEffect(()=> {
    API.get("/products?available=true").then(r=> setNovidades(r.data.slice(0,10))).catch(()=>{});
  },[]);

  return (
    <div className="space-y-6">
      <BannerCarousel />
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold">Sobre o brechó</h2>
        <p className="mt-2 text-sm">Madame Selido é um brechó com curadoria de peças únicas... (adicione o texto real aqui).</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold">Envios</h3>
          <ul className="mt-2 text-sm">
            <li>Uber Flash</li>
            <li>Retirada no local</li>
            <li>Correios (sob consulta)</li>
          </ul>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold">Pagamentos</h3>
          <ul className="mt-2 text-sm">
            <li>Dinheiro</li>
            <li>PIX</li>
            <li>Cartão débito/crédito</li>
          </ul>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold">Tipos de roupa</h3>
          <ul className="mt-2 text-sm">
            <li>Feminino, Masculino, Infantil</li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Novidades da semana</h3>
        <HorizontalScroller items={novidades} onAdd={addToCart} />
      </section>
    </div>
  );
}
