import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { countries, indianStates, districtsByState } from '../data/locationData';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    setLoading(true);
    const success = await register(name, email, password, phone, country, state, district, address, pincode);
    if (success) {
      navigate('/');
    }
    setLoading(false);
  };

  // Only show Indian states if country is India
  const showStates = country === 'IN';
  // Only show districts if a state is selected
  const showDistricts = showStates && state;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            margin="normal"
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Country</InputLabel>
            <Select
              value={country}
              label="Country"
              onChange={(e) => {
                setCountry(e.target.value);
                setState('');
                setDistrict('');
              }}
            >
              {countries.map((c) => (
                <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {showStates && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel>State</InputLabel>
              <Select
                value={state}
                label="State"
                onChange={(e) => {
                  setState(e.target.value);
                  setDistrict('');
                }}
              >
                {indianStates.map((s) => (
                  <MenuItem key={s.code} value={s.code}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {showDistricts && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel>District</InputLabel>
              <Select
                value={district}
                label="District"
                onChange={(e) => setDistrict(e.target.value)}
              >
                {(districtsByState[state] || []).map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            fullWidth
            label="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            margin="normal"
            multiline
            rows={3}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;