// ==========================
// ✅ User Authentication Action Types
// ==========================
export const AUTH_REGISTER = "auth/register"; // Register a new user
export const AUTH_LOGIN = "auth/login"; // User login
export const AUTH_LOGOUT = "auth/logout"; // User logout
export const AUTH_GET_CURRENT_USER = "auth/getCurrentUser"; // Fetch logged-in user's basic info
export const AUTH_GET_USER_PROFILE = "auth/userProfile"; // Fetch user's full profile

// ==========================
// ✅ Product Action Types (User-facing)
// ==========================
export const add_Product = "product/add"; // Add a new product
export const fetchAllProducts = "products/fetchAll"; // Fetch all products
export const fetchProduct = "products/fetchById"; // Fetch single product by ID
export const fetchByCategory = "products/fetchByCategory"; // Fetch products filtered by category
export const delete_Product = "product/delete"; // Delete Product by ID
// ==========================
// ✅ Product Action Types (Admin)
// ==========================
export const AdminProducts = "admin/getProducts"; // Admin: fetch all products
export const updateProduct = "admin/update"; // Admin: update product details

// ==========================
// ✅ Category Action Types
// ==========================
export const fetchCategories = "categories/fetchAll"; // Fetch all product categories
export const add_Category = "categories/addCategory"; // Add a new category

// ==========================
// ✅ Cart Action Types
// ==========================
export const add_ToCart = "cart/add"; // Add item to cart
export const get_Cart = "cart/get"; // Get current user's cart
export const update_Cart = "cart/update"; // Update cart items (quantity etc.)
export const remove_FromCart = "cart/remove"; // Remove item from cart

// ==========================
// ✅ Order Action Types
// ==========================
export const create_Order = "order/create"; // Create a new order
export const get_Orders = "order/get"; // Fetch all orders (user/admin)
export const update_Order = "order/update"; // Update order status (admin)
export const order_Details = "order/details"; // Fetch single order details
export const order_Cancel = "order/cancel"; // Cancel an order
export const admin_orders = "admin/orders";
export const admin_order_details = "admin/orderDetails";
export const admin_delivery_status = "admin/deliveryStatus";
// ==========================
// ✅ Admin Authentication & Profile
// ==========================
export const register_admin = "admin/register"; // Admin registration
export const login_admin = "admin/login"; // Admin login
export const logout_admin = "admin/logout"; // Admin logout
export const admin_profile = "admin/profile"; // Get admin profile
export const current_admin = "admin/currentAdmin"; // Get current logged-in admin

// ==========================
// ✅ Transection
// ==========================

export const get_transection = "transection";
