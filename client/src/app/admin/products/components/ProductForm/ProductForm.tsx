"use client";

import CategoryField from "@/components/CategoryField/CategoryField";
import CharacteristicsDialog from "@/components/Dialogs/CharacteristicsDialog";
import SizesDialog from "@/components/Dialogs/SizesDialog";
import DropZone from "@/components/UI/DropZone/DropZone";
import {
  callCreateProductChars,
  callUpdateProductChars,
} from "@/shared/api/productCharacteristics";
import { createProduct, editProduct } from "@/shared/api/products";
import {
  callCreateProductSizes,
  callUpdateProductSizes,
} from "@/shared/api/productSizes";
import { authRequestWrapper } from "@/shared/authRequestWrapper";
import { getDiscountedPrice } from "@/shared/getDiscountedPrice";
import {
  CategorySelect,
  ICreatePCharacteristic,
  ICreateProductSize,
  ImageFromDB,
  LoadedImage,
} from "@/types/common/common";
import { ProductInfoDto } from "@/types/products";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  Snackbar,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./ProductForm.module.css";

interface ProductFormProps {
  mode: "create" | "edit" | "view";
  initialProduct?: ProductInfoDto;
  titleLabel: string;
}

type FileItem = LoadedImage | ImageFromDB;

export default function ProductForm({
  mode,
  initialProduct,
  titleLabel,
}: ProductFormProps) {
  const router = useRouter();
  // TODO: Add all fields to one object
  const [name, setName] = useState<string>(initialProduct?.name ?? "");
  const [description, setDescription] = useState<string>(
    initialProduct?.description ?? ""
  );
  const [care, setCare] = useState<string>(initialProduct?.care ?? "");
  // Price without discount
  const [price, setPrice] = useState<number | string>(
    initialProduct?.price ?? ""
  );
  const [resultPrice, setResultPrice] = useState<number>(
    initialProduct?.discount
      ? getDiscountedPrice(initialProduct.price, initialProduct.discount)
      : 0
  );
  const [discount, setDiscount] = useState<number | string>(
    initialProduct?.discount ?? ""
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CategorySelect | null>(
      initialProduct
        ? {
            id: initialProduct.category.id,
            label: initialProduct.category.name,
          }
        : null
    );

  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>(
    initialProduct?.images
      ? initialProduct?.images?.map((img) => ({ url: img.url, name: img.name }))
      : []
  );

  const [sizesDialogOpen, setSizesDialogOpen] = useState(false);
  const [charsDialogOpen, setCharsDialogOpen] = useState(false);
  const [productSizes, setProductSizes] = useState<ICreateProductSize[]>(
    initialProduct?.sizes
      ? initialProduct.sizes.map((s) => ({
          id: s.id,
          quantity: s.quantity,
          sizeId: s.size.id,
        }))
      : []
  );
  const [productChars, setProductChars] = useState<ICreatePCharacteristic[]>(
    initialProduct?.productCharacteristics
      ? initialProduct.productCharacteristics.map((pc) => ({
          characteristicId: pc.characteristic.id,
          value: pc.value,
        }))
      : []
  );
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getResultPrice = (price: number, discount: number) => {
    if (price && discount) {
      setResultPrice(getDiscountedPrice(price, discount));
    }
    if (discount === 0) {
      setResultPrice(price);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    if (value === 0) {
      setPrice("");
    }
    if (value) {
      setPrice(value);
      getResultPrice(value, +discount);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    if (value === 0) {
      setDiscount("");
    }
    if (value) {
      setDiscount(value);
      getResultPrice(+price, value);
    }
  };

  const saveProduct = async () => {
    const formData = new FormData();
    if (!selectedCategory) {
      alert("Выберите категорию");
      return;
    }

    selectedFiles.forEach((file) => {
      if ("file" in file) {
        formData.append("images", file.file);
      }
    });
    formData.append("name", name);
    formData.append("description", description);
    formData.append("care", care);
    formData.append("price", price.toString());
    formData.append("discount", discount.toString());
    formData.append("categoryId", selectedCategory.id.toString());
    formData.append("isActive", true.toString());

    let operationRes;
    if (mode === "edit" && initialProduct) {
      operationRes = await authRequestWrapper(
        () => editProduct(initialProduct?.id, formData),
        router
      );
    } else {
      operationRes = await authRequestWrapper(
        () => createProduct(formData),
        router
      );
    }

    if (operationRes.ok && operationRes.data) {
      let savePCharsStatus;
      let savePSizesStatus;

      if (mode === "edit") {
        savePCharsStatus = await callUpdateProductChars(
          operationRes.data.id,
          productChars
        );

        savePSizesStatus = await callUpdateProductSizes(
          operationRes.data.id,
          productSizes
        );
      } else {
        savePCharsStatus = await callCreateProductChars(
          operationRes.data.id,
          productChars
        );

        savePSizesStatus = await callCreateProductSizes(
          operationRes.data.id,
          productSizes
        );
      }

      if (savePCharsStatus && savePSizesStatus) {
        if (mode !== "edit") {
          setName("");
          setDescription("");
          setCare("");
          setSelectedCategory(null);
          setPrice("");
          setDiscount("");
          setResultPrice(0);
          setSelectedFiles([]);
          setProductChars([]);
          setProductSizes([]);
        }
        setSuccessAlert(true);
      } else {
        setErrorAlert(true);
      }
    } else {
      setErrorAlert(true);
      setErrorMsg(operationRes.error || "");
      console.log("Не удалось выполнить операцию", operationRes.error);
    }
  };

  return (
    <main className={styles.create}>
      <Box
        sx={{
          border: "1px solid lightgray",
          padding: 2,
          borderRadius: 1,
        }}
      >
        <div className={styles.title}>{titleLabel}</div>

        <div className={styles.forms}>
          <div className={styles.form}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              label="Название"
              variant="outlined"
              slotProps={
                mode === "view" ? { htmlInput: { readOnly: true } } : undefined
              }
            />
          </div>
          <div className={styles.form}>
            <div>
              <InputLabel sx={{ mb: 1 }}>Фотографии</InputLabel>

              <DropZone
                files={selectedFiles}
                setFiles={setSelectedFiles}
                readonly={mode === "view"}
              />
            </div>
          </div>
          <div className={styles.form}>
            <FormControl fullWidth>
              <CategoryField
                selectedCategory={selectedCategory}
                onChange={(selected: CategorySelect | null) =>
                  setSelectedCategory(selected)
                }
              />
            </FormControl>
          </div>

          <div className={styles.form}>
            <TextField
              minRows={4}
              fullWidth
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              variant="outlined"
              slotProps={
                mode === "view" ? { htmlInput: { readOnly: true } } : undefined
              }
            />
          </div>

          <div className={styles.form}>
            <TextField
              minRows={4}
              fullWidth
              label="Рекомендации по уходу"
              value={care}
              onChange={(e) => setCare(e.target.value)}
              multiline
              variant="outlined"
              slotProps={
                mode === "view" ? { htmlInput: { readOnly: true } } : undefined
              }
            />
          </div>
          <div className={`${styles.formsCollection} ${styles.form}`}>
            <TextField
              label="Цена, руб."
              variant="outlined"
              fullWidth
              type="number"
              value={price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handlePriceChange(e)
              }
              slotProps={
                mode === "view" ? { htmlInput: { readOnly: true } } : undefined
              }
            />

            <TextField
              label="Скидка, %"
              fullWidth
              variant="outlined"
              type="number"
              value={discount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDiscountChange(e)
              }
              slotProps={
                mode === "view" ? { htmlInput: { readOnly: true } } : undefined
              }
            />

            <TextField
              value={resultPrice}
              disabled
              aria-readonly
              fullWidth
              label="Итоговая цена, руб."
              variant="outlined"
              type="number"
              slotProps={
                mode === "view" ? { htmlInput: { readOnly: true } } : undefined
              }
            />
          </div>
          <div className={styles.form}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setSizesDialogOpen(true)}
            >
              Размеры товара
            </Button>
            <SizesDialog
              readonly={mode === "view"}
              open={sizesDialogOpen}
              initialPSizes={productSizes}
              setInitialPSizes={setProductSizes}
              handleClose={() => setSizesDialogOpen(false)}
            />
          </div>
          <div className={styles.form}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setCharsDialogOpen(true)}
            >
              Характеристики товара
            </Button>
            <CharacteristicsDialog
              readonly={mode === "view"}
              open={charsDialogOpen}
              handleClose={() => setCharsDialogOpen(false)}
              initialCharacteristics={productChars}
              setInitialCharacteristics={setProductChars}
            />
          </div>
          {mode !== "view" && (
            <Button
              variant="contained"
              color="success"
              onClick={saveProduct}
              fullWidth
            >
              Сохранить
            </Button>
          )}
          {mode === "view" && (
            <Button
              href={`/admin/products/edit/${initialProduct?.id}`}
              fullWidth
              variant="contained"
              color="success"
            >
              На страницу редактирвоания
            </Button>
          )}
        </div>
      </Box>
      <Snackbar
        sx={{ mt: 10 }}
        open={successAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setSuccessAlert(false)}
      >
        <Alert
          onClose={() => setSuccessAlert(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Товар создан
        </Alert>
      </Snackbar>

      <Snackbar
        sx={{ mt: 10 }}
        open={errorAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setErrorAlert(false)}
      >
        <Alert
          onClose={() => setErrorAlert(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Ошибка создания товара. {errorMsg}
        </Alert>
      </Snackbar>
    </main>
  );
}
