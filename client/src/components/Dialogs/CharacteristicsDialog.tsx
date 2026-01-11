import { getCharacteristics } from "@/shared/api/productCharacteristics";
import { ICreatePCharacteristic } from "@/types/common/common";
import { CharacteristicsDto } from "@/types/productCharacteristics";
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

interface CharacteristicsDialogProps {
  open: boolean;
  productChars: ICreatePCharacteristic[];
  setProductChars: Dispatch<SetStateAction<ICreatePCharacteristic[]>>;
  handleClose: () => void;
  readonly: boolean;
}

export default function CharacteristicsDialog(
  props: CharacteristicsDialogProps
) {
  const [selectedCharacteristicId, setSelectedCharacteristicId] = useState<
    number | null
  >(null);
  const [characteristicValue, setCharacteristicValue] = useState("");
  const [characteristicsOptions, setCharacteristicsOptions] = useState<
    CharacteristicsDto[]
  >([]);
  const [editRecord, setEditRecord] = useState<ICreatePCharacteristic>();
  const [isFieldDialog, setIsFieldDialog] = useState(false);

  useEffect(() => {
    const getCharsFromDB = async () => {
      const charsResponse = await getCharacteristics();

      if (charsResponse.ok && charsResponse.data) {
        setCharacteristicsOptions(
          charsResponse.data.map((c) => ({ id: c.id, value: c.value }))
        );
      }
    };

    getCharsFromDB();
  }, []);

  const handleAddCharacteristic = () => {
    const findTheSame = props.productChars.find(
      (c) => c.characteristicId === selectedCharacteristicId
    );
    if (findTheSame) {
      alert("Характеристика уже используется");
      return;
    }
    if (selectedCharacteristicId && characteristicValue) {
      props.setProductChars([
        ...props.productChars,
        {
          characteristicId: selectedCharacteristicId,
          value: characteristicValue,
        },
      ]);
      setSelectedCharacteristicId(null);
      setCharacteristicValue("");
    }
  };

  const handleDelete = (index: number) => {
    props.setProductChars(props.productChars.filter((_, idx) => idx !== index));
  };

  const handleEdit = (index: number) => {
    setIsFieldDialog(true);
    setEditRecord(props.productChars[index]);
  };

  const editSave = (value: string) => {
    props.setProductChars((prev) =>
      prev.map((c) =>
        c.characteristicId === editRecord?.characteristicId
          ? { characteristicId: c.characteristicId, value }
          : c
      )
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCharacteristic();
    }
  };

  return (
    <>
      {isFieldDialog && (
        <FieldDialog
          initialValue={editRecord?.value}
          handleClose={() => setIsFieldDialog(false)}
          onSave={editSave}
          closeAfterSave={true}
          label="Управление характеристиками товара"
        />
      )}
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        maxWidth="sm"
        fullWidth
        PaperComponent={PaperComponent}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Характеристики товара
        </DialogTitle>
        <DialogContent>
          {!props.readonly && (
            <div>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={characteristicsOptions}
                  getOptionLabel={(option) => option.value}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={
                    characteristicsOptions.find(
                      (c) => c.id === selectedCharacteristicId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    if (newValue !== null) {
                      setSelectedCharacteristicId(newValue.id);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Характеристика" />
                  )}
                />
              </FormControl>
              <TextField
                label="Значение"
                fullWidth
                value={characteristicValue}
                onChange={(e) => setCharacteristicValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  background: "var(--templatePurple)",
                  "&:hover": {
                    backgroundColor: "var(--templatePurpleHover)",
                  },
                }}
                onClick={handleAddCharacteristic}
                fullWidth
              >
                Добавить
              </Button>
            </div>
          )}
          <List style={{ maxHeight: "300px" }}>
            {props.productChars.length === 0 && (
              <div>Характеристики не добавлены</div>
            )}
            {props.productChars.map((item, index) => (
              <ListItem
                key={item.characteristicId}
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
                      onClick={() => handleEdit(index)}
                      sx={{ ml: 1 }}
                    >
                      <Image
                        src="/images/edit.png"
                        width={20}
                        height={20}
                        alt="Редактировать"
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
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box
                    display="flex"
                    alignItems="start"
                    justifyContent="space-between"
                    width="80%"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      width="45%"
                    >
                      <Typography variant="body2" color="textSecondary">
                        Характеристика:
                      </Typography>
                      <Typography variant="body1" textAlign="center">
                        {
                          characteristicsOptions.find(
                            (s) => s.id === item.characteristicId
                          )?.value
                        }
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      width="45%"
                    >
                      <Typography variant="body2" color="textSecondary">
                        Значение:
                      </Typography>
                      <Typography variant="body1" textAlign="center">
                        {item.value}
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
