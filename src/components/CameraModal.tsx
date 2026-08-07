import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, RefreshCw, Check, Upload, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  title?: string;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Tomar Fotografía'
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setError(null);
      return;
    }

    startCamera(facingMode);

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera();
    setError(null);
    setLoading(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setError('No se pudo acceder a la cámara del dispositivo. Puedes subir una imagen desde tus archivos.');
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Flip horizontally if front camera for mirror feel
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCapturedImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Camera className="w-5 h-5 text-blue-500" />
            <span>{title}</span>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img src={capturedImage} alt="Foto capturada" className="w-full h-full object-cover" />
          ) : error ? (
            <div className="p-6 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              {loading && (
                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-white text-xs font-bold gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                  <span>Iniciando cámara...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-4">
          {capturedImage ? (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tomar otra foto</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Usar esta foto</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              {/* File upload input */}
              <label className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Desde archivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Shutter button */}
              <button
                type="button"
                onClick={takePhoto}
                disabled={loading || !!error}
                className="w-14 h-14 rounded-full bg-white hover:bg-slate-100 text-slate-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 disabled:opacity-50 mx-auto"
                title="Capturar Foto"
              >
                <div className="w-11 h-11 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600" />
                </div>
              </button>

              {/* Toggle front/rear camera */}
              <button
                type="button"
                onClick={toggleCamera}
                disabled={loading || !!error}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                title="Cambiar cámara"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Girar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
