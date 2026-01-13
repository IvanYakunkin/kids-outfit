import Image from "next/image";
import { useEffect } from "react";
import styles from "./ImageViewer.module.css";

interface ImageViewerProps {
  isOpen: boolean;
  url: string;
  onClose: () => void;
}

export default function ImageViewer({
  url,
  isOpen,
  onClose,
}: ImageViewerProps) {
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.marginRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.marginRight = "0";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className={styles.fullscreen}>
      <div className={styles.fullscreenImgContainer}>
        <Image
          src={url}
          alt="fullscreen"
          fill
          style={{ objectFit: "contain", borderRadius: "8px" }}
        />
      </div>
    </div>
  );
}
