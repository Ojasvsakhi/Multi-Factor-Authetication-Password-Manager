import React, { useRef, useState, useEffect } from "react";

const imageList = ["dog1.png", "dog2.png", "dog3.png", "dog4.png", "dog5.png", "dog6.png"];

const ImageGridCaptcha = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gridMatrix, setGridMatrix] = useState<number[][]>(
    Array(6).fill(null).map(() => Array(6).fill(0))
  );
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = (imgName: string) => {
    const newImg = new Image();
    newImg.src = `/assets/${imgName}`;
    newImg.onload = () => {
      setImg(newImg);
      setSelectedImage(imgName);
      setGridMatrix(Array(6).fill(null).map(() => Array(6).fill(0)));
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const cellWidth = canvasRef.current.width / 6;
    const cellHeight = canvasRef.current.height / 6;

    const row = Math.floor(y / cellHeight);
    const col = Math.floor(x / cellWidth);

    const updated = gridMatrix.map((r, i) =>
      r.map((val, j) => (i === row && j === col ? (val === 0 ? 1 : 0) : val))
    );

    setGridMatrix(updated);
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    try {
      const res = await fetch("http://localhost:5000/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
          matrix: gridMatrix,
        }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to verify CAPTCHA");
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !img) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 360;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    ctx.drawImage(img, 0, 0, size, size);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 60, 0);
      ctx.lineTo(i * 60, 360);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * 60);
      ctx.lineTo(360, i * 60);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (gridMatrix[i][j] === 1) {
          ctx.fillRect(j * 60, i * 60, 60, 60);
        }
      }
    }
  }, [img, gridMatrix]);

  return (
    <div className="text-white min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Select an Image for CAPTCHA</h1>

      <div className="grid grid-cols-3 gap-4">
        {imageList.map((imgName) => (
          <img
            key={imgName}
            src={`/assets/${imgName}`}
            alt={imgName}
            onClick={() => handleImageSelect(imgName)}
            className={`w-32 h-32 object-cover border-2 rounded-md cursor-pointer transition-transform ${
              selectedImage === imgName ? "border-yellow-400 scale-105" : "border-gray-400"
            }`}
          />
        ))}
      </div>

      {selectedImage && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <h2 className="text-lg font-semibold">Click cells in the 6x6 grid</h2>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="cursor-pointer border-2 border-white"
            style={{ width: "360px", height: "360px" }}
          />
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300 transition"
          >
            Submit CAPTCHA
          </button>

          <div className="text-sm">
            <p className="text-center font-medium mt-4">Selected Matrix (6x6):</p>
            <pre className="bg-gray-900 p-3 rounded max-w-full overflow-x-auto text-xs">
              {JSON.stringify(gridMatrix, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGridCaptcha;
