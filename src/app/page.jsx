"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EDEDED] p-4">
      {/* タイトル枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-4 flex flex-col items-center mb-4 mt-8">
        <h1 className="text-[20px] font-bold text-black text-center">POP-UP STORE レジアプリ</h1>
      </div>
      {/* スキャン＋商品情報枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-6 flex flex-col items-center mb-4">
        <button
          className="w-[290px] h-[38px] flex items-center justify-center bg-[#F3E89A] rounded shadow border border-[#747474] text-base font-bold text-black hover:bg-yellow-200 transition mb-4"
          onClick={() => router.push("/scan")}
        >
          スキャン（カメラ）
        </button>
        <div className="w-full flex flex-col items-center mb-2">
          <span className="text-[8px] text-[#878787] mb-1">コード表示エリア</span>
          <div className="w-full bg-[#F5F5F5] rounded border border-[#A8A8A8] p-2 flex flex-col items-center">
            <span className="text-[11px] text-[#B1AEAE] font-semibold">12345678901</span>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mb-2">
          <span className="text-[8px] text-[#878787] mb-1">名称表示エリア</span>
          <div className="w-full bg-[#F5F5F5] rounded border border-[#A8A8A8] p-2 flex flex-col items-center">
            <span className="text-[11px] text-[#B1AEAE] font-semibold">おーいお茶</span>
          </div>
        </div>
        <div className="w-full flex flex-col items-center">
          <span className="text-[8px] text-[#878787] mb-1">単価表示エリア</span>
          <div className="w-full bg-[#F5F5F5] rounded border border-[#A8A8A8] p-2 flex flex-col items-center">
            <span className="text-[11px] text-[#B1AEAE] font-semibold">150円</span>
          </div>
        </div>
      </div>
    </div>
  );
}