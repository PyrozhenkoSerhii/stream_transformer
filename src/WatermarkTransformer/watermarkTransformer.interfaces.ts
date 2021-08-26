export interface StreamDimensions {
  originalWidth: number;
  originalHeight: number;
  targetSize: number;
  extraWidth: number;
  extraHeight: number;
}

export interface ExtendedCanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}
