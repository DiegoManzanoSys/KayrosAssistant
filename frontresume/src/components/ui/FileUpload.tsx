import React from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  acceptedFormats?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  acceptedFormats = '.pdf,.docx',
  maxSizeMB = 10,
  disabled = false,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Seleccionar archivo ({acceptedFormats})
      </label>
      <input
        type="file"
        accept={acceptedFormats}
        disabled={disabled}
        onChange={handleChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />
      <p className="mt-1 text-xs text-gray-500">
        Tamaño máximo: {maxSizeMB} MB
      </p>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
