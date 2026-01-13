"use client";
import { getProducts } from "@/shared/api/products";
import {
  PaginatedProductsDto,
  ProductQueryParams,
  ProductResponseDto,
} from "@/types/products";
import { CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Collection from "./Collection";

interface CollectionLazyProps {
  productQueryParams: ProductQueryParams;
}

export const CollectionLazy = ({ productQueryParams }: CollectionLazyProps) => {
  const [products, setProducts] = useState<ProductResponseDto[] | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    const clearStates = () => {
      setProducts(null);
      setPage(1);
      setHasMore(true);
    };

    clearStates();
  }, [productQueryParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = { ...productQueryParams };
      queryParams.page = page;
      queryParams.limit = 20;
      setIsLoading(true);
      const productsResponse = await getProducts<PaginatedProductsDto>(
        queryParams
      );

      setIsLoading(false);
      const responseData = productsResponse.data;
      if (productsResponse.ok && responseData?.data) {
        setProducts((prev) => {
          if (page === 1) return responseData.data;
          return [...(prev ?? []), ...responseData.data];
        });

        if (responseData.meta?.lastPage && page < responseData.meta.lastPage) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      }
    };

    fetchProducts();
  }, [page, productQueryParams]);

  useEffect(() => {
    if (!hasMore) return;

    const currentLoader = loaderRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore]);

  return (
    <div>
      {products && <Collection collection={products} isLoadingEager />}

      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      )}

      {hasMore && <div ref={loaderRef} style={{ height: "20px" }} />}
    </div>
  );
};
