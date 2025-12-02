import { IAddress } from "@/types/common/common";
import { Box, FormLabel, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import styles from "./AddressBox.module.css";

interface AddressBoxProps {
  address: IAddress;
  setAddress: Dispatch<SetStateAction<IAddress>>;
}

export default function AddressBox({ address, setAddress }: AddressBoxProps) {
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
      }}
    >
      <FormLabel>Укажите адрес доставки:</FormLabel>
      <div className={styles.line}>
        <TextField
          label="Почтовый индекс"
          variant="outlined"
          value={address.postalcode}
          onChange={(e) =>
            setAddress({ ...address, postalcode: e.target.value })
          }
          fullWidth
          required
        />
        <TextField
          id="city-input"
          label="Область"
          variant="outlined"
          value={address.region}
          onChange={(e) => setAddress({ ...address, region: e.target.value })}
          fullWidth
          required
        />
      </div>
      <div className={styles.line}>
        <TextField
          id="city-input"
          label="Город"
          variant="outlined"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          fullWidth
          required
        />

        <TextField
          label="Улица"
          variant="outlined"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          fullWidth
          required
        />
      </div>

      <div className={styles.line}>
        <TextField
          label="Дом"
          variant="outlined"
          value={address.house}
          onChange={(e) => setAddress({ ...address, house: e.target.value })}
          fullWidth
          required
        />

        <TextField
          label="Квартира"
          variant="outlined"
          value={address.apartment}
          onChange={(e) =>
            setAddress({ ...address, apartment: e.target.value })
          }
          fullWidth
        />
      </div>
    </Box>
  );
}
