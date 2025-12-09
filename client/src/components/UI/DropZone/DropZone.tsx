"use client";

import { ImageFromDB, LoadedImage } from "@/types/common/common";
import NextImage from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./DropZone.module.css";

type FileItem = LoadedImage | ImageFromDB;

interface DropZoneProps {
  files: FileItem[];
  setFiles: Dispatch<SetStateAction<FileItem[]>>;
  readonly?: boolean;
}

export default function DropZone({ files, setFiles, readonly }: DropZoneProps) {
  const [fullscreenImg, setFullscreenImg] = useState<
    LoadedImage | ImageFromDB | null
  >(null);
  const [isDragged, setIsDragged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const getImageSize = (
    file: File
  ): Promise<{ width: number; height: number }> =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
    });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const filesWithSize = await Promise.all(
      selectedFiles.map(async (file) => {
        const size = await getImageSize(file);
        return {
          file,
          ...size,
          url: URL.createObjectURL(file),
        };
      })
    );

    setFiles((prev) => [...prev, ...filesWithSize]);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragged(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    const filesWithSize = await Promise.all(
      droppedFiles.map(async (file) => {
        const size = await getImageSize(file);
        return {
          file,
          ...size,
          url: URL.createObjectURL(file),
        };
      })
    );

    setFiles((prev) => [...prev, ...filesWithSize]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragged(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragged(false);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0 && inputRef.current) inputRef.current.value = "";
      return updated;
    });
  };

  return (
    <div>
      {!readonly && (
        <>
          <input
            ref={inputRef}
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={
              isDragged
                ? `${styles.dropArea} ${styles.dragged}`
                : `${styles.dropArea}`
            }
          >
            <p>Перетащите файлы сюда или кликните, чтобы выбрать</p>
          </div>
        </>
      )}

      {files.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {files.map((item, index) => (
            <li key={index} className={styles.previewElement}>
              {"file" in item && item.file.type.startsWith("image/") && (
                <>
                  <div
                    className={styles.previewImageContainer}
                    onClick={() => setFullscreenImg(item)}
                  >
                    <NextImage
                      src={URL.createObjectURL(item.file)}
                      alt={item.file.name}
                      width={120}
                      height={(item.height / item.width) * 120}
                    />
                  </div>
                  <span style={{ flexGrow: 1 }}>{item.file.name}</span>

                  <button
                    onClick={() => handleRemove(index)}
                    className={styles.deleteBtn}
                  >
                    Удалить
                  </button>
                </>
              )}
              {"url" in item && "name" in item && (
                <>
                  <div
                    className={styles.previewImageContainer}
                    onClick={() => setFullscreenImg(item)}
                  >
                    <NextImage
                      src={item.url}
                      alt={item.name}
                      width={120}
                      height={100}
                      style={{ height: "auto" }}
                    />
                  </div>
                  <span style={{ flexGrow: 1 }}>{item.name}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {fullscreenImg && (
        <div
          onClick={() => setFullscreenImg(null)}
          className={styles.fullscreen}
        >
          <div className={styles.fullscreenImgContainer}>
            <NextImage
              src={fullscreenImg.url}
              alt="fullscreen"
              fill
              style={{ objectFit: "contain", borderRadius: "8px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
