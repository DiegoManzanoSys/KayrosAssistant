import React from 'react';

interface FileUploadProps {
  accept?: string;
  onChange: (file: File | null) => void;
  label?: string;
  error?: string;
  maxSize?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  onChange,
  label = 'Seleccionar archivo',
  error,
  maxSize = 10,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="block w-full text-sm text-gray-500 
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          cursor-pointer"
      />
      <p className="mt-1 text-xs text-gray-500">
        Tamaño máximo: {maxSize} MB
      </p>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
