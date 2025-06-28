"use client";
import { useContext, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const CartContext = global.CartContext || React.createContext({ cart: [], setCart: () => {} });
global.CartContext = CartContext;

export default function ConfirmPage() {
  const router = useRouter();
  const { cart, setCart } = useContext(CartContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fixedTotal, setFixedTotal] = useState(null);
  
  // 初期金額を計算（処理中でない場合のみ再計算）
  const calculatedSubtotal = cart.reduce((sum, item) => sum + item.PRICE * item.qty, 0);
  const calculatedTax = Math.round(calculatedSubtotal * 0.1);
  const calculatedTotal = calculatedSubtotal + calculatedTax;
  
  // 表示する金額（処理中は固定値、そうでなければ計算値）
  const displayTotal = fixedTotal !== null ? fixedTotal : calculatedTotal;

  // 購入処理
  const handlePurchase = async () => {
    // 処理開始時に金額を固定
    setFixedTotal(calculatedTotal);
    setIsProcessing(true);
    
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          subtotal: calculatedSubtotal,
          total: calculatedTotal
        })
      });
      if (res.ok) {
        // 遷移後にカートをクリアするために、遷移を先に実行
        router.push("/complete");
        // 遷移後にカートをクリア（遷移が完了してからクリアされるため表示に影響しない）
        setTimeout(() => {
          setCart([]);
        }, 100);
      } else {
        alert("購入処理に失敗しました");
        setIsProcessing(false);
        setFixedTotal(null);
      }
    } catch (error) {
      alert("購入処理に失敗しました");
      setIsProcessing(false);
      setFixedTotal(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EDEDED] p-4">
      <div className="w-full max-w-md bg-[#FBFAFA] rounded-lg shadow-md p-8 flex flex-col items-center border border-[#747474]">
        <div className="text-lg font-bold mb-4">購入確認</div>
        <div className="text-base mb-2">合計金額</div>
        <div className="text-2xl font-bold text-red-600 mb-6">{displayTotal}円</div>
        <div className="flex w-full gap-4 justify-center">
          <button
            className={`w-[141px] rounded px-6 py-3 shadow border border-[#747474] text-black font-bold text-base ${
              isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#F3E89A]'
            }`}
            onClick={handlePurchase}
            disabled={isProcessing}
          >
            {isProcessing ? '処理中...' : 'OK'}
          </button>
          <button
            className="w-[141px] bg-white rounded px-6 py-3 shadow border border-[#747474] text-black font-bold text-base"
            onClick={() => router.push("/cart")}
            disabled={isProcessing}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
} 