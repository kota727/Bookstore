import { Container, Typography, Box, Button, Grid, Card, CardContent, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Define image paths
// Import images directly
import bookLogo from '../assets/book-logo.png.svg';
import productImage1 from '../assets/product image 1.jpg';
import productImage2 from '../assets/product image 2.jpg';
import productImage3 from '../assets/product image 3.jpg';
import productImage4 from '../assets/product image 4.jpg';

// Add custom styles
const swiperStyles = {
  '--swiper-navigation-color': '#1976d2',
  '--swiper-pagination-color': '#1976d2',
  '--swiper-navigation-size': '25px',
  width: '100%',
  height: '100%',
  maxHeight: '500px'
};

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });

  const product = {
    id: 1, // Added ID for cart functionality
    title: 'Through the Years',
    author: 'PoeticStormzzz',
    price: 300,
    images: [bookLogo, productImage1, productImage2, productImage3, productImage4],
    description: 'A comprehensive collection of poetry through the years',
    stockQuantity: 10
  };

  const handleAddToCart = () => {
    addToCart(product);
    setSnackbar({
      open: true,
      message: 'Item added to cart!'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
          py: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3, md: 4 },
          width: '100%'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ color: 'white', textAlign: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
                fontWeight: 'bold'
              }}
            >
              Welcome to Our Bookstore
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              Discover a world of knowledge and adventure through our carefully curated collection of books.
            </Typography>
            {!user && (
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  padding: { xs: '6px 16px', sm: '8px 22px' }
                }}
              >
                Join Now
              </Button>
            )}
          </Box>
        </Container>
      </Box>      <Container 
        maxWidth="lg" 
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Card sx={{ 
          mb: 4, 
          overflow: 'hidden',
          boxShadow: { xs: 1, sm: 2, md: 3 },
          borderRadius: { xs: 1, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}>
          <Grid container spacing={{ xs: 0, sm: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                height: { xs: '300px', sm: '400px', md: '500px' }, 
                backgroundColor: 'white',
                width: '100%',
                position: 'relative',
                '& .swiper': {
                  width: '100%',
                  height: '100%'
                },
                '& .swiper-slide': {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white'
                },
                '& .swiper-button-next, & .swiper-button-prev': {
                  color: '#1976d2',
                  '&:after': {
                    fontSize: '24px'
                  }
                },
                '& .swiper-pagination-bullet-active': {
                  backgroundColor: '#1976d2'
                }
              }}>                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation={true}
                  pagination={{ clickable: true }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                  }}
                  loop={true}
                  style={swiperStyles}
                  className="mySwiper"
                  slidesPerView={1}
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Box
                        component="img"
                        src={image}
                        alt={`Product image ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: 2
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent sx={{ 
                p: { xs: 2, sm: 3, md: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 'bold'
                  }}
                >
                  {product.title}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                  }}
                >
                  by {product.author}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: { xs: 1, sm: 2 }, 
                    mb: { xs: 2, sm: 3, md: 4 },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {product.description}
                </Typography>
                <Typography 
                  variant="h4" 
                  color="primary" 
                  sx={{ 
                    mb: { xs: 2, sm: 3, md: 4 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 'bold'
                  }}
                >
                  ₹${product.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  sx={{
                    mt: 'auto',
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                {product.stockQuantity > 0 && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1, 
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {product.stockQuantity} items in stock
                  </Typography>
                )}
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;