import React from "react";

export default function Filters({filters, setFilters, sort, setSort}:{filters:any, setFilters:(f:any)=>void, sort:string, setSort:(s:string)=>void}){
  return (
    <div className="bg-white p-3 rounded shadow mb-4">
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <select className="p-2 border rounded" value={filters.category || ""} onChange={e=>setFilters({...filters, category: e.target.value || undefined})}>
          <option value="">Todas as categorias</option>
          <option value="feminino">Feminino</option>
          <option value="masculino">Masculino</option>
          <option value="infantil">Infantil</option>
        </select>
        <input placeholder="Tamanho (ex: M, 1, unico)" className="p-2 border rounded" value={filters.size || ""} onChange={e=>setFilters({...filters, size: e.target.value || undefined})} />
        <input placeholder="Numeração (ex: 36)" className="p-2 border rounded" value={filters.number || ""} onChange={e=>setFilters({...filters, number: e.target.value || undefined})} />
        <select className="p-2 border rounded" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="new">Mais novos</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
        </select>
      </div>
    </div>
  );
}
