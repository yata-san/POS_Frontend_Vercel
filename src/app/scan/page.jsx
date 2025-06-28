"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stream;
    let controls;
    let isMounted = true;

    const start = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // カメラAPIのサポート確認
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("このブラウザはカメラAPIに対応していません");
        }

        // デバイス一覧を取得
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
          throw new Error("利用可能なカメラデバイスが見つかりません");
        }

        console.log("利用可能なカメラデバイス:", videoDevices.length);

        // カメラストリームを取得
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        if (videoRef.current && isMounted) {
          videoRef.current.srcObject = stream;
          
          // ビデオの読み込み完了を待つ
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false);
          };
          
          controls = codeReader.decodeFromVideoDevice(
            null,
            videoRef.current,
            (result, err) => {
              if (result && !scanned && isMounted) {
                setScanned(true);
                const code = result.getText();
                console.log("スキャンされたコード:", code);
                
                // JANコード（13桁）かチェック
                if (/^\d{13}$/.test(code)) {
                  stream.getTracks().forEach(track => track.stop());
                  if (controls && controls.stop) controls.stop();
                  router.push(`/product?code=${code}`);
                } else {
                  console.log("13桁以外のコードは無視:", code);
                  // 13桁以外は無視
                  setScanned(false);
                }
              }
            }
          );
        }
      } catch (err) {
        console.error("カメラ起動エラー:", err);
        setIsLoading(false);
        
        // エラーの種類に応じてメッセージを変更
        let errorMessage = "カメラの起動に失敗しました";
        
        if (err.name === "NotAllowedError") {
          errorMessage = "カメラの使用が許可されていません。ブラウザの設定でカメラの使用を許可してください。";
        } else if (err.name === "NotFoundError") {
          errorMessage = "カメラデバイスが見つかりません。カメラが接続されているか確認してください。";
        } else if (err.name === "NotReadableError") {
          errorMessage = "カメラが他のアプリケーションで使用中です。他のアプリを閉じてから再試行してください。";
        } else if (err.name === "OverconstrainedError") {
          errorMessage = "要求されたカメラ設定に対応していません。";
        } else if (err.message) {
          errorMessage = `カメラの起動に失敗しました: ${err.message}`;
        }
        
        setError(errorMessage);
      }
    };
    
    start();

    return () => {
      isMounted = false;
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (controls && controls.stop) controls.stop();
    };
  }, [router, scanned]);

  const retryCamera = () => {
    setError(null);
    setScanned(false);
    // useEffectを再実行するためにkeyを変更
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EDEDED] p-4">
      {/* タイトル枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-4 flex flex-col items-center mb-4 mt-8">
        <h1 className="text-[20px] font-bold text-black text-center">POP-UP STORE レジアプリ</h1>
      </div>
      {/* バーコードスキャナー枠 */}
      <div className="w-full max-w-[326px] bg-[#FBFAFA] rounded-lg shadow border border-[#747474] p-6 flex flex-col items-center mb-4">
        <span className="text-base font-semibold text-black mb-2">バーコードスキャナー</span>
        <div className="w-[291px] h-[159px] bg-[#828282] rounded-lg border-2 border-[#F5F5F5] flex items-center justify-center mb-4 overflow-hidden relative">
          {isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-600 text-white">
              <div className="text-center">
                <div className="mb-2">📷</div>
                <div className="text-sm">カメラを起動中...</div>
              </div>
            </div>
          )}
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-800 p-2">
              <div className="text-center text-xs">
                <div className="mb-2">❌</div>
                <div>{error}</div>
              </div>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}
        </div>
        
        {error ? (
          <div className="text-center mb-4">
            <span className="text-xs text-red-600 mb-2 block">{error}</span>
            <button
              className="w-[290px] h-[38px] flex items-center justify-center bg-[#F3E89A] rounded shadow border border-[#747474] text-base font-bold text-black hover:bg-yellow-200 transition mb-2"
              onClick={retryCamera}
            >
              再試行
            </button>
          </div>
        ) : (
          <span className="text-xs text-black mb-4">カメラでバーコードをスキャンしてください</span>
        )}
        
        <button
          className="w-[290px] h-[38px] flex items-center justify-center bg-[#F3E89A] rounded shadow border border-[#747474] text-base font-bold text-black hover:bg-yellow-200 transition"
          onClick={() => router.push("/")}
        >
          閉じる
        </button>
      </div>
    </div>
  );
} 