import React, { useEffect, useState } from "react";
import API from "../api";
import { Product } from "../types";

function AdminProductForm({ onSaved, editing}:{onSaved:()=>void, editing?:Product|null}){
  // simplified form (you can extract to component file)
  const [form, setForm] = useState<any>(editing || {name:"", description:"", category:"feminino", size:"", number:"", price:0, discount_percent:0, image_url:""});
  useEffect(()=> setForm(editing || form), [editing]);
  async function save(){
    try{
      if(editing) await API.put(`/products/${editing!.id}`, form);
      else await API.post("/products", form);
      onSaved();
    }catch(e){ console.error(e); alert("Erro ao salvar"); }
  }
  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="grid gap-2">
        <input className="p-2 border" placeholder="Nome" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <textarea className="p-2 border" placeholder="Descrição" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <select className="p-2 border" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
          <option value="feminino">Feminino</option>
          <option value="masculino">Masculino</option>
          <option value="infantil">Infantil</option>
        </select>
        <input className="p-2 border" placeholder="Tamanho" value={form.size} onChange={e=>setForm({...form, size:e.target.value})}/>
        <input className="p-2 border" placeholder="Numeração" value={form.number} onChange={e=>setForm({...form, number:e.target.value})}/>
        <input type="number" className="p-2 border" placeholder="Preço" value={form.price} onChange={e=>setForm({...form, price: parseFloat(e.target.value)})}/>
        <input type="number" className="p-2 border" placeholder="% Desconto" value={form.discount_percent} onChange={e=>setForm({...form, discount_percent: parseInt(e.target.value || "0")})}/>
        <input className="p-2 border" placeholder="Imagem URL" value={form.image_url} onChange={e=>setForm({...form, image_url:e.target.value})}/>
        <div className="flex gap-2">
          <button onClick={save} className="bg-blue-600 text-white p-2 rounded">Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default function Admin(){
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product|null>(null);
  const [refresh, setRefresh] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(()=> {
    API.get("/products?available=false").then(r=>{
      // also fetch available ones to manage
      API.get("/products?available=true").then(r2=>{
        setProducts([...r.data, ...r2.data]);
      });
    });
  }, [refresh]);

  function reload(){ setRefresh(v=>v+1); }

  async function remove(id:number){
    if(!confirm("Remover produto?")) return;
    await API.delete(`/products/${id}`);
    reload();
  }

  async function getMetrics(){
    const r = await API.get(`/admin/metrics?year=${year}&month=${month}`);
    setMetrics(r.data);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Administração</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Adicionar / Editar produto</h3>
          <AdminProductForm onSaved={reload} editing={editing} />
        </div>
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Métricas mensais</h3>
          <div className="flex gap-2 mt-2">
            <input type="number" value={year} onChange={e=>setYear(parseInt(e.target.value||"2025"))} className="p-2 border rounded" />
            <input type="number" value={month} onChange={e=>setMonth(parseInt(e.target.value||"1"))} className="p-2 border rounded" />
            <button onClick={getMetrics} className="bg-purple-600 text-white p-2 rounded">Buscar</button>
          </div>
          {metrics && (
            <div className="mt-2">
              <div>Vendas: {metrics.count}</div>
              <div>Faturado: R$ {metrics.total?.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-3 rounded shadow">
        <h3 className="font-semibold">Produtos</h3>
        <div className="grid md:grid-cols-3 gap-4 mt-3">
          {products.map(p => (
            <div key={p.id} className="border p-2 rounded">
              <div className="flex gap-2 items-center">
                <img src={p.image_url || 'https://via.placeholder.com/80'} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm">{p.category} • R$ {p.price.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>setEditing(p)} className="p-1 bg-yellow-400 rounded">Editar</button>
                <button onClick={()=>remove(p.id)} className="p-1 bg-red-500 text-white rounded">Remover</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
