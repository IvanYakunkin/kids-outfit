import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import PaperComponent from "./PaperComponent";

interface FieldDialogProps {
  handleClose: () => void;
  initialValue?: string;
  onSave: (value: string) => void;
  label: string;
}

export default function FieldDialog({
  handleClose,
  initialValue,
  onSave,
  label,
}: FieldDialogProps) {
  const [value, setValue] = useState(initialValue);

  const saveValue = () => {
    if (value) {
      onSave(value);
      handleClose();
      setValue("");
    }
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
          <TextField
            label="Значение"
            fullWidth
            value={value}
            required
            sx={{ mt: 1 }}
            onChange={(e) => setValue(e.target.value)}
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
