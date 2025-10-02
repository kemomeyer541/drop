import React from 'react';

interface ImageBlockProps {
  src: string;
  alt?: string;
  pixelated?: boolean;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ src, alt, pixelated }) => {
  return (
    <div
      className="relative w-full aspect-square overflow-hidden"
      style={{ backgroundColor: '#0a0f1a' }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          imageRendering: pixelated ? 'pixelated' : 'auto',
        }}
      />
    </div>
  );
};
