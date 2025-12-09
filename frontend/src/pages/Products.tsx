import React, { useEffect, useMemo, useState } from "react";
import API from "../api";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Filters from "../components/Filters";

export default function Products({ addToCart }:{addToCart:(p:Product)=>void}){
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [sort, setSort] = useState<string>("new");
  const [selected, setSelected] = useState<Product|null>(null);

  useEffect(()=> {
    API.get("/products?available=true").then(r=> setProducts(r.data)).catch(()=>{});
  },[]);

  const filtered = useMemo(()=> {
    let list = [...products];
    if(filters.category) list = list.filter(p=> p.category === filters.category);
    if(filters.size) list = list.filter(p=> p.size && p.size.toLowerCase().includes(filters.size.toLowerCase()));
    if(filters.number) list = list.filter(p=> p.number && p.number.toLowerCase().includes(filters.number.toLowerCase()));
    if(sort === "price_asc") list.sort((a,b)=> (a.price*(1-(a.discount_percent||0)/100)) - (b.price*(1-(b.discount_percent||0)/100)));
    if(sort === "price_desc") list.sort((a,b)=> (b.price*(1-(b.discount_percent||0)/100)) - (a.price*(1-(a.discount_percent||0)/100)));
    if(sort === "new") list.sort((a,b)=> new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }, [products, filters, sort]);

  return (
    <div>
      <Filters filters={filters} setFilters={setFilters} sort={sort} setSort={setSort}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onOpen={setSelected} onAdd={addToCart} />
        ))}
      </div>
      <ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={addToCart} />
    </div>
  );
}
