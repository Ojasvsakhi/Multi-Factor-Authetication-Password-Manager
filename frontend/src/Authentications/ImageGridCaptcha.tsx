import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../services/api";
const imageList = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];

const ImageGridCaptcha = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const location = useLocation(); 
  const is_registration = location.state?.is_registration || false;
  const is_authenticated = location.state?.isAuthenticated || false;
  const username = location.state?.username || "";
  const masterkey = location.state?.masterkey || "";
  const message = location.state?.message || null;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleImageSelect = (imgName: string, index: number) => {
    setSelectedImage(imgName);
    setSelectedImageIndex(index);
    setGridMatrix(Array.from({ length: 6 }, () => Array(6).fill(0)));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
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
      const newMatrix = prev.map((r) => [...r]);
      newMatrix[row][col] = newMatrix[row][col] === 1 ? 0 : 1;
      return newMatrix;
    });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await authApi.verifyMatrix({
        matrix: gridMatrix,
        imageIndex: selectedImageIndex,
        is_registration,
        is_authenticated,
      });

      if (response.data.status === "success") {
        setSuccess(
          is_registration
            ? "Pattern created successfully!"
            : "Pattern verified successfully!"
        );
        setTimeout(() => {
          navigate("/dashboard", {
            state: {
              is_registration: is_registration,
              is_authenticated: is_authenticated,
              email: email,
              username: username,
              masterkey: masterkey,
              message: response.data.message,
            },
          });
        }, 2000);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to verify matrix pattern"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-y-auto"> {/* Added overflow-y-auto */}
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {is_registration ? "Create Pattern" : "Verify Pattern"}
        </h1>
  
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
  
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded">
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}
  
        <div className="flex flex-col items-center justify-center">
          {!selectedImage ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 w-full">
              {imageList.map((imgName, index) => (
                <img
                  key={imgName}
                  src={`/assets/${imgName}`}
                  alt={imgName}
                  onClick={() => handleImageSelect(imgName, index)}
                  className="w-full h-56 object-cover border-4 rounded-md cursor-pointer transition-all duration-300 border-gray-600 hover:border-blue-500"
                />
              ))}
            </div>
          ) : (
            <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-6 shadow-lg mb-6"> {/* Added mb-6 */}
              <p className="text-white text-lg mb-4 text-center">
                {is_registration 
                  ? "Create your pattern by clicking cells" 
                  : "Enter your pattern to verify"}
              </p>
  
              <div className="flex justify-center items-center w-full mb-6">
                <div className="w-full max-w-[70vh] aspect-square"> {/* Changed from 90vmin to 70vh */}
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className={`w-full h-full border border-gray-600 rounded-md cursor-pointer ${
                      loading ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  />
                </div>
              </div>
  
              <div className="sticky bottom-4 flex justify-center gap-4 mt-6"> {/* Added sticky positioning */}
                <button
                  onClick={() => setSelectedImage(null)}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-600 text-white text-sm font-semibold rounded hover:bg-gray-500 transition disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-500 transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg 
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : "Submit Pattern"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGridCaptcha;
