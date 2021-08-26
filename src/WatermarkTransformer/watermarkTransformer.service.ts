import WatermarkImage from "../assets/logo.png";
import { ExtendedCanvasElement, StreamDimensions } from "./watermarkTransformer.interfaces";

const FPS = 60;

const DRAW_INTERVAL = 1000 / FPS;

const WATERMARK_OPACITY = 0.2;

class WatermarkTranformerService {
  /**
   * Receives all html elements references.
   * Initializes Watermark, MediaStream, Target dimensions.
   * Starts streaming from original player to canvas.
   * Starts streaming from canvas to destination player.
   * @param originalPlayer original html player
   * @param destinationPlayer target html player (after edits)
   * @param canvas html canvas for intermediate crops and edits
   */
  public initialize = async (
    originalPlayer: HTMLVideoElement,
    destinationPlayer: HTMLVideoElement,
    canvas: ExtendedCanvasElement,
  ): Promise<void> => {
    const watermark = await this.initializeWatermark();
    const mediaStream = await this.initializeMediaToPlayer(originalPlayer);
    const dimensions = this.initializeDimensions(mediaStream);

    this.streamToCanvas(canvas, originalPlayer, dimensions, watermark);
    this.canvasToPlayer(canvas, destinationPlayer, mediaStream);
  }

  /**
   * Initializes watermark image from imported image.
   */
  private initializeWatermark = (): Promise<HTMLImageElement> => {
    const image = new Image();
    image.src = WatermarkImage;

    return new Promise((resolve) => {
      image.onload = () => {
        resolve(image);
      };
    });
  }

  /**
   * Initializes MediaStream and plays it in provided html player.
   * @param player player to play MediaStream in
   * @returns newly created MediaSteram
   */
  private initializeMediaToPlayer = async (player: HTMLVideoElement): Promise<MediaStream> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    player.srcObject = stream;
    player.play();

    return stream;
  }

  /**
   * Initializes sizes for future cropping from video track sizes.
   * TargetSize is selected as a smallest value between width and height making canvas a square.
   * ExtraWidth and ExtraHeight are used to crop an excessive parts of a video stream.
   * @param stream stream to calculated size from
   * @returns calculated StreamDimensions
   */
  private initializeDimensions = (stream: MediaStream): StreamDimensions => {
    const streamWidth = stream.getVideoTracks()[0].getSettings().width;
    const streamHeight = stream.getVideoTracks()[0].getSettings().height;

    const extraWidth = (streamWidth - streamHeight) >= 0 ? (streamWidth - streamHeight) : 0;
    const extraHeight = (streamHeight - streamWidth) >= 0 ? (streamHeight - streamWidth) : 0;

    const targetSize = extraWidth ? streamHeight : streamHeight;

    return {
      originalWidth: streamWidth,
      originalHeight: streamHeight,
      extraHeight,
      extraWidth,
      targetSize,
    };
  }

  /**
   * Sets canvas dimensions to provided values.
   * With set interval 1) draws current image form player to the canvas
   * 2) draws watermark with set opacity above the whole canvas
   * @param canvas html canvas to draw on
   * @param player html player to draw from
   * @param streamDimensions target canvas dimensions as well as original stream data
   * @param watermark watermark image to draw aboce canvas
   */
  private streamToCanvas = (
    canvas: ExtendedCanvasElement,
    player: HTMLVideoElement,
    streamDimensions: StreamDimensions,
    watermark: HTMLImageElement,
    interval: number = DRAW_INTERVAL,
    watermarkOpacity: number = WATERMARK_OPACITY,
  ): void => {
    canvas.width = streamDimensions.targetSize;
    canvas.height = streamDimensions.targetSize;

    setInterval(() => {
      this.drawStreamFrameToCanvas(canvas, player, streamDimensions);
      this.drawWatermark(watermark, canvas, watermarkOpacity);
    }, interval);
  }

  /**
   * Draws a current frame from the player to the canvas.
   * Crops players frame by using calculated dimensions.
   * @param canvas html canvas to draw on
   * @param player html player to draw from
   * @param streamDimensions target canvas dimensions as well as original stream data
   */
  private drawStreamFrameToCanvas = (
    canvas: ExtendedCanvasElement,
    player: HTMLVideoElement,
    streamDimensions: StreamDimensions,
  ): void => {
    const context = canvas.getContext("2d");

    context.drawImage(
      player,
      streamDimensions.extraWidth / 2,
      streamDimensions.extraHeight / 2,
      streamDimensions.targetSize,
      streamDimensions.targetSize,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }

  /**
   * Draws a watermark above the whole canvas with provided opacity
   * @param watermark watermark image to draw aboce canvas
   * @param canvas html canvas to draw on
   * @param opacity opacity value
   */
  private drawWatermark = (
    watermark: HTMLImageElement,
    canvas: ExtendedCanvasElement,
    opacity: number,
  ): void => {
    const context = canvas.getContext("2d");

    context.beginPath();
    context.globalAlpha = opacity;
    context.drawImage(watermark, 0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    context.closePath();
  }

  /**
   * Captures stream from provided canvas into target player.
   * Also adds an audio stream to the target player from the provided MediaStream.
   */
  private canvasToPlayer = (
    canvas: ExtendedCanvasElement,
    targetPlayer: HTMLVideoElement,
    audioStream: MediaStream,
  ) => {
    const stream: MediaStream = canvas.captureStream(FPS);
    stream.addTrack(audioStream.getAudioTracks()[0]);

    targetPlayer.srcObject = stream;
    targetPlayer.play();
  }
}

export const WatermarkTranformerServiceInstance = new WatermarkTranformerService();
