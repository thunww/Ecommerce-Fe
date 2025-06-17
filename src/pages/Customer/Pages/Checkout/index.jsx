import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Avatar,
} from "@mui/material";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingCart,
  FaTruck,
  FaMoneyBillWave,
  FaMobile,
  FaWallet,
  FaCheck,
  FaEdit,
  FaGift,
  FaShieldAlt,
} from "react-icons/fa";
import { MdPayment, MdLocalShipping } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { clearCart } from "../../../../redux/slices/cartSlice";
import { fetchAllAddresses } from "../../../../redux/addressSlice";
import DefaultAddress from "../Address/DefaultAddress";
import orderApi from "../../../../api/orderApi";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const selectedItemIds = useSelector((state) => state.cart.selectedItems);
  const { coupon, discount } = useSelector((state) => state.cart);

  const user = useSelector((state) => state.auth.user);
  const allAddresses = useSelector((state) => state.addresses.addresses);

  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    recipient_name: "",
    phone: "",
    address_line: "",
    ward: "",
    district: "",
    city: "",
    payment_method: "cod",
  });

  const selectedProducts = useCallback(() => {
    return cartItems.filter((item) =>
      selectedItemIds.includes(item.cart_item_id)
    );
  }, [cartItems, selectedItemIds]);

  const totalAmount = selectedProducts().reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0


  );


  useEffect(() => {
    dispatch(fetchAllAddresses());
  }, [dispatch]);

  useEffect(() => {
    const defaultAddr = allAddresses.find((addr) => addr.is_default);
    if (defaultAddr) {
      setSelectedAddress(defaultAddr);
      setFormData((prev) => ({
        ...prev,
        recipient_name: defaultAddr.recipient_name || "",
        phone: defaultAddr.phone,
        address_line: defaultAddr.address_line,
        ward: defaultAddr.ward,
        district: defaultAddr.district,
        city: defaultAddr.city,
      }));
    } else {
      setSelectedAddress(null);
    }
  }, [allAddresses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user || !user.user_id) {
        toast.error("Vui lòng đăng nhập để đặt hàng");
        navigate("/login");
        return;
      }

      const selectedItems = selectedProducts();
      if (selectedItems.length === 0) {
        toast.error("Vui lòng chọn sản phẩm để đặt hàng");
        return;
      }

      if (!selectedAddress) {
        toast.error(
          "Chưa có địa chỉ mặc định. Vui lòng thêm địa chỉ mặc định trong hồ sơ của bạn."
        );
        navigate("/my-account/addresses");
        return;
      }
      const totalAmountAfterDiscount = totalAmount - discount;
      console.log("Total amount after discount:", totalAmountAfterDiscount);
      const orderData = {
        user_id: user.user_id,
        order_items: selectedItems.map((item) => ({
          product_id: item.product.product_id,
          variant_id: item.variant_id || item.variant?.variant_id || null,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          variant_info: JSON.stringify({
            size: item.size || null,
            color: item.color || null,
            material: item.material || null,
          }),
        })),
        shipping_address: {
          address_id: selectedAddress.address_id,
        },
        total_amount: totalAmountAfterDiscount,
        shipping_fee: 0,
        payment_method: formData.payment_method,
        discount_amount: coupon?.discount_amount || 0,
        coupon_code: coupon?.code || null,
      };

      const response = await orderApi.createOrder(orderData);
      console.log("Order response:", response.data);
      if (response.data) {
        if (formData.payment_method === "vnpay" && response.data.payment_url) {
          window.location.href = response.data.payment_url;
        } else {
          toast.success("Đặt hàng thành công!");
          dispatch(clearCart());
          navigate("/my-account/orders");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const paymentMethods = [
    {
      value: "cod",
      label: "Thanh toán khi nhận hàng",
      icon: <FaMoneyBillWave />,
      description: "Thanh toán bằng tiền mặt khi nhận hàng",
      color: "#52c41a",
    },
    {
      value: "momo",
      label: "Ví MoMo",
      icon: <FaMobile />,
      description: "Thanh toán qua ví điện tử MoMo",
      color: "#d91465",
    },
    {
      value: "vnpay",
      label: "VNPay",
      icon: <FaCreditCard />,
      description: "Thanh toán qua cổng VNPay",
      color: "#1890ff",
    },
  ];

  if (selectedProducts().length === 0) {
    return (
      <Box
        className="checkout-container"
        sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            backgroundColor: "white",
          }}
        >
          <FaShoppingCart size={64} color="#ccc" style={{ marginBottom: 16 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Không có sản phẩm nào được chọn. Vui lòng quay lại giỏ hàng để chọn
            sản phẩm.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<FaShoppingCart />}
            onClick={() => navigate("/cart")}
            sx={{
              backgroundColor: "#ee4d2d",
              "&:hover": { backgroundColor: "#d73211" },
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Quay lại giỏ hàng
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      className="checkout-container"
      sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", p: 2 }}
    >
      {/* Header */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: "white" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <FaShoppingCart color="#ee4d2d" size={24} />
          <Typography variant="h5" fontWeight="bold" color="#ee4d2d">
            Thanh toán
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Shipping Address */}
          <Paper elevation={0} sx={{ mb: 2, backgroundColor: "white" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <FaMapMarkerAlt color="#ee4d2d" />
                <Typography variant="h6" fontWeight="bold" color="#ee4d2d">
                  Địa Chỉ Nhận Hàng
                </Typography>
              </Box>
            </Box>
            <CardContent>
              <DefaultAddress />
              {!selectedAddress && (
                <Alert
                  severity="warning"
                  sx={{
                    mt: 2,
                    "& .MuiAlert-icon": { color: "#faad14" },
                    backgroundColor: "#fff7e6",
                    border: "1px solid #ffd591",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">
                      Chưa có địa chỉ mặc định
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => navigate("/my-account/addresses")}
                      sx={{
                        textTransform: "none",
                        color: "#ee4d2d",
                        fontWeight: 600,
                      }}
                    >
                      Thêm địa chỉ
                    </Button>
                  </Box>
                </Alert>
              )}
            </CardContent>
          </Paper>

          {/* Products */}
          <Paper elevation={0} sx={{ mb: 2, backgroundColor: "white" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <BiPackage color="#ee4d2d" />
                <Typography variant="h6" fontWeight="bold" color="#ee4d2d">
                  Sản Phẩm
                </Typography>
                <Chip
                  label={`${selectedProducts().length} sản phẩm`}
                  size="small"
                  sx={{
                    backgroundColor: "#fff2e8",
                    color: "#ee4d2d",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
            <CardContent>
              {selectedProducts().map((item, index) => (
                <Box key={item.cart_item_id}>
                  <Box display="flex" alignItems="center" py={2}>
                    <Avatar
                      src={
                        item.variant?.image_url ||
                        item.product?.product_image ||
                        "/default-product.png"
                      }
                      alt={item.product?.product_name || "Sản phẩm"}
                      sx={{ width: 80, height: 80, mr: 2, borderRadius: 1 }}
                      variant="rounded"
                    />
                    <Box flex={1}>
                      <Typography fontWeight="600" sx={{ mb: 0.5 }}>
                        {item.product_name}
                      </Typography>
                      {(item.size || item.color) && (
                        <Box display="flex" gap={1} mb={1}>
                          {item.size && (
                            <Chip
                              label={`Size: ${item.size}`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: "0.7rem" }}
                            />
                          )}
                          {item.color && (
                            <Chip
                              label={`Màu: ${item.color}`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>
                      )}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(item.price)} × {item.quantity}
                        </Typography>
                        <Typography color="#ee4d2d" fontWeight="bold">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {index < selectedProducts().length - 1 && <Divider />}
                </Box>
              ))}

              {/* Shipping */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <FaTruck color="#52c41a" />
                    <Typography variant="body2" fontWeight="600">
                      Phí vận chuyển
                    </Typography>
                    <Chip
                      label="Miễn phí"
                      size="small"
                      sx={{
                        backgroundColor: "#f6ffed",
                        color: "#52c41a",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography color="#52c41a" fontWeight="bold">
                    ₫0
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Paper>

          {/* Payment Method */}
          <Paper elevation={0} sx={{ backgroundColor: "white" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <MdPayment color="#ee4d2d" />
                <Typography variant="h6" fontWeight="bold" color="#ee4d2d">
                  Phương Thức Thanh Toán
                </Typography>
              </Box>
            </Box>
            <CardContent>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                >
                  {paymentMethods.map((method) => (
                    <Paper
                      key={method.value}
                      variant="outlined"
                      sx={{
                        mb: 1,
                        p: 2,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border:
                          formData.payment_method === method.value
                            ? "2px solid #ee4d2d"
                            : "1px solid #e8e8e8",
                        backgroundColor:
                          formData.payment_method === method.value
                            ? "#fff2e8"
                            : "white",
                        "&:hover": {
                          borderColor: "#ee4d2d",
                          backgroundColor: "#fff2e8",
                        },
                      }}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          payment_method: method.value,
                        }))
                      }
                    >
                      <FormControlLabel
                        value={method.value}
                        control={<Radio sx={{ color: method.color }} />}
                        label={
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            width="100%"
                          >
                            <Box
                              sx={{
                                color: method.color,
                                fontSize: "1.2rem",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {method.icon}
                            </Box>
                            <Box flex={1}>
                              <Typography fontWeight="600">
                                {method.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {method.description}
                              </Typography>
                            </Box>
                            {formData.payment_method === method.value && (
                              <FaCheck color="#ee4d2d" />
                            )}
                          </Box>
                        }
                        sx={{ margin: 0, width: "100%" }}
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Paper>
        </Grid>

        {/* Right Column - Order Summary */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{ position: "sticky", top: 20, backgroundColor: "white" }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}>
              <Typography variant="h6" fontWeight="bold">
                Thông tin đơn hàng
              </Typography>
            </Box>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Tạm tính:</Typography>
                <Typography>{formatPrice(totalAmount)}</Typography>
              </Box>

              {coupon?.discount_amount > 0 && (
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FaGift color="#52c41a" size={14} />
                    <Typography variant="body2">
                      Voucher ({coupon.code})
                    </Typography>
                  </Box>
                  <Typography color="#52c41a" fontWeight="600">
                    -{formatPrice(coupon.discount_amount)}
                  </Typography>
                </Box>
              )}

              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Phí vận chuyển:</Typography>
                <Typography color="#52c41a">Miễn phí</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Tổng thanh toán:
                </Typography>
                <Typography variant="h6" color="#ee4d2d" fontWeight="bold">

                  {formatPrice(totalAmount - discount)}
                </Typography>
              </Box>

              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !selectedAddress}
                sx={{
                  backgroundColor: "#ee4d2d",
                  "&:hover": { backgroundColor: "#d73211" },
                  "&:disabled": { backgroundColor: "#ccc" },
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  height: 48,
                  fontSize: "1rem",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <FaShieldAlt style={{ marginRight: 8 }} />
                    Đặt hàng
                  </>
                )}
              </Button>

              <Box
                mt={2}
                p={2}
                sx={{ backgroundColor: "#f8f9fa", borderRadius: 1 }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Bằng việc tiến hành Đặt Mua, bạn đồng ý với Điều khoản Dịch vụ
                </Typography>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
