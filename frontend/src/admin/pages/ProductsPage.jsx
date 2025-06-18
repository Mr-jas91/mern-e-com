import React, { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Add, Delete, Edit, Close } from "@mui/icons-material";
import SidebarContent from "../components/Sidebar";
import { MainContent } from "../utills/Style";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  getAdminProducts,
  updateProductDetails,
  addCategory,
  fetchCategories,
  deleteProduct
} from "../../redux/reducers/productReducer";
import showToast from "../../shared/toastMsg/showToast";

const MAX_IMAGES = 10;

const ProductPage = () => {
  const dispatch = useDispatch();
  const { products, categories, loading, error } = useSelector(
    (state) => state.products
  );

  // Dialog and modal state
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openCatDialog, setOpenCatDialog] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    categoryId: "",
    images: []
  });

  const [cat, setCat] = useState({ name: "" });

  // Fetch categories and products on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getAdminProducts());
  }, [dispatch]);

  // Open add/edit product modal
  const openAddDialog = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "",
      categoryId: "",
      images: []
    });
    setIsEditMode(false);
    setCurrentId(null);
    setOpenDialog(true);
  };

  const openEditDialog = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.price - (product.discount || 0),
      stock: product.stock,
      categoryId: product.category?._id || "",
      images: product.images.map((img) => ({ url: img }))
    });
    setIsEditMode(true);
    setCurrentId(product._id);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setIsEditMode(false);
    setCurrentId(null);
  };

  // Category dialog helpers
  const openAddCategoryDialog = () => {
    setCat({ name: "" });
    setOpenCatDialog(true);
  };

  const handleCatClose = () => setOpenCatDialog(false);

  const handleCatInputChange = (e) => {
    setCat({ name: e.target.value });
  };

  const handleCatSubmit = async () => {
    if (!cat.name.trim()) {
      showToast("error", "Category name is required.");
      return;
    }

    try {
      await dispatch(addCategory({ name: cat.name }));
      showToast("success", "Category added successfully");
      dispatch(fetchCategories()); // Refresh categories list
      handleCatClose();
    } catch (err) {
      showToast("error", "Failed to add category");
    }
  };

  // Delete product handlers
  const handleDeleteOpen = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => setOpenDeleteDialog(false);

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteProduct(deleteId));
      showToast("success", "Product deleted successfully");
      dispatch(getAdminProducts()); // Refresh products list
    } catch (err) {
      showToast("error", "Failed to delete product");
    }
    handleDeleteClose();
  };

  // Form input change handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Image upload with preview
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
        // Existing image (has URL but no file object)
        imgs.splice(idx, 1);
      } else {
        URL.revokeObjectURL(imgs[idx]?.url);
        imgs.splice(idx, 1);
      }
      return { ...prev, images: imgs };
    });
  };
  const handleFormSubmit = async () => {
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      images
    } = form;

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !discountPrice ||
      !stock ||
      !categoryId ||
      images.length === 0
    ) {
      showToast("error", "All fields and at least one image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);

    // Only append new images (files)
    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    try {
      if (isEditMode) {
        await dispatch(updateProductDetails({ id: currentId, formData }));
        showToast("success", "Product updated successfully");
      } else {
        await dispatch(addProduct(formData));
        showToast("success", "Product added successfully");
      }
      dispatch(getAdminProducts()); // Refresh products list
      closeDialog();
    } catch (err) {
      showToast(
        "error",
        isEditMode ? "Failed to update product" : "Failed to add product"
      );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SidebarContent />
      <MainContent>
        <Toolbar />
        <Typography variant="h4" textAlign="center" mb={2}>
          Products
        </Typography>

        {/* Buttons */}
        <Box p={2}>
          <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openAddDialog}
            >
              Add Product
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openAddCategoryDialog}
            >
              Add Category
            </Button>
          </Box>

          {/* Loading or Error */}
          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Image",
                    "Name",
                    "Description",
                    "Price",
                    "Discount Price",
                    "Stock",
                    "Category",
                    "Actions"
                  ].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No Product Available
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((p) => (
                    <TableRow key={p._id} hover sx={{ height: "120px" }}>
                      {" "}
                      {/* Fixed row height */}
                      <TableCell sx={{ width: "120px" }}>
                        {" "}
                        {/* Fixed image cell width */}
                        <Box
                          component="img"
                          src={p.images[0]}
                          alt="preview"
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 1
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {p.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "250px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {p.description}
                      </TableCell>
                      <TableCell sx={{ width: "100px" }}>
                        {" "}
                        {/* Fixed price column */}
                        {p.price}
                      </TableCell>
                      <TableCell sx={{ width: "100px" }}>
                        {" "}
                        {/* Fixed discount column */}
                        {p.discountPrice || p.price - (p.discount || 0)}
                      </TableCell>
                      <TableCell sx={{ width: "80px" }}>
                        {" "}
                        {/* Fixed stock column */}
                        {p.stock}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "120px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {p.category?.name}
                      </TableCell>
                      <TableCell align="right" sx={{ width: "120px" }}>
                        {" "}
                        {/* Fixed action column */}
                        <IconButton
                          onClick={() => openEditDialog(p)}
                          size="small"
                        >
                          <Edit fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteOpen(p._id)}
                          size="small"
                        >
                          <Delete fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Box>

        {/* -------------------- ADD / EDIT PRODUCT MODAL -------------------- */}
        <Dialog open={openDialog} onClose={closeDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {isEditMode ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} mt={0.5}>
              {/* ----- text inputs ----- */}
              {[
                { label: "Name", name: "name", xs: 12 },
                {
                  label: "Description",
                  name: "description",
                  xs: 12,
                  props: { multiline: true, rows: 3 }
                },
                { label: "Price", name: "price", xs: 4, type: "number" },
                {
                  label: "Discount Price",
                  name: "discountPrice",
                  xs: 4,
                  type: "number"
                },
                { label: "Stock", name: "stock", xs: 4, type: "number" }
              ].map(({ label, name, xs, type, props }) => (
                <Grid key={name} item xs={xs}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    type={type || "text"}
                    value={form[name]}
                    onChange={handleFormChange}
                    {...props}
                  />
                </Grid>
              ))}

              {/* ----- category select ----- */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="cat-label">Category</InputLabel>
                  <Select
                    labelId="cat-label"
                    label="Category"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleFormChange}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* ----- image uploader ----- */}
              <Grid item xs={12}>
                <Button variant="outlined" component="label">
                  Select Images (max {MAX_IMAGES})
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleImageSelect}
                  />
                </Button>
                <Typography variant="body2" ml={2} component="span">
                  {form.images.length} / {MAX_IMAGES} selected
                </Typography>
              </Grid>

              {form.images.length > 0 && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {form.images.map((img, idx) => (
                      <Grid
                        key={idx}
                        item
                        xs={4}
                        sm={3}
                        md={2}
                        position="relative"
                      >
                        <Box
                          component="img"
                          src={img.url || img}
                          alt="preview"
                          sx={{
                            width: "100%",
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 1,
                            transition: "filter 0.3s"
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(idx)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "#fff",
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
            <Button onClick={closeDialog}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleFormSubmit}
              disabled={loading}
            >
              {isEditMode ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* -------------------- ADD CATEGORY MODAL -------------------- */}
        <Dialog
          open={openCatDialog}
          onClose={handleCatClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Add Category</DialogTitle>
          <DialogContent dividers>
            <TextField
              autoFocus
              fullWidth
              label="Category Name"
              value={cat.name}
              onChange={handleCatInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCatClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCatSubmit}
              disabled={!cat.name.trim()}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* -------------------- DELETE_CONFIRM MODAL -------------------- */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteClose}
          maxWidth="xs"
        >
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </MainContent>
    </Box>
  );
};

export default ProductPage;
