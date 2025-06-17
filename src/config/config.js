// File cấu hình cho ứng dụng

// Lấy cổng backend từ biến môi trường hoặc mặc định là 8080 cho local
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || "8080";
const API_URL =
  import.meta.env.VITE_API_URL || `http://localhost:${BACKEND_PORT}/api/v1`;

// API URL - sử dụng biến môi trường hoặc fallback về localhost
export const API_BASE_URL = API_URL;

// Upload URL
export const UPLOAD_URL = `${API_BASE_URL}/products/images/upload`;

// Cloudinary config
export const CLOUDINARY_CLOUD_NAME = "your-cloud-name";

// Các cấu hình khác
export const IMAGE_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAFVBMVEX///8kJCQxMTGkpKTFxcXl5eX///+JcKLCAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB0UlEQVR4nO2a0W7DIAxAMRDI//9wt2m3SY1JQR7TVt/TFKnVOYJg7IjwN8PYgmVY/P1w+fNKWPe+s5ThX1nrzw2ywopSWpZSizWMsUp+vbFWnBkXq+5ZsdS9YPVdrLpnxGq92PXJcTWHkYZyiZl5IeIxpVfCnEUcZe15GEEZRpkTIkkLz6Ls2pFu7HMSq7FGrAqoOt6EZrv0QKwNViTQOJ9QPBPOB0uGfIBlIrHU6dBL5YQlLkYcM5a0sjxkLOmmymCJaA7z4NphkAeWRFvn6bCHJBssaQw8VthgSeiG5YkP1iYyQtZ+HRbrzWVbhBOLjdthcVgM9tBuWcNixiIrlltiGRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBdYzLN6xn2D5voLq+kJtTqoOi40r6q5vH9cGrLFa1Bd3N6x62ZJYk1vT9fLsitV2LMw7FgkPMJ/E+gHw4Q7iVADR9QAAAABJRU5ErkJggg==";
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

// URL ảnh mặc định cho sản phẩm
export const DEFAULT_PRODUCT_IMAGE =
  "https://cdn.tgdd.vn/Products/Images/1942/279935/TimerThumb/smart-samsung-4k-43-inch-ua43au7002-(40).jpg";

// Cấu hình định dạng tiền tệ
export const CURRENCY_FORMAT = {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
};
