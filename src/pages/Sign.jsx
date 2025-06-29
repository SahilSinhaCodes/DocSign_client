import { useContext, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { AuthContext } from '../context/AuthContext';

//// WORKING WORKER CONFIGURATION FOR VITE + REACT 19
//const workerSrc = new URL(
//  'pdfjs-dist/build/pdf.worker.min.js',
//  import.meta.url
//).href;
//
//pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// ALTERNATIVE FALLBACK (uncomment if above doesn't work)
 pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function Sign() {
  const { token } = useContext(AuthContext);
  const [pdfFile, setPdfFile] = useState(null); // blob for preview
  const [serverPath, setServerPath] = useState(null); // backend file path
  const [fileId, setFileId] = useState(null);
  const [dragPos, setDragPos] = useState(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setPdfFile(URL.createObjectURL(file)); // for preview

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:5000/api/docs/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    setServerPath(`http://localhost:5000/${data.doc.path}`);
    setFileId(data.doc._id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setDragPos({ x, y });
  };

  const handleSave = async () => {
    const res = await fetch('http://localhost:5000/api/signatures/save', {
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

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sign a Document</h2>

      {/* Upload section */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="mb-4"
      />

      {/* PDF preview & editor */}
      {serverPath && (
        <>
          <div
            ref={containerRef}
            className="relative border w-fit"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Document file={serverPath}>
              <Page
                pageNumber={1}
                onRenderSuccess={({ width, height }) => setPageSize({ width, height })}
              />
            </Document>

            {dragPos && (
              <div
                className="absolute bg-blue-600 text-white px-3 py-1 rounded"
                style={{
                  top: `${dragPos.y * pageSize.height}px`,
                  left: `${dragPos.x * pageSize.width}px`,
                }}
              >
                Sign Here
              </div>
            )}
          </div>

          {/* Drag & Save UI */}
          <div className="mt-6">
            <div
              draggable
              className="inline-block bg-green-600 text-white px-4 py-2 rounded cursor-move"
            >
              Drag Signature
            </div>

            {dragPos && (
              <button
                onClick={handleSave}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Signature
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
