import React from "react";
import { Product } from "../types";

export default function HorizontalScroller({items, onAdd}:{items:Product[], onAdd:(p:Product)=>void}){
  return (
    <div className="overflow-x-auto py-4">
      <div className="flex gap-4 min-w-max">
        {items.map(p => (
          <div key={p.id} className="w-56 bg-white rounded shadow p-3 flex-shrink-0">
            <img src={p.image_url || 'https://via.placeholder.com/300'} alt={p.name} className="h-40 w-full object-cover rounded" />
            <h4 className="font-semibold mt-2 text-sm">{p.name}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold">R$ {p.price.toFixed(2)}</span>
              <button onClick={()=>onAdd(p)} className="bg-pink-600 text-white p-1 rounded">+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
