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
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import FieldDialog from "./FieldDialog";
import PaperComponent from "./PaperComponent";

interface SizesDialogProps {
  open: boolean;
  productSizes: ICreateProductSize[];
  setProductSizes: Dispatch<SetStateAction<ICreateProductSize[]>>;
  handleClose: () => void;
  readonly?: boolean;
}

export default function SizesDialog(props: SizesDialogProps) {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>();
  const [editRecord, setEditRecord] = useState<ICreateProductSize>();
  const handleAddSize = () => {
    if (selectedSizeId && quantity) {
      if (props.productSizes.find((s) => s.sizeId === selectedSizeId)) {
        alert("Данный размер уже добавлен");
        return;
      }
      props.setProductSizes([
        ...props.productSizes,
        { sizeId: selectedSizeId, quantity: +quantity },
      ]);
    }
    setSelectedSizeId(null);
    setQuantity(undefined);
  };

  const editSave = (value: string) => {
    props.setProductSizes((prev) =>
      prev.map((s) =>
        s.sizeId === editRecord?.sizeId
          ? { id: s.id, sizeId: s.sizeId, quantity: +value }
          : s
      )
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSize();
    }
  };

  const handleDelete = (index: number) => {
    props.setProductSizes((prev) => prev.filter((_, idx) => index !== idx));
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
          closeAfterSave={true}
          label="Управление размерами товара"
        />
      )}
      <Dialog
        open={props.open}
        PaperComponent={PaperComponent}
        onClose={props.handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Размеры товара
        </DialogTitle>
        <DialogContent>
          {!props.readonly && (
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
                onKeyDown={handleKeyDown}
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
            {props.productSizes.length === 0 && <div>Размеры не добавлены</div>}
            {props.productSizes.map((item, index) => (
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
                  <>
                    <IconButton
                      aria-label="Редактировать"
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
                    <IconButton
                      aria-label="Удалить"
                      onClick={() => handleDelete(index)}
                    >
                      <Image
                        src="/images/delete-black.png"
                        width={20}
                        height={20}
                        alt="Удалить"
                      />
                    </IconButton>
                  </>
                }
              >
                <Box
                  display="flex"
                  alignItems="start"
                  justifyContent="space-between"
                  width="90%"
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
                      width="45%"
                    >
                      <Typography variant="body2" color="textSecondary">
                        Размер:
                      </Typography>
                      <Typography variant="body1" textAlign="center">
                        {sizes.find((s) => s.id === item.sizeId)?.name}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      width="45%"
                    >
                      <Typography variant="body2" color="textSecondary">
                        Количество:
                      </Typography>
                      <Typography variant="body1" textAlign="center">
                        {item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={props.handleClose}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
