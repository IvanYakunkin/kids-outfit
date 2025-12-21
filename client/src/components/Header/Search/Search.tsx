"use client";

import { getProducts } from "@/shared/api/products";
import { PaginatedProductsDto, ProductResponseDto } from "@/types/products";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Search.module.css";

export default function Search() {
  const router = useRouter();
  const [showSearchContainer, setShowContainer] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ProductResponseDto[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [typingTimeout, setTypingTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const toCatalogPage = () => {
    router.push(`/catalog?search=${search}`);
    setShowContainer(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setShowContainer(true);
    }
    setSearch(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      fetchResults(value);
    }, 300);

    setTypingTimeout(timeout);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      toCatalogPage();
    }
  };

  const fetchResults = async (value: string) => {
    const productsRes = await getProducts<PaginatedProductsDto>({
      search: value,
      limit: 10,
    });
    if (productsRes.ok && productsRes.data) {
      setSearchResults(productsRes.data.data);
    } else {
      console.log("Не удалось получить результаты поиска", productsRes.error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      listRef.current &&
      !listRef.current.contains(event.target as Node)
    ) {
      setShowContainer(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.search}>
      <div className={styles.fieldContainer}>
        <input
          type="text"
          name="search"
          ref={inputRef}
          value={search}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className={styles.field}
          autoComplete="off"
          placeholder="Найти в магазине"
        />
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="none"
          viewBox="0 0 24 30"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          />
        </svg>
        {search && showSearchContainer && (
          <div ref={listRef} className={styles.searchContainer}>
            <div className={styles.list}>
              <Link
                href={`/catalog?search=${search}`}
                className={styles.element}
              >
                {" "}
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 30"
                  onClick={toCatalogPage}
                >
                  <path
                    stroke="gray"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span>{search}</span>
              </Link>
              {searchResults.length > 0 &&
                searchResults.map((product) => (
                  <Link
                    href={`/catalog?search=${product.name}`}
                    key={product.id}
                    className={styles.element}
                    onClick={() => setShowContainer(false)}
                  >
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 30"
                      onClick={toCatalogPage}
                    >
                      <path
                        stroke="gray"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      />
                    </svg>
                    <span>{product.name}</span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
      {showSearchContainer && <div className={styles.searchBlur}></div>}
    </div>
  );
}
