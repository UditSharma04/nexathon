import { Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { logout } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to ShareHub
      </Typography>
      <button onClick={logout}>Logout</button>
    </Box>
  );
} 