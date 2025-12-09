import React from "react";
import { Product } from "../types";

export default function ProductCard({product, onOpen, onAdd}:{product:Product, onOpen:(p:Product)=>void, onAdd:(p:Product)=>void}){
  const finalPrice = product.price * (1 - (product.discount_percent || 0)/100);
  return (
    <div className="bg-white rounded shadow p-3 flex flex-col">
      <div className="h-48 w-full overflow-hidden rounded cursor-pointer" onClick={()=>onOpen(product)}>
        <img src={product.image_url || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-semibold mt-2 text-sm">{product.name}</h3>
      <div className="mt-1 text-xs text-gray-600">{product.category} • {product.size || "—"} • {product.number || "—"}</div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          {product.discount_percent ? (
            <div>
              <div className="text-xs line-through text-gray-400">R$ {product.price.toFixed(2)}</div>
              <div className="font-bold">R$ {finalPrice.toFixed(2)}</div>
            </div>
          ) : <div className="font-bold">R$ {product.price.toFixed(2)}</div>}
        </div>
        <button onClick={()=>onAdd(product)} className="bg-pink-600 text-white p-2 rounded">+</button>
      </div>
    </div>
  );
}
