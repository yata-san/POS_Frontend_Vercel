"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";

const CartContext = global.CartContext || React.createContext({ cart: [], setCart: () => {} });
global.CartContext = CartContext;

export default function CompletePage() {
  const router = useRouter();
  const { setCart } = useContext(CartContext);

  const handleOk = () => {
    setCart([]); // カートを空に
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EDEDED] p-4">
      <div className="w-full max-w-md bg-[#FBFAFA] rounded-lg shadow-md p-8 flex flex-col items-center border border-[#747474]">
        <div className="text-lg font-bold mb-6">購入が完了しました！</div>
        <button
          className="w-[88px] bg-[#2D4FBC] rounded-lg px-6 py-3 shadow text-white font-bold text-base"
          onClick={handleOk}
        >
          OK
        </button>
      </div>
    </div>
  );
} 