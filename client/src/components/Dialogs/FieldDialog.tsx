import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { KeyboardEvent, useState } from "react";
import PaperComponent from "./PaperComponent";

interface FieldDialogProps {
  handleClose: () => void;
  initialValue?: string;
  onSave: (value: string) => void;
  label: string;
  closeAfterSave?: boolean;
  bgcolor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}

export default function FieldDialog({
  handleClose,
  initialValue = "",
  onSave,
  label,
  closeAfterSave,
  bgcolor,
}: FieldDialogProps) {
  const [value, setValue] = useState(initialValue);

  const saveValue = () => {
    if (value.trim()) {
      onSave(value);
      setValue("");
      if (closeAfterSave) {
        handleClose();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveValue();
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
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[800],
        })}
      >
        &times;
      </IconButton>
      <DialogContent>
        <div>
          <TextField
            label="Значение"
            fullWidth
            value={value}
            required
            sx={{ mt: 1 }}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, bgcolor }}
            color={bgcolor || "primary"}
            onClick={saveValue}
            fullWidth
          >
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
