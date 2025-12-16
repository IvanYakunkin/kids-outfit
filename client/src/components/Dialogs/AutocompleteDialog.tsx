import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import PaperComponent from "./PaperComponent";

export type AutocompleteOption = {
  id: number;
  label: string;
};

interface AutocompleteDialogProps {
  handleClose: () => void;
  initialOptions: AutocompleteOption[];
  defaultOption: AutocompleteOption | null;
  onSave: (option: AutocompleteOption | null) => void;
  label: string;
}

export default function AutocompleteDialog({
  handleClose,
  initialOptions,
  onSave,
  label,
  defaultOption,
}: AutocompleteDialogProps) {
  const [options, setOptions] = useState(initialOptions);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const saveValue = () => {
    onSave(selectedOption);
    handleClose();
    setOptions([]);
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperComponent={PaperComponent}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {label}
      </DialogTitle>
      <DialogContent>
        <div>
          <Autocomplete
            options={options}
            value={
              options.find(
                (option) => option.label === selectedOption?.label
              ) || null
            }
            onChange={(event, newValue) =>
              setSelectedOption(
                newValue?.id && newValue?.label
                  ? { id: newValue?.id, label: newValue?.label }
                  : defaultOption
              )
            }
            renderInput={(params) => <TextField {...params} label={label} />}
            sx={{ mt: 1 }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={saveValue}
            fullWidth
          >
            Обновить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
