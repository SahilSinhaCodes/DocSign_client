import { useEffect, useState, useContext } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { AuthContext } from '../context/AuthContext';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function Documents() {
  const { token } = useContext(AuthContext);
  const [docs, setDocs] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    const res = await fetch('http://localhost:5000/api/docs/my-docs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setDocs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, [token]);

  const handleDelete = async (docId) => {
    const confirm = window.confirm("Are you sure you want to delete this document?");
    if (!confirm) return;

    await fetch(`http://localhost:5000/api/docs/${docId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setDocs((prev) => prev.filter((doc) => doc._id !== docId));
    if (previewUrl?.includes(docId)) setPreviewUrl(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Documents</h2>

      {loading ? (
        <p>Loading documents...</p>
      ) : docs.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <div className="divide-y border rounded-md overflow-hidden">
          {docs.map((doc) => (
            <div key={doc._id} className="flex justify-between items-center p-4 hover:bg-gray-50">
              <div onClick={() => setPreviewUrl(`http://localhost:5000/${doc.path}`)} className="cursor-pointer">
                <p className="font-semibold">{doc.originalName}</p>
                <p className="text-sm text-gray-500">{new Date(doc.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDelete(doc._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {previewUrl && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">PDF Preview</h3>
          <div className="border p-4">
            <Document file={previewUrl}>
              <Page pageNumber={1} />
            </Document>
            <button
              onClick={() => setPreviewUrl(null)}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
