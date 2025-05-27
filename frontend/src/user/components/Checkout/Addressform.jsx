import React from "react";
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Typography,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  Box
} from "@mui/material";

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const Addressform = ({
  shippingAddress,
  setShippingAddress,
  selectedOption,
  setSelectedOption,
  errors,
  setErrors
}) => {
  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };
  const handlePinCodeChange = (e) => {
    const value = e.target.value;
    if (value.length <= 6) {
      setShippingAddress({ ...shippingAddress, pincode: value });
      setErrors({ ...errors, pincode: "" }); // Clear pincode error
    }
  };

  const handleMobileNoChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setShippingAddress({ ...shippingAddress, mobileNo: value });
      setErrors({ ...errors, mobileNo: "" }); // Clear mobileNo error
    }
  };
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {" "}
      <Typography variant="h5" gutterBottom>
        {" "}
        {/* Larger heading */}
        Shipping Address
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="fullName"
            value={shippingAddress.fullName}
            onChange={handleAddressChange}
            error={!!errors.general}
            helperText={errors.general}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            name="address"
            value={shippingAddress.address}
            onChange={handleAddressChange}
            error={!!errors.general}
            helperText={errors.general}
            multiline // Allow multiple lines for address
            rows={3} // Set initial number of visible rows
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            error={!!errors.general}
            helperText={errors.general}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.state}>
            <InputLabel>State</InputLabel>
            <Select
              name="state"
              value={shippingAddress.state}
              onChange={handleAddressChange}
            >
              {indianStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
            {errors.general && (
              <Typography variant="caption" color="error">
                {errors.general}
              </Typography>
            )}{" "}
            {/* Display error message */}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="PIN Code"
            name="pincode"
            type="text"
            value={shippingAddress.pincode}
            onChange={handlePinCodeChange}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Mobile Number"
            name="mobileNo"
            type="text"
            value={shippingAddress.mobileNo}
            onChange={handleMobileNoChange}
            error={!!errors.mobileNo}
            helperText={errors.mobileNo}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        {" "}
        {/* Use Box for spacing around payment options */}
        <FormControl component="fieldset" fullWidth>
          {" "}
          {/* Full width FormControl */}
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup
            row
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {/* Use map for cleaner rendering */}
            {["COD", "ONLINE_UPI", "DEBIT_CARD"].map((method) => (
              <FormControlLabel
                key={method}
                value={method}
                control={<Radio />}
                label={
                  method === "COD"
                    ? "Cash on Delivery"
                    : method === "ONLINE_UPI"
                    ? "UPI"
                    : "Debit Card"
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default Addressform;
