import { CreateCategoryDto } from "@/types/categories";
import { CategorySelect } from "@/types/common/common";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from "@mui/material";
import { useState } from "react";
import CategoryField from "../CategoryField/CategoryField";
import PaperComponent from "./PaperComponent";

interface CategoryDialogProps {
  title: string;
  handleClose: () => void;
  onSave: (category: CreateCategoryDto) => void;
  initCategory?: { name: string; parentCategory?: CategorySelect };
  readonly?: boolean;
}

export default function CategoryDialog({
  title,
  handleClose,
  onSave,
  initCategory,
  readonly,
}: CategoryDialogProps) {
  const [category, setCategory] = useState(initCategory?.name ?? "");
  const [parentCategory, setParentCategory] = useState<CategorySelect | null>(
    initCategory?.parentCategory || null
  );

  const changeParentCategory = (selected: CategorySelect) => {
    setParentCategory(selected);
  };

  const handleSaveBtn = () => {
    if (category.trim()) {
      onSave({
        name: category,
        ...(parentCategory ? { parentId: parentCategory.id } : {}),
      });
      handleClose();
    }
  };

  return (
    <>
      <Dialog
        open={true}
        PaperComponent={PaperComponent}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent style={{ height: "600px" }}>
          {!readonly && (
            <>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Название категории"
                  type="string"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <CategoryField
                  selectedCategory={parentCategory}
                  label="Родительская категория"
                  onChange={changeParentCategory}
                  canBeEmpty
                />
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
          {!readonly && (
            <Button variant="contained" color="primary" onClick={handleSaveBtn}>
              Сохранить
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
