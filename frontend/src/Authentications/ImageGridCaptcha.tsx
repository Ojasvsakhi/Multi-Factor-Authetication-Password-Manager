import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const imageList = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];

const ImageGridCaptcha = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [gridMatrix, setGridMatrix] = useState<number[][]>(
    Array.from({ length: 6 }, () => Array(6).fill(0))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const email = location.state?.email || "";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gridMatrix, setGridMatrix] = useState(
    Array.from({ length: 6 }, () => Array(6).fill(0))
  );
  useEffect(() => {
    const fetchSavedPattern = async () => {
      console.log("Email",email);
      console.log("Username",username);
      console.log("Masterkey",masterkey);
      if (is_registration && (!email || !username || !masterkey)) return;
      if (!is_registration && email) {
        try {
          const response = await authApi.getSavedPattern(email);
          if (response.data.imageIndex !== undefined) {
            setSelectedImageIndex(response.data.imageIndex);
            setSelectedImage(imageList[response.data.imageIndex]);
          }
        } catch (error) {
          setError("Failed to load your pattern image");
        }
      }
    };

    fetchSavedPattern();
  }, [is_registration, email]);
  useEffect(() => {
    if (!message) {
      console.log("message is null");
      navigate("/", { replace: true });
    }
  }, [message, navigate]);
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

    // Set canvas size based on viewport
    const size = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    // Draw image and grid
    ctx.drawImage(img, 0, 0, size, size);
    const cellSize = size / 6;

    // Draw grid lines
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

    // Fill selected cells
    ctx.fillStyle = "rgba(0, 100, 255, 0.3)";
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (gridMatrix[row][col] === 1) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [img, gridMatrix]);

  const handleImageSelect = (imgName: string) => {
    setSelectedImage(imgName);
    setGridMatrix(Array.from({ length: 6 }, () => Array(6).fill(0)));
    setError("");
    setSuccess("");
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
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

    if (row >= 0 && row < 6 && col >= 0 && col < 6) {
      setGridMatrix(prev => {
        const newMatrix = prev.map(row => [...row]);
        newMatrix[row][col] = newMatrix[row][col] === 1 ? 0 : 1;
        return newMatrix;
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authApi.verifyMatrix({
        matrix: gridMatrix,
        imageIndex: selectedImageIndex,
        is_registration,
        is_authenticated,
      });

      const data: CaptchaResponse = await response.json();

      if (data.success) {
        setSuccess("Verification successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError("Verification failed. Please try again.");
        setGridMatrix(Array.from({ length: 6 }, () => Array(6).fill(0)));
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check if at least one cell is selected
  const hasSelection = gridMatrix.flat().some((cell) => cell === 1);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Image Verification
        </h1>

        {!selectedImage ? (
          <div className="space-y-4">
            <p className="text-center text-gray-300 mb-8">
              Select an image to begin verification
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {imageList.map((imgName) => (
                <img
                  key={imgName}
                  src={`/assets/${imgName}`}
                  alt={imgName}
                  onClick={() => handleImageSelect(imgName)}
                  className="w-full h-56 object-cover border-4 rounded-md cursor-pointer transition-all duration-300 border-gray-600 hover:border-blue-500 hover:scale-105"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-7xl">
              <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg">
                <p className="text-white text-lg mb-4">
                  Click on the cells to create your pattern
                </p>

                <div className="flex justify-center items-center w-full mb-4">
                  <div className="w-full max-w-[90vmin] aspect-square">
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="w-full h-full border border-gray-600 rounded-md cursor-pointer"
                    />
                  </div>
                </div>

                {error && (
                  <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500 rounded">
                    <p className="text-red-400 text-center">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="w-full mb-4 p-3 bg-green-500/20 border border-green-500 rounded">
                    <p className="text-green-400 text-center">{success}</p>
                  </div>
                )}

                {/* Sliding Submit Button */}
                <div 
                  className={`fixed bottom-0 left-0 right-0 transform transition-all duration-300 ease-in-out
                    ${hasSelection ? 'translate-y-0' : 'translate-y-full'}`}
                >
                  <div className="bg-gray-800/95 border-t border-gray-700 p-4 flex justify-center gap-4 backdrop-blur-sm">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all duration-300"
                      disabled={loading}
                    >
                      Back
                    </button>

                    <button
                      onClick={handleSubmit}
                      className={`px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300
                        ${loading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-500 hover:scale-105"}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Verifying...
                        </div>
                      ) : (
                        "Submit Pattern"
                      )}
                    </button>
                  </div>
                </div>

                {/* Matrix Display (optional) */}
                <div className="mt-4 w-full mb-20"> {/* Added margin bottom to avoid overlap with sliding button */}
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