import { AppBar, Toolbar, Typography, Button, IconButton, Box, Badge } from '@mui/material';
import { ShoppingCart, Person, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';

function Navbar({ logo }) {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const { cartItems } = useCart();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (    <AppBar 
      position="static"
      sx={{
        padding: { xs: '0.5rem 0', sm: 0 }
      }}
    >
      <Toolbar
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'center', sm: 'flex-start' }
          }}
        >
          {logo && (
            <Box sx={{ mr: { xs: 1, sm: 2 } }}>
              <img 
                src={logo} 
                alt="Logo" 
                style={{ 
                  height: 40, 
                  borderRadius: 4,
                  maxWidth: '100%'
                }} 
              />
            </Box>
          )}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: { xs: 0, sm: 1 },
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            Bookstore
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <IconButton
            color="inherit"
            component={RouterLink}
            to="/cart"
            sx={{ position: 'relative' }}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/orders"
              >
                Orders
              </Button>
              
              {user.isAdmin && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/admin"
                >
                  Admin
                </Button>
              )}

              <IconButton
                color="inherit"
                component={RouterLink}
                to="/profile"
              >
                <Person />
              </IconButton>

              <Button
                color="inherit"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;