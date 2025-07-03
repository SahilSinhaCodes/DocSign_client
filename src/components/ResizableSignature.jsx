import { useRef, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

export default function ResizableSignature({ imageUrl, x, y, width, height, pageSize, onDrag, onResize }) {
  const boxRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (e) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const newX = (x * pageSize.width + dx) / pageSize.width;
      const newY = (y * pageSize.height + dy) / pageSize.height;
      onDrag({ x: newX, y: newY });
    };

    const stopDrag = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stopDrag);
  };

  return (
    <div
      ref={boxRef}
      className="absolute z-50"
      style={{
        top: `${y * pageSize.height}px`,
        left: `${x * pageSize.width}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={startDrag}
    >
      <ResizableBox
        width={width}
        height={height}
        minConstraints={[50, 30]}
        maxConstraints={[300, 200]}
        resizeHandles={['se']}
        onResizeStop={(e, data) => {
          onResize({ width: data.size.width, height: data.size.height });
        }}
      >
        <img
          src={imageUrl}
          alt="signature"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </ResizableBox>
    </div>
  );
}
