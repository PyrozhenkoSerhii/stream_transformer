import { useEffect, useRef } from "react";

import { ExtendedCanvasElement } from "./watermarkTransformer.interfaces";
import { WatermarkTranformerServiceInstance } from "./watermarkTransformer.service";
import { ContentWrapper, Video, Canvas, VideoBlock, VideoLabel } from "./watermarkTransformer.styled";

export const WatermarkTransformerComponent = (): JSX.Element => {
  const originalPlayerRef = useRef<HTMLVideoElement>(null);
  const destinationPlayerRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    WatermarkTranformerServiceInstance.initialize(
      originalPlayerRef.current,
      destinationPlayerRef.current,
      canvasRef.current as ExtendedCanvasElement,
    );
  }, []);

  return (
    <ContentWrapper>
      <VideoBlock>
        <VideoLabel>Original Video</VideoLabel>
        <Video ref={originalPlayerRef} muted />
      </VideoBlock>

      <VideoBlock>
        <VideoLabel>Intermediate Canvas</VideoLabel>
        <Canvas ref={canvasRef} />
      </VideoBlock>

      <VideoBlock>
        <VideoLabel>Result Video</VideoLabel>
        <Video ref={destinationPlayerRef} muted controls />
      </VideoBlock>
    </ContentWrapper>
  );
};
