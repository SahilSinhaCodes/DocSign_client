import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import trimCanvas from 'trim-canvas';

export default function SignaturePad({ onSelect }) {
  const sigPadRef = useRef(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [drawnUrl, setDrawnUrl] = useState(null);

  const clear = () => {
    sigPadRef.current?.clear();
    setDrawnUrl(null);
  };

  const save = () => {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) return;

    // Fix: manually trim using trimCanvas
    const rawCanvas = sigPadRef.current.getCanvas();
    const trimmedCanvas = trimCanvas(rawCanvas);
    const url = trimmedCanvas.toDataURL('image/png');

    setDrawnUrl(url);
    setUploadUrl(null); // clear uploaded image if drawing is used
    onSelect(url);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUploadUrl(url);
    setDrawnUrl(null); // clear drawn signature
    onSelect(url);
  };

  useEffect(() => {
    return () => {
      if (uploadUrl) URL.revokeObjectURL(uploadUrl);
    };
  }, [uploadUrl]);

  return (
    <div className="space-y-4 border p-4 rounded shadow-md w-fit bg-white">
      <h3 className="text-lg font-bold">Add Signature</h3>

      {/* Signature Drawing Area */}
      <div className="border w-[300px] h-[150px] bg-gray-50">
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 300, height: 150, className: 'sigCanvas' }}
          ref={sigPadRef}
        />
      </div>

      <div className="space-x-2">
        <button onClick={save} className="bg-blue-600 text-white px-3 py-1 rounded">
          Use Drawing
        </button>
        <button onClick={clear} className="bg-gray-500 text-white px-3 py-1 rounded">
          Clear
        </button>
      </div>

      <div className="pt-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="block text-sm text-gray-700"
        />
        <p className="text-xs text-gray-500 mt-1">Or upload signature image</p>
      </div>

      {/* Preview */}
      {(drawnUrl || uploadUrl) && (
        <div>
          <p className="font-semibold pt-2">Preview:</p>
          <img
            src={drawnUrl || uploadUrl}
            alt="signature"
            className="w-48 border bg-white"
          />
        </div>
      )}
    </div>
  );
}
