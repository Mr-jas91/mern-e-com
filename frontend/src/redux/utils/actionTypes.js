// user action type
export const AUTH_REGISTER = "auth/register";
export const AUTH_LOGIN = "auth/login";
export const AUTH_LOGOUT = "auth/logout";
export const AUTH_GET_CURRENT_USER = "auth/getCurrentUser";
export const AUTH_GET_USER_PROFILE = "auth/userProfile";

// product action type
export const fetchAllProducts = "products/fetchAll";
export const fetchProduct = "products/fetchById";
export const fetchByCategory = "products/fetchByCategory";

// categories action type
export const fetchCategories = "categories/fetchAll";

//cart action type
export const add_ToCart = "cart/add";
export const get_Cart = "cart/get";
export const update_Cart = "cart/update";
export const remove_FromCart = "cart/remove";

// order action type

export const create_Order = "order/create";
export const get_Orders = "order/get";
export const update_Order = "order/update";
export const order_Details = "order/details";
export const order_Cancel = "order/cancel";

// admin action type
export const register_admin = "admin/register";
export const login_admin = "admin/login";
export const logout_admin = "admin/logout";
export const admin_profile = "admin/profile";
export const current_admin = "admin/currentAdmin";
