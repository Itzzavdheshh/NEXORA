import { useState, useRef, useEffect } from "react";
import { Edit2, X, Check, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";

export function AvatarSelector({ avatarUrl, onChange, initials }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 });

  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const cropBoxRef = useRef(null);

  // Trigger file input click
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // Remove avatar image
  const handleRemoveClick = () => {
    onChange("");
    toast.success("Profile photo removed.");
  };

  // File change handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result);
      setScale(1.0);
      setOffset({ x: 0, y: 0 });
      setImgNaturalSize({ width: 0, height: 0 });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    
    // Clear input so same file can be re-uploaded if cancelled
    e.target.value = "";
  };

  // Drag handlers for cropping box
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle image load to grab actual aspect ratio dimensions
  const handleImageLoad = (e) => {
    const img = e.target;
    setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  // Calculate base screen dimensions where image completely covers the 240x240 crop container (object-cover equivalent)
  const getDisplaySize = () => {
    const nw = imgNaturalSize.width || 240;
    const nh = imgNaturalSize.height || 240;
    const containerSize = 240;
    const isLandscape = nw / nh > 1;

    if (isLandscape) {
      // Landscape: height fits to 240, width overflows
      const displayWidth = containerSize * (nw / nh);
      return { width: displayWidth, height: containerSize };
    } else {
      // Portrait/Square: width fits to 240, height overflows
      const displayHeight = containerSize * (nh / nw);
      return { width: containerSize, height: displayHeight };
    }
  };

  const displaySize = getDisplaySize();

  // Generate cropped image using HTML5 Canvas
  const handleCropApply = () => {
    if (!imgRef.current || imgNaturalSize.width === 0) return;

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = 150;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Viewport dimensions (the crop circle now occupies the full 240x240 container to show full image on screen)
    const containerSize = 240;
    const canvasScale = 150 / containerSize; // 0.625

    // Center coordinates relative to canvas
    const centerX = (containerSize / 2 + offset.x) * canvasScale;
    const centerY = (containerSize / 2 + offset.y) * canvasScale;

    const drawnW = displaySize.width * scale * canvasScale;
    const drawnH = displaySize.height * scale * canvasScale;

    const targetX = centerX - drawnW / 2;
    const targetY = centerY - drawnH / 2;

    try {
      ctx.drawImage(img, targetX, targetY, drawnW, drawnH);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      onChange(dataUrl);
      setCropModalOpen(false);
      setSelectedImage(null);
      toast.success("Profile photo updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to crop image.");
    }
  };

  // Attach non-passive wheel listener for smooth zooming inside crop container
  useEffect(() => {
    const box = cropBoxRef.current;
    if (!box) return;

    const preventDefaultWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = 0.05;
      setScale((prev) => Math.min(Math.max(prev - e.deltaY * zoomSpeed * 0.01, 1), 3));
    };

    box.addEventListener("wheel", preventDefaultWheel, { passive: false });
    return () => {
      box.removeEventListener("wheel", preventDefaultWheel);
    };
  }, [cropModalOpen]);

  return (
    <div className="relative inline-block">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Profile Photo Display */}
      <div className="group relative h-24 w-24 overflow-hidden rounded-full border border-border-subtle bg-bg-elevated shadow-token-md transition duration-200">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent-primary/10 text-3xl font-extrabold text-accent-primary">
            {initials || "U"}
          </div>
        )}
      </div>

      {/* Upload/Edit Buttons Overlay (Exactly matching the edit-left, remove-right mockup layout) */}
      <button
        type="button"
        onClick={handleEditClick}
        className="absolute bottom-0 left-0 translate-x-[-10%] translate-y-[10%] flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-bg-base hover:bg-white hover:scale-105 active:scale-95 transition shadow-token-md border border-border-subtle cursor-pointer z-10"
        title="Change profile photo"
      >
        <Edit2 className="h-4 w-4 text-bg-base" />
      </button>

      {avatarUrl && (
        <button
          type="button"
          onClick={handleRemoveClick}
          className="absolute bottom-0 right-0 translate-x-[10%] translate-y-[10%] flex h-8 w-8 items-center justify-center rounded-full bg-accent-danger text-text-primary hover:scale-105 active:scale-95 transition shadow-token-md border border-border-subtle cursor-pointer z-10"
          title="Remove photo"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      )}

      {/* Interactive Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/70 p-4 backdrop-blur-sm">
          <div 
            className="w-full max-w-md rounded-3xl border border-border-subtle p-6 shadow-token-lg space-y-6"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-1.5">
                <Eye className="h-4.5 w-4.5 text-accent-primary" />
                Crop Profile Image
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setSelectedImage(null);
                }}
                className="text-text-tertiary hover:text-text-primary transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cropping box area (Fixed 240x240 centered square to align screen/canvas coordinate systems) */}
            <div 
              ref={cropBoxRef}
              className="relative h-[240px] w-[240px] mx-auto overflow-hidden rounded-2xl border border-border-subtle bg-bg-base/50 flex items-center justify-center cursor-move"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Image preview with drag/scale properties fitted inside container */}
              {selectedImage && (
                <img
                  ref={imgRef}
                  src={selectedImage}
                  alt=""
                  onLoad={handleImageLoad}
                  className="pointer-events-none select-none max-h-none max-w-none origin-center transition-transform duration-75"
                  style={{
                    width: `${displaySize.width}px`,
                    height: `${displaySize.height}px`,
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  }}
                />
              )}

              {/* Circular crop mask overlay (Spans full 240px to touch all four square boundaries) */}
              <div 
                className="absolute h-[240px] w-[240px] rounded-full border-2 border-dashed border-accent-primary ring-[999px] ring-bg-base/60 pointer-events-none"
              />
            </div>

            {/* Controls & sliders */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Zoom</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="flex-1 accent-accent-primary h-1 bg-border-subtle rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-semibold text-text-secondary min-w-[32px] text-right">
                  {Math.round(scale * 100)}%
                </span>
              </div>

              <div className="text-[10px] text-text-tertiary italic text-center">
                Drag the image above or scroll with your mouse wheel to adjust.
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setCropModalOpen(false);
                  setSelectedImage(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCropApply}>
                <Check className="h-4 w-4 mr-1.5" />
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
