import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
    Box, Card, CardContent, Typography, TextField, Button, Grid, Divider,
    FormControlLabel, Radio, RadioGroup, FormControl, CircularProgress, Alert
} from '@mui/material';
import {
    LocalShipping as ShippingIcon,
    Payment as PaymentIcon,
    ShoppingCart as CartIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import { clearCart } from '../../../../redux/slices/cartSlice';
import { fetchAllAddresses } from '../../../../redux/addressSlice';
import AddressList from '../Address/AddressList';
import orderApi from '../../../../api/orderApi';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const selectedItemIds = useSelector(state => state.cart.selectedItems);
    const user = useSelector(state => state.auth.user);
    const allAddresses = useSelector(state => state.addresses.addresses);

    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [formData, setFormData] = useState({
        recipient_name: '',
        phone: '',
        address_line: '',
        ward: '',
        district: '',
        city: '',
        payment_method: 'cod'
    });

    const selectedProducts = useCallback(() => {
        return cartItems.filter(item => selectedItemIds.includes(item.cart_item_id));
    }, [cartItems, selectedItemIds]);

    useEffect(() => {
        dispatch(fetchAllAddresses());
    }, [dispatch]);

    useEffect(() => {
        const defaultAddr = allAddresses.find(addr => addr.is_default);
        if (defaultAddr) {
            setSelectedAddress(defaultAddr);
            setFormData(prev => ({
                ...prev,
                recipient_name: defaultAddr.recipient_name || '',
                phone: defaultAddr.phone,
                address_line: defaultAddr.address_line,
                ward: defaultAddr.ward,
                district: defaultAddr.district,
                city: defaultAddr.city
            }));
        }
    }, [allAddresses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user || !user.user_id) {
                toast.error('Vui lòng đăng nhập để đặt hàng');
                navigate('/login');
                return;
            }

            const selectedItems = selectedProducts();
            if (selectedItems.length === 0) {
                toast.error('Vui lòng chọn sản phẩm để đặt hàng');
                return;
            }

            const orderData = {
                user_id: user.user_id,
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
                    user_id: user.user_id,
                    recipient_name: formData.recipient_name,
                    phone: formData.phone,
                    address_line: formData.address_line,
                    ward: formData.ward,
                    district: formData.district,
                    city: formData.city
                },
                total_amount: selectedItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0),
                shipping_fee: 0,
                payment_method: formData.payment_method
            };

            const response = await orderApi.createOrder(orderData);

            if (response.data) {
                toast.success('Đặt hàng thành công!');
                dispatch(clearCart());
                navigate('/my-account/orders');
            }
        } catch (error) {
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
                <Button variant="contained" color="primary" startIcon={<CartIcon />} onClick={() => navigate('/cart')}>
                    Quay lại giỏ hàng
                </Button>
            </Box>
        );
    }

    return (
        <Box className="checkout-container">
            <Typography variant="h4" gutterBottom>Thanh toán</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Chọn địa chỉ giao hàng</Typography>
                            <AddressList onSelectAddress={(addr) => {
                                setSelectedAddress(addr);
                                setFormData({
                                    recipient_name: addr.recipient_name || '',
                                    phone: addr.phone,
                                    address_line: addr.address_line,
                                    ward: addr.ward,
                                    district: addr.district,
                                    city: addr.city
                                });
                            }} />
                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={12}>
                                    <TextField fullWidth required label="Tên người nhận" name="recipient_name" value={formData.recipient_name} onChange={handleChange} variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth required label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} variant="outlined" InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} /> }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth required label="Địa chỉ" name="address_line" value={formData.address_line} onChange={handleChange} variant="outlined" multiline rows={2} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Phường/Xã" name="ward" value={formData.ward} onChange={handleChange} variant="outlined" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Quận/Huyện" name="district" value={formData.district} onChange={handleChange} variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Thành phố" name="city" value={formData.city} onChange={handleChange} variant="outlined" />
                                </Grid>
                            </Grid>
                            <Box mt={4}>
                                <Typography variant="h6">Phương thức thanh toán</Typography>
                                <FormControl component="fieldset">
                                    <RadioGroup name="payment_method" value={formData.payment_method} onChange={handleChange}>
                                        <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                                        <FormControlLabel value="momo" control={<Radio />} label="Ví điện tử MoMo" />
                                        <FormControlLabel value="vnpay" control={<Radio />} label="VNPay" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Button type="submit" variant="contained" color="primary" size="large" fullWidth onClick={handleSubmit} disabled={loading} sx={{ mt: 3 }}>
                                {loading ? <CircularProgress size={24} /> : 'Đặt hàng'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Đơn hàng của bạn ({selectedProducts().length} sản phẩm)</Typography>
                            {selectedProducts().map(item => (
                                <Box key={item.cart_item_id} display="flex" my={2}>
                                    <img src={item.variant?.image_url || item.product?.product_image || '/default-product.png'} alt={item.product?.product_name || 'Sản phẩm'} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 12 }} />
                                    <Box flex={1}>
                                        <Typography fontWeight="bold">{item.product_name}</Typography>
                                        <Typography variant="body2" color="text.secondary">Số lượng: {item.quantity}</Typography>
                                        <Typography variant="body2" color="text.secondary">Giá: {formatPrice(item.price)}</Typography>
                                    </Box>
                                    <Typography color="error" fontWeight="bold">{formatPrice(item.price * item.quantity)}</Typography>
                                </Box>
                            ))}
                            <Divider sx={{ my: 2 }} />
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Tổng cộng:</Typography>
                                <Typography color="error" fontWeight="bold">{formatPrice(selectedProducts().reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0))}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Checkout;
