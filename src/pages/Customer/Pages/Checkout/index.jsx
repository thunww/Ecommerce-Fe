import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    Alert,
    CircularProgress,
    Select,
    MenuItem,
    InputLabel,
    Paper
} from '@mui/material';
import {
    LocalShipping as ShippingIcon,
    Payment as PaymentIcon,
    ShoppingCart as CartIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import "./Checkout.css";
import { clearCart } from '../../../../redux/slices/cartSlice';
import orderApi from '../../../../api/orderApi';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const selectedItemIds = useSelector(state => state.cart.selectedItems);
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.auth.user);
    const cart = useSelector(state => state.cart);

    // Debug user info
    console.log('User info from Redux:', user);

    // State cho form
    const [formData, setFormData] = useState({
        phone: '',
        address_line: '',
        city: '',
        province: '',
        payment_method: 'cod'
    });

    // Lọc ra các sản phẩm đã được chọn
    const selectedProducts = useCallback(() => {
        return cartItems.filter(item => selectedItemIds.includes(item.cart_item_id));
    }, [cartItems, selectedItemIds]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Bắt đầu xử lý đặt hàng...');
        setLoading(true);

        try {
            // Kiểm tra đăng nhập
            if (!user || !user.user_id) {
                console.log('User not logged in or missing user_id:', user);
                toast.error('Vui lòng đăng nhập để đặt hàng');
                navigate('/login');
                return;
            }

            // Lấy user_id từ user object
            const user_id = user.user_id;
            console.log('User ID for order:', user_id);

            // Lấy danh sách sản phẩm đã chọn
            const selectedItems = selectedProducts();
            console.log('Sản phẩm đã chọn:', selectedItems);

            if (selectedItems.length === 0) {
                toast.error('Vui lòng chọn sản phẩm để đặt hàng');
                return;
            }

            // Tạo dữ liệu đơn hàng
            const orderData = {
                user_id: user_id,
                order_items: selectedItems.map(item => ({
                    product_id: item.product.product_id,
                    variant_id: item.variant_id || item.variant?.variant_id || null,
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount || 0,
                    variant_info: JSON.stringify({
                        size: item.size || null,
                        color: item.color || null,
                        material: item.material || null
                    })
                })),
                shipping_address: {
                    user_id: user_id,
                    phone: formData.phone,
                    address_line: formData.address_line,
                    city: formData.city,
                    province: formData.province
                },
                total_amount: selectedItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0),
                shipping_fee: 0,
                payment_method: formData.payment_method
            };

            console.log('Dữ liệu đơn hàng trước khi gửi:', JSON.stringify(orderData, null, 2));
            console.log('Đang gửi API...');

            const response = await orderApi.createOrder(orderData);
            console.log('Phản hồi từ server:', response);

            if (response.data) {
                toast.success('Đặt hàng thành công!');
                dispatch(clearCart());
                navigate('/my-account/orders');
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            console.error('Chi tiết lỗi:', error.response?.data);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (selectedProducts().length === 0) {
        return (
            <Box className="checkout-container" sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Không có sản phẩm nào được chọn. Vui lòng quay lại giỏ hàng để chọn sản phẩm.
                </Alert>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CartIcon />}
                    onClick={() => navigate('/cart')}
                >
                    Quay lại giỏ hàng
                </Button>
            </Box>
        );
    }

    return (
        <Box className="checkout-container">
            <Typography variant="h4" gutterBottom>
                Thanh toán
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <ShippingIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Thông tin giao hàng</Typography>
                            </Box>

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Số điện thoại"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Địa chỉ"
                                            name="address_line"
                                            value={formData.address_line}
                                            onChange={handleChange}
                                            variant="outlined"
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Thành phố"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Tỉnh"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>

                                <Box mt={4}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <PaymentIcon sx={{ mr: 1 }} />
                                        <Typography variant="h6">Phương thức thanh toán</Typography>
                                    </Box>

                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            name="payment_method"
                                            value={formData.payment_method}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel
                                                value="cod"
                                                control={<Radio />}
                                                label="Thanh toán khi nhận hàng (COD)"
                                            />
                                            <FormControlLabel
                                                value="momo"
                                                control={<Radio />}
                                                label="Ví điện tử MoMo"
                                            />
                                            <FormControlLabel
                                                value="vnpay"
                                                control={<Radio />}
                                                label="VNPay"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{ mt: 3 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Đặt hàng'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Đơn hàng của bạn ({selectedProducts().length} sản phẩm)
                            </Typography>

                            <Box mb={2}>
                                {selectedProducts().map(item => (
                                    <Paper
                                        key={item.cart_item_id}
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 1,
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <Box display="flex" alignItems="flex-start">
                                            <Box
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    mr: 2,
                                                    borderRadius: 1,
                                                    overflow: 'hidden',
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            >
                                                <img
                                                    src={item.product_image || item.image_url}
                                                    alt={item.product_name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </Box>
                                            <Box flex={1}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        mb: 1,
                                                        fontSize: '1rem'
                                                    }}
                                                >
                                                    {item.product_name}
                                                </Typography>
                                                <Box sx={{ mb: 1 }}>
                                                    {item.size && (
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                mr: 2,
                                                                bgcolor: '#e3f2fd',
                                                                px: 1,
                                                                py: 0.5,
                                                                borderRadius: 1,
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            Size: {item.size}
                                                        </Typography>
                                                    )}
                                                    {item.color && (
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                mr: 2,
                                                                bgcolor: '#e8f5e9',
                                                                px: 1,
                                                                py: 0.5,
                                                                borderRadius: 1,
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            Màu: {item.color}
                                                        </Typography>
                                                    )}
                                                    {item.material && (
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                bgcolor: '#f3e5f5',
                                                                px: 1,
                                                                py: 0.5,
                                                                borderRadius: 1,
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            Chất liệu: {item.material}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    mt={2}
                                                >
                                                    <Box display="flex" alignItems="center">
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                color: '#ee4d2d',
                                                                fontWeight: 'bold',
                                                                fontSize: '1.1rem'
                                                            }}
                                                        >
                                                            {formatPrice(item.price)}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                mx: 2,
                                                                color: '#757575',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            Số lượng: {item.quantity}
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            color: '#ee4d2d',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {formatPrice(item.price * item.quantity)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>Tạm tính:</Typography>
                                <Typography sx={{ color: '#ee4d2d', fontWeight: 'bold' }}>
                                    {formatPrice(selectedProducts().reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0))}
                                </Typography>
                            </Box>

                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>Phí vận chuyển:</Typography>
                                <Typography sx={{ color: '#ee4d2d', fontWeight: 'bold' }}>
                                    {formatPrice(0)}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6">Tổng cộng:</Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: '#ee4d2d',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {formatPrice(selectedProducts().reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0))}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Checkout; 