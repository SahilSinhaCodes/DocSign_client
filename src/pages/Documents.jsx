import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Documents() {
  const { token } = useContext(AuthContext);
  const [docs, setDocs] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      const res = await fetch('http://localhost:5000/api/docs/my-docs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDocs(data);
    };

    fetchDocs();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Documents</h2>

      {docs.length === 0 && <p>No documents uploaded yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc) => (
          <div
            key={doc._id}
            className="border rounded p-4 shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => setPreviewUrl(`http://localhost:5000/${doc.path}`)}
          >
            <p className="font-semibold">{doc.originalName}</p>
            <p className="text-sm text-gray-500">{new Date(doc.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {previewUrl && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">PDF Preview</h3>
          <div className="border p-4">
            <Document file={previewUrl}>
              <Page pageNumber={1} />
            </Document>
            <button
              onClick={() => setPreviewUrl(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
