import { useState } from 'react';
import { uploadFile } from '@/lib/back4appFiles';

export default function Back4AppFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const uploadedUrl = await uploadFile(file);
    setUrl(uploadedUrl);
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>
      {url && <a href={url} target="_blank" rel="noopener noreferrer">View Uploaded File</a>}
    </div>
  );
} 