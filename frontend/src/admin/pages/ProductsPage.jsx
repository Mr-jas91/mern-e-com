// pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box, CssBaseline, Toolbar, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Dialog, DialogTitle, DialogActions, CircularProgress, Card, IconButton, Paper, TableContainer
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import SidebarContent from "../components/Sidebar";
import { MainContent } from "../utills/Style";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  getAdminProducts,
  fetchAdminCategories, // Swapped seamlessly to correct Admin category thunk reference
  deleteProduct
} from "../../redux/reducers/productReducer";
import ProductFormModal from "../components/ProductFormModel.jsx";
import CategoryModal from "../components/CategoryModel.jsx";
import ProductServices from "../../user/services/productService.js"; // Standard endpoint link bindings
import showToast from "../../shared/toastMsg/showToast";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { products, categories, loading, error } = useSelector((state) => state.products);

  // Modal controls
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openCatDialog, setOpenCatDialog] = useState(false);

  // Local Form payloads
  const [form, setForm] = useState({ name: "", description: "", price: "", discountPrice: "", stock: "", categoryId: "", images: [] });
  const [catName, setCatName] = useState("");

  useEffect(() => {
    dispatch(fetchAdminCategories());
    dispatch(getAdminProducts());
  }, [dispatch]);

  const openAddDialog = () => {
    setForm({ name: "", description: "", price: "", discountPrice: "", stock: "", categoryId: "", images: [] });
    setIsEditMode(false);
    setCurrentId(null);
    setOpenDialog(true);
  };

  const openEditDialog = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || product.price - (product.discount || 0),
      stock: product.stock,
      categoryId: product.category?._id || "",
      images: product.images?.map((img) => ({ url: img })) || []
    });
    setIsEditMode(true);
    setCurrentId(product._id);
    setOpenDialog(true);
  };

  const handleCatSubmit = async () => {
    try {
      await ProductServices.addCategory({ name: catName });
      showToast("success", "Category added successfully");
      dispatch(fetchAdminCategories());
      setOpenCatDialog(false);
      setCatName("");
    } catch (err) {
      showToast("error", err || "Failed to add category");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteProduct(deleteId)).unwrap();
      showToast("success", "Product deleted successfully");
      dispatch(getAdminProducts());
    } catch (err) {
      showToast("error", err || "Failed to delete product");
    }
    setOpenDeleteDialog(false);
  };

  const handleFormSubmit = async () => {
    const { name, description, price, discountPrice, stock, categoryId, images } = form;
    if (!name.trim() || !description.trim() || !price || !stock || !categoryId || images.length === 0) {
      showToast("error", "All fields and at least one image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice || 0);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);

    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    try {
      if (isEditMode) {
        // Direct administrative service routing bypass as mapped down your architecture
        await ProductServices.updateProduct({ id: currentId, formData });
        showToast("success", "Product updated successfully");
      } else {
        await dispatch(addProduct(formData)).unwrap();
        showToast("success", "Product added successfully");
      }
      dispatch(getAdminProducts());
      setOpenDialog(false);
    } catch (err) {
      showToast("error", err || "Operation execution failed");
    }
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f8f9fa", minHeight: "100vh", width: "100%" }}>
      <CssBaseline />
      <SidebarContent />
      <MainContent sx={{ flexGrow: 1, p: 3, boxSizing: "border-box" }}>
        <Toolbar />
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>Catalog Inventory Management</Typography>

        <Box display="flex" gap={2} mb={3}>
          <Button variant="contained" startIcon={<Add />} onClick={openAddDialog}>Add Product</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCatDialog(true)}>Add Category</Button>
        </Box>

        {loading && products.length === 0 ? (
          <Box textAlign="center" py={4}><CircularProgress /></Box>
        ) : (
          <Card sx={{ borderRadius: "12px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" }}>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#fcfcfc" }}>
                  <TableRow>
                    {["Image", "Name", "Description", "Price", "Discount Price", "Stock", "Category", "Actions"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: "bold" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow><TableCell colSpan={8} align="center">No Products Available</TableCell></TableRow>
                  ) : (
                    products.map((p) => (
                      <TableRow key={p._id} hover sx={{ height: "110px" }}>
                        <TableCell sx={{ width: "110px" }}>
                          <Box component="img" src={p.images?.[0]} alt="preview" sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }} />
                        </TableCell>
                        <TableCell sx={{ maxWidth: "140px", noWrap: true, overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</TableCell>
                        <TableCell sx={{ maxWidth: "220px", noWrap: true, overflow: "hidden", textOverflow: "ellipsis", color: "text.secondary" }}>{p.description}</TableCell>
                        <TableCell>₹{(p.price || 0).toLocaleString()}</TableCell>
                        <TableCell>₹{(p.discountPrice || p.price - (p.discount || 0)).toLocaleString()}</TableCell>
                        <TableCell>{p.stock}</TableCell>
                        <TableCell>{p.category?.name || "N/A"}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => openEditDialog(p)} size="small"><Edit fontSize="small" /></IconButton>
                          <IconButton color="error" onClick={() => { setDeleteId(p._id); setOpenDeleteDialog(true); }} size="small"><Delete fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {/* 📦 Reusable Product Form Modal Component */}
        <ProductFormModal
          open={openDialog} onClose={() => setOpenDialog(false)}
          isEditMode={isEditMode} form={form} setForm={setForm}
          categories={categories} onSubmit={handleFormSubmit} loading={loading}
        />

        {/* 📦 Reusable Category Input Modal Component */}
        <CategoryModal
          open={openCatDialog} onClose={() => setOpenCatDialog(false)}
          catName={catName} setCatName={setCatName} onSubmit={handleCatSubmit} loading={loading}
        />

        {/* Delete Confirmation Box */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogActions>
        </Dialog>
      </MainContent>
    </Box>
  );
};

export default ProductPage;