import { getCategories } from "@/shared/api/categories";
import { flattenCategories } from "@/shared/flattenCategories";
import { CategoryDto } from "@/types/categories";
import { CategorySelect } from "@/types/common/common";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface CategoryFieldProps {
  selectedCategory: CategorySelect | null;
  onChange: (selected: CategorySelect) => void;
  canBeEmpty?: boolean;
  label?: string;
  readonly?: boolean;
}

export default function CategoryField(props: CategoryFieldProps) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const flatCategories = flattenCategories(categories).map((option, index) => ({
    ...option,
    key: option.id || index,
  }));

  useEffect(() => {
    const getCategoriesFromDB = async () => {
      const categoriesResponse = await getCategories();
      if (categoriesResponse.ok && categoriesResponse.data) {
        if (props.canBeEmpty) {
          setCategories([
            { id: -1, name: "Нулевой уровень", slug: "" },
            ...categoriesResponse.data,
          ]);
        } else {
          setCategories(categoriesResponse.data);
        }
      } else {
        console.log("Не удалось получить категории", categoriesResponse.error);
      }
    };

    getCategoriesFromDB();
  }, [props.canBeEmpty]);
  return (
    <Autocomplete
      disablePortal
      getOptionLabel={(option) => option.label}
      value={
        props.selectedCategory ??
        flatCategories.find((c) => c.id === -1) ??
        null
      }
      onChange={(event, newValue) =>
        newValue && !props.readonly && props.onChange(newValue)
      }
      options={flatCategories}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={props.label || "Категория"} fullWidth />
      )}
    />
  );
}
