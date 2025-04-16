import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder, clearOrderError, clearOrderSuccess } from '../../../../redux/slices/orderSlice';
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

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const selectedItemIds = useSelector(state => state.cart.selectedItems);
    const { loading, error, success } = useSelector(state => state.order);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    // Log để kiểm tra dữ liệu
    console.log('Cart Items:', cartItems);
    console.log('Selected IDs:', selectedItemIds);

    // Lọc ra các sản phẩm đã được chọn
    const selectedProducts = cartItems.filter(item => selectedItemIds.includes(item.cart_item_id));
    console.log('Selected Products:', selectedProducts);

    // Tính tổng tiền
    const calculateTotal = () => {
        return selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Lấy danh sách tỉnh/thành phố
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/?depth=1');
                const data = await response.json();
                setProvinces(data);
            } catch (err) {
                console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', err);
            }
        };
        fetchProvinces();
    }, []);

    // Lấy danh sách quận/huyện khi chọn tỉnh
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
                    const data = await response.json();
                    setDistricts(data.districts || []);
                    setSelectedDistrict('');
                    setWards([]);
                    setSelectedWard('');
                } catch (err) {
                    console.error('Lỗi khi lấy danh sách quận/huyện:', err);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
            setSelectedDistrict('');
            setWards([]);
            setSelectedWard('');
        }
    }, [selectedProvince]);

    // Lấy danh sách phường/xã khi chọn quận
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
                    const data = await response.json();
                    setWards(data.wards || []);
                    setSelectedWard('');
                } catch (err) {
                    console.error('Lỗi khi lấy danh sách phường/xã:', err);
                }
            };
            fetchWards();
        } else {
            setWards([]);
            setSelectedWard('');
        }
    }, [selectedDistrict]);

    // Xử lý khi đặt hàng thành công
    useEffect(() => {
        if (success) {
            navigate('/my-account/orders');
            dispatch(clearOrderSuccess());
        }
    }, [success, navigate, dispatch]);

    // Clear error khi component unmount
    useEffect(() => {
        return () => {
            dispatch(clearOrderError());
        };
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const orderData = {
            address: address,
            payment_method: formData.get('payment_method'),
            items: selectedProducts.map(item => ({
                product_id: item.cart_item_id,
                quantity: item.quantity
            }))
        };

        dispatch(createOrder(orderData));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (selectedProducts.length === 0) {
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
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
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
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            variant="outlined"
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth>
                                            <InputLabel>Tỉnh/Thành phố</InputLabel>
                                            <Select
                                                value={selectedProvince}
                                                onChange={(e) => setSelectedProvince(e.target.value)}
                                                label="Tỉnh/Thành phố"
                                            >
                                                {provinces.map(province => (
                                                    <MenuItem key={province.code} value={province.code}>
                                                        {province.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth>
                                            <InputLabel>Quận/Huyện</InputLabel>
                                            <Select
                                                value={selectedDistrict}
                                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                                label="Quận/Huyện"
                                                disabled={!selectedProvince}
                                            >
                                                {districts.map(district => (
                                                    <MenuItem key={district.code} value={district.code}>
                                                        {district.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth>
                                            <InputLabel>Phường/Xã</InputLabel>
                                            <Select
                                                value={selectedWard}
                                                onChange={(e) => setSelectedWard(e.target.value)}
                                                label="Phường/Xã"
                                                disabled={!selectedDistrict}
                                            >
                                                {wards.map(ward => (
                                                    <MenuItem key={ward.code} value={ward.code}>
                                                        {ward.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Box mt={4}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <PaymentIcon sx={{ mr: 1 }} />
                                        <Typography variant="h6">Phương thức thanh toán</Typography>
                                    </Box>

                                    <FormControl component="fieldset">
                                        <RadioGroup name="payment_method" defaultValue="cod">
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

                                {error && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {error}
                                    </Alert>
                                )}

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
                                Đơn hàng của bạn ({selectedProducts.length} sản phẩm)
                            </Typography>

                            <Box mb={2}>
                                {selectedProducts.map(item => (
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
                                    {formatPrice(calculateTotal())}
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
                                    {formatPrice(calculateTotal())}
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