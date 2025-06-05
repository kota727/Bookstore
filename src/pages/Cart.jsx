import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Button,
  IconButton,
  Divider,
  Card,
  CardMedia,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuantityChange = (item, newQuantity) => {
    if (loading) return;
    updateQuantity(item.id, Math.max(1, Math.min(newQuantity, item.stockQuantity)));
  };

  const handleRemoveItem = (itemId) => {
    if (loading) return;
    removeFromCart(itemId);
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Here we'll add the actual checkout logic later
      setTimeout(() => {
        setLoading(false);
        navigate('/checkout');
      }, 1000);
    } catch (err) {
      setError('Failed to process checkout. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: { xs: 2, sm: 4 },
          fontSize: { xs: '1.5rem', sm: '2.125rem' }
        }}
      >
        Shopping Cart
      </Typography>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Paper
              key={item.id}
              sx={{
                p: { xs: 1, sm: 2 },
                mb: 2,
                display: 'flex',
                gap: { xs: 1, sm: 2 },
                position: 'relative'
              }}
            >
              <Card sx={{ 
                width: { xs: 80, sm: 100 }, 
                height: { xs: 120, sm: 140 }, 
                flexShrink: 0 
              }}>
                <CardMedia
                  component="img"
                  height="100%"
                  image={item.images[0]}
                  alt={item.title}
                  sx={{ objectFit: 'contain' }}
                />
              </Card>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    wordBreak: 'break-word'
                  }}
                >
                  {item.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  by {item.author}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="primary" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: { xs: 1, sm: 2 }, 
                  gap: { xs: 1, sm: 2 }
                }}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    disabled={item.quantity <= 1 || loading}
                  >
                    <Remove />
                  </IconButton>
                  <Typography>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    disabled={item.quantity >= item.stockQuantity || loading}
                  >
                    <Add />
                  </IconButton>
                  
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={loading}
                    sx={{ ml: 'auto' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}
            >
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Subtotal</Typography>
              <Typography>₹{getTotalPrice().toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Shipping</Typography>
              <Typography>Free</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">₹{getTotalPrice().toFixed(2)}</Typography>
            </Box>

            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleCheckout}
              disabled={loading}
              sx={{ 
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Proceed to Checkout'
              )}
            </Button>

            {!user && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2, textAlign: 'center' }}
              >
                Please log in to checkout
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Cart;
