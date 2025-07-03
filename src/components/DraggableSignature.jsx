//import { useDraggable } from '@dnd-kit/core';
//import { ResizableBox } from 'react-resizable';
//import 'react-resizable/css/styles.css';
//
//export default function DraggableSignature({
//  imageUrl,
//  x,
//  y,
//  containerRef,
//  pageSize,
//  setDragPos,
//  signatureSize,
//  setSignatureSize,
//}) {
//  const { attributes, listeners, setNodeRef, transform } = useDraggable({
//    id: 'signature',
//  });
//
//  const style = {
//    top: `${y * pageSize.height}px`,
//    left: `${x * pageSize.width}px`,
//    transform: transform
//      ? `translate(${transform.x}px, ${transform.y}px)`
//      : '',
//  };
//
//  return (
//    <div
//      id="signature-box"
//      ref={setNodeRef}
//      {...attributes}
//      {...listeners}
//      className="absolute z-50"
//      style={style}
//    >
//      <ResizableBox
//        width={signatureSize.width}
//        height={signatureSize.height}
//        minConstraints={[50, 30]}
//        maxConstraints={[300, 200]}
//        resizeHandles={['se']}
//        onResizeStop={(e, data) => {
//          setSignatureSize({
//            width: data.size.width,
//            height: data.size.height,
//          });
//        }}
//      >
//        <img
//          src={imageUrl}
//          alt="signature"
//          draggable={false}
//          style={{
//            width: '100%',
//            height: '100%',
//            pointerEvents: 'none',
//          }}
//        />
//      </ResizableBox>
//    </div>
//  );
//}
