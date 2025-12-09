import React from "react";
import { Product } from "../types";

export default function ProductModal({product, onClose, onAdd}:{product:Product|null, onClose:()=>void, onAdd:(p:Product)=>void}){
  if(!product) return null;
  const finalPrice = product.price * (1 - (product.discount_percent || 0)/100);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white max-w-xl w-full rounded p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <button onClick={onClose} className="text-gray-600">Fechar</button>
        </div>
        <div className="mt-3 md:flex gap-4">
          <img src={product.image_url || 'https://via.placeholder.com/500'} alt={product.name} className="w-full md:w-1/2 h-64 object-cover rounded" />
          <div className="md:flex-1">
            <p className="mt-2 text-sm">{product.description}</p>
            <p className="mt-3 text-sm">Classificação: {product.category}</p>
            <p className="text-sm">Tamanho: {product.size || "—"}</p>
            <p className="text-sm">Numeração: {product.number || "—"}</p>
            <div className="mt-4">
              {product.discount_percent ? (
                <>
                  <div className="text-xs line-through text-gray-400">R$ {product.price.toFixed(2)}</div>
                  <div className="font-bold text-lg">R$ {finalPrice.toFixed(2)} <span className="text-xs text-green-600">({product.discount_percent}% off)</span></div>
                </>
              ) : <div className="font-bold text-lg">R$ {product.price.toFixed(2)}</div>}
            </div>
            <div className="mt-4">
              <button onClick={()=>{ onAdd(product); onClose(); }} className="bg-pink-600 text-white px-4 py-2 rounded">Adicionar ao carrinho</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
