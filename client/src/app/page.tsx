import CollectionSwiper from "@/components/Collection/CollectionSwiper";
import { getNewProducts, getPopularProducts } from "@/shared/api/products";
import { CollectionSlide } from "@/types/common/common";
import CollectionsSwiper from "./components/CollectionsSwiper/CollectionsSwiper";
import FullStoreDescription from "./components/FullStoreDescription/FullStoreDescription";
import IntroSwiper from "./components/IntroSwiper/IntroSwiper";
import styles from "./page.module.css";

export default async function MainPage() {
  const swiperIntroImages = [
    { src: "/images/content/1.jpg", alt: "Slide photo" },
    { src: "/images/content/2.jpg", alt: "Slide photo" },
    { src: "/images/content/3.jpg", alt: "Slide photo" },
    { src: "/images/content/4.jpg", alt: "Slide photo" },
  ];

  const collectionSlides: CollectionSlide[] = [
    {
      src: "/images/content/heroes.jpg",
      name: "Любимые герои",
      alt: "Любимые герои",
    },
    {
      src: "/images/content/family.jpg",
      name: "Семейные образы",
      alt: "Семейные образы",
    },
    {
      src: "/images/content/springJackets.jpg",
      name: "Для весны",
      alt: "Для весны",
    },
    {
      src: "/images/content/spring.jpg",
      name: "Для осени",
      alt: "Для осени",
    },
    {
      src: "/images/shoes.jpg",
      name: "Осенняя обувь",
      alt: "Осенняя обувь",
    },
  ];

  const [popularProductsRes, newProductsRes] = await Promise.all([
    getPopularProducts(),
    getNewProducts(),
  ]);

  if (!popularProductsRes.ok) {
    console.log("Не удалось загрузить хиты продаж", popularProductsRes.error);
  }
  if (!newProductsRes.ok) {
    console.log("Не удалось загрузить новинки", newProductsRes.error);
  }

  const popularProducts = popularProductsRes.data?.data ?? [];
  const newProducts = newProductsRes.data?.data ?? [];

  return (
    <main className={styles.main}>
      <IntroSwiper swiperImages={swiperIntroImages} />
      <CollectionsSwiper collectionSlides={collectionSlides} />

      <section>
        <video width="100%" autoPlay loop muted>
          <source src="/videos/desktop.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </section>

      <section>
        <CollectionSwiper title="Хиты продаж" collection={popularProducts} />
      </section>

      <section>
        <CollectionSwiper title="Новинки" collection={newProducts} />
      </section>

      <section>
        <div className={styles.storeDescription}>
          <div className="mainTitle">Интернет-магазин KidsOutfit</div>
          <div>
            Здесь вас ждут стильные и качественные товары для всей семьи.
            Ключевые требования, которые мы предъявляем ко всем товарам - яркий
            стиль, качество, функциональность и безопасность.&nbsp;
            <FullStoreDescription />
          </div>
        </div>
      </section>
    </main>
  );
}
