import { Buffer } from 'buffer';

export function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.byteLength; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}
