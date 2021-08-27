import styled, { css } from "styled-components";

export const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
`;

export const VideoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  width: 480px;
`;

export const VideoLabel = styled.span`
  font-size: 17px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-weight: 600;
`;

const MediaStyles = css`
  width: 100%;
`;

export const Video = styled.video`
  ${MediaStyles};
`;

export const Canvas = styled.canvas`
  ${MediaStyles};
`;
