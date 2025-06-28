"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 商品カート用のContext（仮実装、後でProviderを作成予定）
const CartContext = global.CartContext || React.createContext({ cart: [], setCart: () => {} });
global.CartContext = CartContext;

export default function CartPage() {
  const router = useRouter();
  // Contextからカート情報を取得
  const { cart, setCart } = useContext(CartContext);

  // 商品情報（cartページでは常に空欄）
  const product = null;

  // 商品追加
  const handleAdd = () => {
    // すでにカートに同じ商品があれば数量を増やす
    const idx = cart.findIndex(item => item.CODE === product.CODE);
    if (idx >= 0) {
      setCart(cart => cart.map((item, i) => i === idx ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart(cart => [...cart, { ...product, qty: 1 }]);
    }
  };

  // 数量増減
  const changeQty = (idx, delta) => {
    setCart(cart => cart.map((item, i) => i === idx ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };
  // 削除
  const removeItem = idx => {
    setCart(cart => cart.filter((_, i) => i !== idx));
  };

  // 合計計算
  const subtotal = cart.reduce((sum, item) => sum + item.PRICE * item.qty, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EDEDED] p-4">
      {/* タイトル枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-4 flex flex-col items-center mb-4 mt-8">
        <h1 className="text-[20px] font-bold text-black text-center">POP-UP STORE レジアプリ</h1>
      </div>
      {/* 商品情報＋追加ボタン枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-6 flex flex-col items-center mb-4">
        <div className="w-full flex flex-col items-center mb-2">
          <span className="text-[8px] text-[#878787] mb-1">コード表示エリア</span>
          <div className="w-full bg-[#F5F5F5] rounded border border-[#A8A8A8] p-2 flex flex-col items-center">
            <span className="text-[11px] text-[#B1AEAE] font-semibold"></span>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mb-2">
          <span className="text-[8px] text-[#878787] mb-1">名称表示エリア</span>
          <div className="w-full bg-[#F5F5F5] rounded border border-[#A8A8A8] p-2 flex flex-col items-center">
            <span className="text-[11px] text-[#B1AEAE] font-semibold"></span>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mb-4">
          <span className="text-[8px] text-[#878787] mb-1">単価表示エリア</span>
          <div className="w-full bg-[#F5F5F5] rounded border border-[#A8A8A8] p-2 flex flex-col items-center">
            <span className="text-[11px] text-[#B1AEAE] font-semibold"></span>
          </div>
        </div>
        <button
          className="w-[290px] h-[38px] flex items-center justify-center bg-[#F3E89A] rounded shadow border border-[#747474] text-base font-bold text-black hover:bg-yellow-200 transition"
          onClick={() => router.push("/scan")}
        >
          商品を追加
        </button>
      </div>
      {/* 購入リスト枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-4 flex flex-col items-center mt-2">
        <span className="text-[16px] text-black font-bold mb-2">購入リスト</span>
        {cart.length === 0 ? (
          <span className="text-[13px] text-[#C0C0C0]">商品がありません</span>
        ) : (
          <div className="w-full">
            {cart.map((item, idx) => (
              <div key={item.CODE} className="flex items-center justify-between bg-[#F5F5F5] rounded border border-[#A8A8A8] p-2 mb-2">
                <div className="flex-1 flex flex-col justify-between min-h-[48px]">
                  <div className="text-xs font-normal text-black line-clamp-2 break-all overflow-hidden text-ellipsis max-h-[2.6em] leading-snug">
                    {item.NAME}
                  </div>
                  <div className="flex items-center mt-1 space-x-2">
                    <button className="px-2 text-base border border-[#747474] rounded bg-white hover:bg-gray-100 font-semibold" onClick={() => changeQty(idx, -1)}>-</button>
                    <span className="text-base">{item.qty}</span>
                    <button className="px-2 text-base border border-[#747474] rounded bg-white hover:bg-gray-100 font-semibold ml-3" onClick={() => changeQty(idx, 1)}>+</button>
                    <button className="px-2 py-1 border border-[#747474] rounded bg-white hover:bg-gray-100 text-xs font-normal ml-8" onClick={() => removeItem(idx)}>
                      削除
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-start h-full ml-2 min-h-[48px]">
                  <div className="text-base font-bold text-black self-end">{item.PRICE}円</div>
                </div>
              </div>
            ))}
            <div className="w-full mt-4 text-right">
              <div className="text-sm">小計（税抜き）：<span className="ml-2">{subtotal}円</span></div>
              <div className="text-sm">消費税（10%）：<span className="ml-2">{tax}円</span></div>
              <div className="text-base font-bold mt-1">合計（税込み）：<span className="ml-2">{total}円</span></div>
            </div>
            <button
              className="w-[290px] bg-[#F3E89A] rounded px-6 py-3 shadow hover:bg-yellow-200 transition border border-[#747474] text-black font-bold text-base mt-6"
              onClick={() => router.push("/confirm")}
              disabled={cart.length === 0}
            >
              購入
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 