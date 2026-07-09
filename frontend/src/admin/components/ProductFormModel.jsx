// components/ProductFormModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  IconButton
} from "@mui/material";
import { Close } from "@mui/icons-material";
import showToast from "../../shared/toastMsg/showToast";

const MAX_IMAGES = 10;

const ProductFormModal = ({
  open,
  onClose,
  isEditMode,
  form,
  setForm,
  categories,
  onSubmit,
  loading
}) => {
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (form.images.length + files.length > MAX_IMAGES) {
      showToast("error", `Max ${MAX_IMAGES} images allowed.`);
      return;
    }
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...previews] }));
  };

  const removeImage = (idx) => {
    setForm((prev) => {
      const imgs = [...prev.images];
      if (imgs[idx]?.url && !imgs[idx]?.file) {
        imgs.splice(idx, 1);
      } else {
        URL.revokeObjectURL(imgs[idx]?.url);
        imgs.splice(idx, 1);
      }
      return { ...prev, images: imgs };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? "Edit Product" : "Add New Product"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12}>
            <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleFormChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Description" name="description" value={form.description} onChange={handleFormChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth type="number" label="Price" name="price" value={form.price} onChange={handleFormChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth type="number" label="Discount Price" name="discountPrice" value={form.discountPrice} onChange={handleFormChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth type="number" label="Stock" name="stock" value={form.stock} onChange={handleFormChange} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="cat-label">Category</InputLabel>
              <Select labelId="cat-label" label="Category" name="categoryId" value={form.categoryId} onChange={handleFormChange}>
                {categories?.map((c) => (
                  <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Image Upload Area */}
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Select Images (max {MAX_IMAGES})
              <input hidden accept="image/*" multiple type="file" onChange={handleImageSelect} />
            </Button>
            <Typography variant="body2" ml={2} component="span">
              {form.images?.length || 0} / {MAX_IMAGES} selected
            </Typography>
          </Grid>

          {/* Image Previews Grid */}
          {form.images?.length > 0 && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {form.images.map((img, idx) => (
                  <Grid key={idx} item xs={4} sm={3} md={2} position="relative">
                    <Box
                      component="img"
                      src={img.url || img}
                      alt="preview"
                      sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(idx)}
                      sx={{
                        position: "absolute", top: 4, right: 4,
                        bgcolor: "rgba(0,0,0,0.6)", color: "#fff",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
                      }}
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          {isEditMode ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormModal;