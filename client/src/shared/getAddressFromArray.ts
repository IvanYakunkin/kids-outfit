import { IAddress } from "@/types/common/common";

export const getAddressFromArray = (address: IAddress): string => {
  const { postalcode, region, city, street, house, apartment } = address;

  const parts = [
    postalcode,
    region,
    `г. ${city}`,
    `ул. ${street}`,
    `д. ${house}`,
    apartment ? `кв. ${apartment}` : null,
  ].filter(Boolean);

  return parts.join(", ");
};
