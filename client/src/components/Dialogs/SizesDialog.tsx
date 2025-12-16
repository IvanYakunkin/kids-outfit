import { getSizes } from "@/shared/api/productSizes";
import { ICreateProductSize } from "@/types/common/common";
import { Size } from "@/types/productSizes";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FieldDialog from "./FieldDialog";
import PaperComponent from "./PaperComponent";

interface SizesDialogProps {
  open: boolean;
  initialPSizes: ICreateProductSize[];
  setInitialPSizes: Dispatch<SetStateAction<ICreateProductSize[]>>;
  handleClose: () => void;
  readonly?: boolean;
}

export default function SizesDialog({
  open,
  initialPSizes,
  handleClose,
  setInitialPSizes,
  readonly,
}: SizesDialogProps) {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>();
  const [localPSizes, setLocalPSizes] = useState(initialPSizes);
  const [editRecord, setEditRecord] = useState<ICreateProductSize>();

  const handleAddSize = () => {
    if (selectedSizeId && quantity) {
      if (localPSizes.find((s) => s.sizeId === selectedSizeId)) {
        alert("Данный размер уже добавлен");
        return;
      }
      setLocalPSizes([
        ...localPSizes,
        { sizeId: selectedSizeId, quantity: +quantity },
      ]);
    }
    setSelectedSizeId(null);
    setQuantity(undefined);
  };

  const handleSave = () => {
    setInitialPSizes(localPSizes);
    handleClose();
  };

  const editSave = (value: string) => {
    setLocalPSizes((prev) =>
      prev.map((s) =>
        s.sizeId === editRecord?.sizeId
          ? { id: s.id, sizeId: s.sizeId, quantity: +value }
          : s
      )
    );
  };

  useEffect(() => {
    const getSizesFromDB = async () => {
      const sizesResponse = await getSizes();
      if (sizesResponse.ok && sizesResponse.data) {
        setSizes(sizesResponse.data);
      } else {
        console.log("Не удалось получить размеры", sizesResponse.error);
      }
    };

    getSizesFromDB();
  }, []);

  return (
    <>
      {editRecord && (
        <FieldDialog
          initialValue={editRecord?.quantity.toString()}
          handleClose={() => setEditRecord(undefined)}
          onSave={editSave}
          label="Управление размерами товара"
        />
      )}
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Размеры товара
        </DialogTitle>
        <DialogContent>
          {!readonly && (
            <>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={sizes}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={
                    sizes.find((size) => size.id === selectedSizeId) || null
                  }
                  onChange={(event, newValue) => {
                    setSelectedSizeId(newValue ? newValue.id : null);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Размеры" />
                  )}
                />
              </FormControl>

              <TextField
                label="Количество"
                type="number"
                required
                value={quantity ?? ""}
                onChange={(e) => setQuantity(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleAddSize}
                sx={{
                  mt: 2,
                  background: "var(--templatePurple)",
                  "&:hover": {
                    backgroundColor: "var(--templatePurpleHover)",
                  },
                }}
                fullWidth
              >
                Добавить
              </Button>
            </>
          )}
          <List style={{ maxHeight: "300px" }}>
            {localPSizes.length === 0 && <div>Размеры не добавлены</div>}
            {localPSizes.map((item) => (
              <ListItem
                key={item.sizeId}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
                secondaryAction={
                  <IconButton
                    aria-label="редактировать"
                    onClick={() => setEditRecord(item)}
                    sx={{ ml: 2 }}
                  >
                    <Image
                      src="/images/edit.png"
                      width={20}
                      height={20}
                      alt="редактировать"
                    />
                  </IconButton>
                }
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mr={5}
                    flex={1}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="textSecondary">
                        Размер:
                      </Typography>
                      <Typography variant="body1">
                        {sizes.find((s) => s.id === item.sizeId)?.name}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="textSecondary">
                        Количество:
                      </Typography>
                      <Typography variant="body1">{item.quantity}</Typography>
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
          {!readonly && (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Сохранить
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
