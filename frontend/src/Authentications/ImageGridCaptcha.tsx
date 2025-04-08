import React, { useRef, useState, useEffect } from "react";

const imageList = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];

const ImageGridCaptcha = () => {
  const canvasRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [img, setImg] = useState(null);
  const [gridMatrix, setGridMatrix] = useState(
    Array.from({ length: 6 }, () => Array(6).fill(0))
  );

  useEffect(() => {
    if (!selectedImage) return;

    const image = new Image();
    image.src = `/assets/${selectedImage}`;
    image.onload = () => setImg(image);
  }, [selectedImage]);

  useEffect(() => {
    if (!canvasRef.current || !img) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.offsetWidth;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    ctx.drawImage(img, 0, 0, size, size);

    const cellSize = size / 6;

    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;

    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(0, 100, 255, 0.5)";
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (gridMatrix[row][col] === 1) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [img, gridMatrix]);

  const handleImageSelect = (imgName) => {
    setSelectedImage(imgName);
    setGridMatrix(Array.from({ length: 6 }, () => Array(6).fill(0)));
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const adjustedX = x * scaleX;
    const adjustedY = y * scaleY;

    const cellSize = canvas.width / 6;
    const col = Math.floor(adjustedX / cellSize);
    const row = Math.floor(adjustedY / cellSize);

    setGridMatrix((prev) => {
      const newMatrix = prev.map((row) => [...row]);
      newMatrix[row][col] = newMatrix[row][col] === 1 ? 0 : 1;
      return newMatrix;
    });
  };

  const handleSubmit = () => {
    console.log("Selected Cells:", gridMatrix);
    alert("Submitted! Check console for output.");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Select Image
        </h1>

        {!selectedImage ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {imageList.map((imgName) => (
              <img
                key={imgName}
                src={`/assets/${imgName}`}
                alt={imgName}
                onClick={() => handleImageSelect(imgName)}
                className="w-full h-56 object-cover border-4 rounded-md cursor-pointer transition-all duration-300 border-gray-600 hover:border-blue-500"
              />
            ))}
          </div>
        ) : (
          <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-7xl">
              <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg">
                <p className="text-white text-lg mb-4">Click cells to select</p>

                {/* Responsive Canvas Container */}
                <div className="flex justify-center items-center w-full mb-4">
                  <div className="w-full max-w-[90vmin] aspect-square">
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="w-full h-full border border-gray-600 rounded-md cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded hover:bg-gray-500 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-500 transition"
                  >
                    Submit
                  </button>
                </div>

                <div className="mt-4 w-full">
                  <pre className="bg-gray-700 p-2 rounded text-xs text-white overflow-x-auto max-h-24">
                    {JSON.stringify(gridMatrix, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGridCaptcha;
