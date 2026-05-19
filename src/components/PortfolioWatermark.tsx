// @Isanchezv
import Watermark from "@uiw/react-watermark";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Texto de la marca de agua (una o varias líneas) */
  content: string | string[];
};

export default function PortfolioWatermark({ children, content }: Props) {
  return (
    <Watermark
      content={content}
      rotate={-20}
      gapX={200}
      gapY={200}
      width={160}
      fontSize={13}
      fontColor="rgb(255 255 255 / 7%)"
      className="min-h-screen w-full"
    >
      {children}
    </Watermark>
  );
}
