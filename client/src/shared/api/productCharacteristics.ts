import { ICreatePCharacteristic } from "@/types/common/common";
import {
  CharacteristicsDto,
  CreateProductCharsDto,
  ProductCharacteristicDto,
} from "@/types/productCharacteristics";
import { fetchJson, FetchJsonResult } from "../fetchJson";

export async function getCharacteristics(): Promise<
  FetchJsonResult<CharacteristicsDto[]>
> {
  return fetchJson<CharacteristicsDto[]>("characteristics");
}

export async function createProductCharacteristics(
  productId: number,
  productChars: CreateProductCharsDto[]
): Promise<FetchJsonResult<ProductCharacteristicDto[]>> {
  return fetchJson<ProductCharacteristicDto[]>(
    `product-characteristics/${productId}`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(productChars),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function callCreateProductChars(
  productId: number,
  productChars: ICreatePCharacteristic[]
) {
  const productCharsRes = await createProductCharacteristics(
    productId,
    productChars.map((pc) => ({
      characteristic: pc.characteristicId,
      value: pc.value,
    }))
  );

  if (!productCharsRes.ok) {
    console.log(productCharsRes.error);
    return false;
  }

  return true;
}

export async function updateProductCharacteristics(
  productId: number,
  productChars: CreateProductCharsDto[]
): Promise<FetchJsonResult<ProductCharacteristicDto[]>> {
  return fetchJson<ProductCharacteristicDto[]>(
    `product-characteristics/${productId}`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(productChars),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function callUpdateProductChars(
  productId: number,
  productChars: ICreatePCharacteristic[]
) {
  const productCharsRes = await updateProductCharacteristics(
    productId,
    productChars.map((pc) => ({
      characteristic: pc.characteristicId,
      value: pc.value,
    }))
  );

  if (!productCharsRes.ok) {
    console.log(productCharsRes.error);
    return false;
  }

  return true;
}

export async function deleteCharacteristic(characteristicId: number) {
  return fetchJson(`characteristics/${characteristicId}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function updateCharacteristic(
  characteristicId: number,
  value: string
): Promise<FetchJsonResult<ProductCharacteristicDto[]>> {
  return fetchJson<ProductCharacteristicDto[]>(
    `characteristics/${characteristicId}`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ value }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function createCharacteristic(
  value: string
): Promise<FetchJsonResult<CharacteristicsDto>> {
  return fetchJson<CharacteristicsDto>(`characteristics`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ value }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
