import { useContext, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { AuthContext } from '../context/AuthContext';
import SignaturePad from '../components/SignaturePad';
import { PDFDocument, rgb } from 'pdf-lib';
import ResizableSignature from '../components/ResizableSignature'; // at the top


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function Sign() {
  const { token } = useContext(AuthContext);
  const [pdfFile, setPdfFile] = useState(null);
  const [serverPath, setServerPath] = useState(null);
  const [fileId, setFileId] = useState(null);

  const [signatureUrl, setSignatureUrl] = useState(null);
  const [dragPos, setDragPos] = useState(null);
  const [signatureSize, setSignatureSize] = useState({ width: 150, height: 75 });

  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setPdfFile(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:5000/api/docs/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    setServerPath(`http://localhost:5000/${data.doc.path}`);
    setFileId(data.doc._id);
  };

  const handleSignatureSelect = (url) => {
    setSignatureUrl(url);
    setDragPos(null);
    setShowSignaturePad(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top + container.scrollTop) / rect.height;

    console.log('[DROP] client:', e.clientX, e.clientY);
    console.log('[DROP] rect:', rect);
    console.log('[DROP] normalized:', x, y);

    setDragPos({ x, y });
    setIsDragging(false);
  };



  const handleSave = async () => {
    await fetch('http://localhost:5000/api/signatures/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileId,
        x: dragPos.x,
        y: dragPos.y,
        page: 1,
      }),
    });
    alert('Signature position saved');
  };

  const handleApply = async () => {
  if (!serverPath || !signatureUrl || !dragPos || !pageSize) return;

  // 1. Fetch the PDF file
  const pdfBytes = await fetch(serverPath).then(res => res.arrayBuffer());

  // 2. Load PDF document
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // 3. Embed signature image
  const signatureImageBytes = await fetch(signatureUrl).then(res => res.arrayBuffer());
  const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

  const page = pdfDoc.getPages()[0];

  // 4. Calculate signature position in PDF units
  const { width, height } = page.getSize();
  const imageWidth = 150;
  const scale = imageWidth / signatureImage.width;
  const imageHeight = signatureImage.height * scale;

  const x = dragPos.x * width;
  const y = dragPos.y * height;
  const drawY = height - y - signatureSize.height;

  page.drawImage(signatureImage, {
    x,
    y: drawY,
    width: signatureSize.width,
    height: signatureSize.height,
  });

  // 5. Download the signed PDF
  const modifiedPdfBytes = await pdfDoc.save();
  const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'signed-document.pdf';
  a.click();
  URL.revokeObjectURL(url);
};


  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Sign a Document</h2>

      <input type="file" accept="application/pdf" onChange={handleUpload} />

      {showSignaturePad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <SignaturePad onSelect={handleSignatureSelect} />
            <button
              onClick={() => setShowSignaturePad(false)}
              className="mt-4 bg-red-600 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {serverPath && (
        <div className="flex flex-col items-start gap-4">
          <button
            onClick={() => setShowSignaturePad(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Add Signature
          </button>

          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* PDF Container */}
            <div
              ref={containerRef}
              className="relative border overflow-auto max-h-[80vh] w-full max-w-3xl"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Document file={serverPath}>
                <Page
                  pageNumber={1}
                  onRenderSuccess={({ width, height }) =>
                    setPageSize({ width, height })
                  }
                />
              </Document>

              {dragPos && signatureUrl && (
  <ResizableSignature
    imageUrl={signatureUrl}
    x={dragPos.x}
    y={dragPos.y}
    width={signatureSize.width}
    height={signatureSize.height}
    pageSize={pageSize}
    onDrag={(pos) => setDragPos(pos)}
    onResize={(size) => setSignatureSize(size)}
  />
)}



            </div>

            {/* Signature Panel */}
            {signatureUrl && !dragPos && (
              <div className="w-48 h-48 border rounded flex items-center justify-center">
                <img
                  src={signatureUrl}
                  alt="signature"
                  draggable
                  onDragStart={() => setIsDragging(true)}
                  className="cursor-move border-2 border-blue-500"
                  style={{ width: '150px' }}
                />
              </div>
            )}
          </div>

          {/* Save & Apply Buttons */}
          {dragPos && (
            <div className="space-x-4 mt-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Position
              </button>
              <button
                onClick={handleApply}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Apply & Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}