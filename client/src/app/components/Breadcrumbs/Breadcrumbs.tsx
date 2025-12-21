import Link from "next/link";
import { CSSProperties } from "react";
import styles from "./Breadcrumbs.module.css";

interface BreadcrumbsProps {
  pathParts: { name: string; url?: string | null }[];
  additionalStyles?: CSSProperties;
}

export default function Breadcrumbs({
  pathParts,
  additionalStyles,
}: BreadcrumbsProps) {
  const homeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      height="16"
      width="16"
    >
      <path
        stroke="rgb(97, 97, 97)"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75299 13.944v8.25h6v-6c0 -0.3979 0.15804 -0.7794 0.43931 -1.0607 0.2813 -0.2813 0.6629 -0.4393 1.0607 -0.4393h1.5c0.3978 0 0.7793 0.158 1.0607 0.4393 0.2813 0.2813 0.4393 0.6628 0.4393 1.0607v6h6v-8.25"
        strokeWidth="1.5"
      ></path>
      <path
        stroke="rgb(97, 97, 97)"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.752991 12.444 10.942 2.25499c0.1393 -0.13939 0.3047 -0.24997 0.4867 -0.32541 0.1821 -0.07544 0.3772 -0.11427 0.5743 -0.11427 0.1971 0 0.3922 0.03883 0.5742 0.11427 0.1821 0.07544 0.3475 0.18602 0.4868 0.32541L23.253 12.444"
        strokeWidth="1.5"
      ></path>
    </svg>
  );

  return (
    <div className={styles.breadcrumbs} style={additionalStyles}>
      <Link href="/" className={`${styles.home} ${styles.element}`}>
        {homeIcon}
      </Link>
      {pathParts.map((segment) => {
        return !segment.url ? (
          <span className={styles.element} key={segment.name}>
            {segment.name}
          </span>
        ) : (
          <Link
            href={segment.url}
            key={segment.name}
            className={`${styles.element} ${styles.link}`}
          >
            {segment.name}
          </Link>
        );
      })}
    </div>
  );
}
