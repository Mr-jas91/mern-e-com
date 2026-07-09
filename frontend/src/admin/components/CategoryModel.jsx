// components/CategoryModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const CategoryModal = ({ open, onClose, catName, setCatName, onSubmit, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          fullWidth
          label="Category Name"
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit} disabled={loading || !catName.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;