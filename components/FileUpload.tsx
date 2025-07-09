import nhost from '@/lib/nhost';
import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const { fileMetadata } = await nhost.storage.upload({ file });
    setUrl(fileMetadata?.url || null);
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>
      {url && <a href={url} target="_blank" rel="noopener noreferrer">View Uploaded File</a>}
    </div>
  );
} 