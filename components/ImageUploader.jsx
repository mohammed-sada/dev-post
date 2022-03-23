import { useState } from 'react';
import toast from 'react-hot-toast';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(pct);
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => ref.getDownloadURL())
      .then((url) => {
        setDownloadURL(url);
        setUploading(false);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`![alt](${downloadURL})`);
    toast.success('Coppied to clipboard');
  };
  return (
    <div className='mb-4'>
      {uploading && (
        <div className='flex justify-between items-center'>
          <Loader />
          <h3 className='text-xl font-bold'>{progress}%</h3>
        </div>
      )}

      {!uploading && (
        <>
          <label className='px-6 py-3 bg-black text-white cursor-pointer'>
            📸 Upload Img
            <input
              type='file'
              onChange={uploadFile}
              accept='image/x-png,image/gif,image/jpeg'
              className='w-0 h-0'
            />
          </label>
        </>
      )}

      {downloadURL && (
        <>
          <code className='overflow-x-auto p-2 text-sm bg-white block mt-4'>{`![alt](${downloadURL})`}</code>
          <button
            className='btn bg-gray-800 text-sm mt-2'
            onClick={copyToClipboard}
            type='button'
          >
            Copy to clipboard
          </button>
        </>
      )}
    </div>
  );
}
