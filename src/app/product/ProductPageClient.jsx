"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import React from "react";

const CartContext = global.CartContext || React.createContext({ cart: [], setCart: () => {} });
global.CartContext = CartContext;

export default function ProductPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { cart, setCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_ENDPOINT + `/items?code=${code}`
        );
        if (!res.ok) throw new Error("商品が見つかりません");
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error("商品が見つかりません");
        }
        setProduct(data);
        setError("");
      } catch (e) {
        setError(e.message);
        setProduct(null);
      }
    };
    fetchProduct();
  }, [code]);

  const handleAddToCart = () => {
    if (!product) return;
    // すでにカートに同じ商品があれば数量を増やす
    const idx = cart.findIndex(item => item.CODE === product.CODE);
    if (idx >= 0) {
      setCart(cart => cart.map((item, i) => i === idx ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart(cart => [...cart, { ...product, qty: 1 }]);
    }
    setProduct(null); // 追加後にリセット
    router.push("/cart"); // 追加後にcartページへ遷移
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EDEDED] p-4">
      {/* タイトル枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-4 flex flex-col items-center mb-4 mt-8">
        <h1 className="text-[20px] font-bold text-black text-center">POP-UP STORE レジアプリ</h1>
      </div>
      {/* 商品情報枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-6 flex flex-col items-center mb-4">
        <div className="w-full flex flex-col items-center mb-2">
          <span className="text-[8px] text-[#878787] mb-1">コード表示エリア</span>
          <div className={`w-full bg-[#F5F5F5] rounded border p-2 flex flex-col items-center ${product ? 'border-black' : 'border-[#A8A8A8]'}`}>
            <span className={`text-[11px] font-semibold ${product ? 'text-black' : 'text-[#B1AEAE]'}`}>{product?.CODE || ""}</span>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mb-2">
          <span className="text-[8px] text-[#878787] mb-1">名称表示エリア</span>
          <div className={`w-full bg-[#F5F5F5] rounded border p-2 flex flex-col items-center ${product ? 'border-black' : 'border-[#A8A8A8]'}`}>
            <span className={`text-[11px] font-semibold ${product ? 'text-black' : 'text-[#B1AEAE]'}`}>{product?.NAME || ""}</span>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mb-4">
          <span className="text-[8px] text-[#878787] mb-1">単価表示エリア</span>
          <div className={`w-full bg-[#F5F5F5] rounded border p-2 flex flex-col items-center ${product ? 'border-black' : 'border-[#A8A8A8]'}`}>
            <span className={`text-[11px] font-semibold ${product ? 'text-black' : 'text-[#B1AEAE]'}`}>{product ? `${product.PRICE}円` : ""}</span>
          </div>
        </div>
        {error ? (
          <>
            <div className="text-red-500 mb-4 text-base font-bold text-center">
              {error === "商品が見つかりません" ? "商品がマスタに未登録です" : error}
            </div>
            <button
              className="w-[290px] h-[38px] flex items-center justify-center bg-[#F3E89A] rounded shadow border border-[#747474] text-base font-bold text-black hover:bg-yellow-200 transition mt-2"
              onClick={() => router.push("/scan")}
            >
              戻る
            </button>
          </>
        ) : !product ? (
          <div className="text-gray-500">商品情報を取得中...</div>
        ) : (
          <button
            className="w-[290px] bg-[#F3E89A] rounded px-6 py-3 shadow hover:bg-yellow-200 transition border border-[#747474] text-black font-bold text-base"
            onClick={handleAddToCart}
            disabled={!product}
          >
            ＋追加
          </button>
        )}
      </div>
    </div>
  );
} 