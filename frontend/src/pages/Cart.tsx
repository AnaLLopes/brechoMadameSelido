import React, { useMemo, useState } from "react";
import { CartItem } from "../types";
import API from "../api";

export default function Cart({ cart, removeFromCart, clearCart }:{cart:CartItem[], removeFromCart:(id:number)=>void, clearCart:()=>void}){
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("pix");
  const [delivery, setDelivery] = useState("retirada");

  const total = useMemo(()=> cart.reduce((s,i)=> s + (i.product.price*(1-(i.product.discount_percent||0)/100))*i.quantity, 0), [cart]);

  function submit(){
    if(cart.length === 0) return alert("Carrinho vazio");
    const order = {
      customer_name: name,
      customer_phone: phone,
      payment_method: payment,
      delivery_method: delivery,
      items: cart.map(i=>({product_id: i.product.id, product_name: i.product.name, product_price: i.product.price*(1-(i.product.discount_percent||0)/100), quantity: i.quantity}))
    };
    API.post("/orders", order).then(r=>{
      const { order_number, total: totalResp } = r.data;
      // montar mensagem para WhatsApp
      let msg = `Pedido *${order_number}*%0ACliente: ${name}%0ATelefone: ${phone}%0AForma de pagamento: ${payment}%0AEntrega: ${delivery}%0AItens:%0A`;
      cart.forEach(i => {
        msg += `- ${i.product.name} x${i.quantity} R$ ${(i.product.price*(1-(i.product.discount_percent||0)/100)).toFixed(2)}%0A`;
      });
      msg += `Total: R$ ${totalResp.toFixed(2)}`;
      // link whatsapp (substitua pelo número real da loja)
      const shopNumber = "5511999999999";
      const wa = `https://wa.me/${shopNumber}?text=${msg}`;
      window.open(wa, "_blank");
      clearCart();
      alert("Pedido finalizado: " + order_number);
    }).catch(e=>{
      console.error(e);
      alert("Erro ao finalizar pedido");
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Carrinho</h2>
      <div className="grid gap-2">
        {cart.map(item => (
          <div key={item.product.id} className="bg-white p-3 rounded shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={item.product.image_url || 'https://via.placeholder.com/80'} className="w-16 h-16 object-cover rounded" />
              <div>
                <div className="font-semibold">{item.product.name} x{item.quantity}</div>
                <div className="text-sm text-gray-600">R$ {(item.product.price*(1-(item.product.discount_percent||0)/100)).toFixed(2)}</div>
              </div>
            </div>
            <button className="text-red-500" onClick={()=>removeFromCart(item.product.id)}>Remover</button>
          </div>
        ))}
      </div>
      <div className="bg-white p-3 rounded shadow">
        <div className="flex justify-between">
          <div>Total</div>
          <div className="font-bold">R$ {total.toFixed(2)}</div>
        </div>
        <div className="mt-3 grid gap-2">
          <input placeholder="Nome" className="p-2 border rounded" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Telefone (com DDD)" className="p-2 border rounded" value={phone} onChange={e=>setPhone(e.target.value)} />
          <select className="p-2 border rounded" value={payment} onChange={e=>setPayment(e.target.value)}>
            <option value="dinheiro">Dinheiro</option>
            <option value="pix">PIX</option>
            <option value="debito">Cartão débito</option>
            <option value="credito">Cartão crédito</option>
          </select>
          <select className="p-2 border rounded" value={delivery} onChange={e=>setDelivery(e.target.value)}>
            <option value="uber">Uber Flash</option>
            <option value="retirada">Retirada no local</option>
          </select>
          <button onClick={submit} className="bg-green-600 text-white p-2 rounded">Finalizar pedido (Enviar WhatsApp)</button>
        </div>
      </div>
    </div>
  );
}
