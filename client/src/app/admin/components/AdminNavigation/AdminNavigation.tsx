import { Button, Stack } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function AdminNavigation() {
  return (
    <Stack direction="row" spacing={2} padding="15px 0">
      <Link href="/admin/products/">
        <Button variant="contained" color="primary" sx={{ gap: 1 }}>
          <Image
            src="/images/products.png"
            width={20}
            height={20}
            alt="Products"
          />
          <span>Товары</span>
        </Button>
      </Link>
      <Link href="/admin/orders">
        <Button variant="contained" color="primary" sx={{ gap: 1 }}>
          <Image src="/images/orders.png" width={20} height={20} alt="Orders" />
          <span>Заказы</span>
        </Button>
      </Link>
      <Link href="/admin/categories">
        <Button variant="contained" color="primary" sx={{ gap: 1 }}>
          <Image
            src="/images/categories.png"
            width={20}
            height={20}
            alt="Categories"
          />
          <span>Категории</span>
        </Button>
      </Link>
      <Link href="/admin/characteristics">
        <Button variant="contained" color="primary" sx={{ gap: 1 }}>
          <Image
            src="/images/characteristics.png"
            width={20}
            height={20}
            alt="Characteristics"
          />
          <span>Характеристики</span>
        </Button>
      </Link>
      <Link href="/admin/sizes">
        <Button variant="contained" color="primary" sx={{ gap: 1 }}>
          <Image src="/images/sizes.png" width={20} height={20} alt="Sizes" />
          <span>Размеры</span>
        </Button>
      </Link>
      <Link href="/admin/statuses">
        <Button variant="contained" color="primary" sx={{ gap: 1 }}>
          <Image
            src="/images/statuses.png"
            width={20}
            height={20}
            alt="Statuses"
          />
          <span>Статусы</span>
        </Button>
      </Link>
    </Stack>
  );
}
