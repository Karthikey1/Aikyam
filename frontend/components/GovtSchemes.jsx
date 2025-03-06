import React, { useState } from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button, 
  Chip,
  Avatar,
  Container,
  Box,
  useTheme
} from '@mui/material';
import { Search, VerifiedUser, Agriculture, MonetizationOn, LocalHospital } from '@mui/icons-material';

const FarmerSchemes = () => {
  const theme = useTheme();

  const [schemes] = useState([
    {
      id: 1,
      name: 'PM-KISAN Scheme',
      description: 'Provides income support of ₹6,000 per year to landholding farmer families',
      eligibility: 'Landholding farmers (Ownership rights required)',
      link: 'https://pmkisan.gov.in',
      category: 'Financial Support',
      launched: 2019,
      agency: 'Ministry of Agriculture',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'Affordable crop insurance with premium from 1.5% to 5% of sum insured',
      eligibility: 'All farmers including sharecroppers',
      link: 'https://pmfby.gov.in',
      category: 'Insurance',
      launched: 2016,
      agency: 'Ministry of Agriculture',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Kisan Credit Card (KCC)',
      description: 'Credit access for agriculture needs with 4% interest subvention',
      eligibility: 'Farmers, sharecroppers, tenant farmers',
      link: 'https://www.nabard.org',
      category: 'Loans',
      launched: 1998,
      agency: 'NABARD',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Neem Coated Urea Scheme',
      description: 'Subsidized neem-coated urea to improve soil health',
      eligibility: 'All farmers',
      link: 'https://www.fert.nic.in',
      category: 'Subsidy',
      launched: 2015,
      agency: 'Fertilizer Ministry',
      status: 'Active'
    },
    {
      id: 5,
      name: 'National Mission on Agricultural Extension',
      description: 'Promotes modern farming techniques through training programs',
      eligibility: 'Farmers and farming groups',
      link: 'https://agricoop.nic.in',
      category: 'Education',
      launched: 2020,
      agency: 'Agriculture Ministry',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
      description: 'Promotes organic farming with ₹50,000/hectare support',
      eligibility: 'Farmers adopting organic practices',
      link: 'https://pgsindia-ncof.gov.in',
      category: 'Organic Farming',
      launched: 2015,
      agency: 'Agriculture Ministry',
      status: 'Active'
    },
    {
      id: 7,
      name: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY)',
      description: 'Water to every field through micro-irrigation',
      eligibility: 'Farmers with irrigation needs',
      link: 'https://pmksy.gov.in',
      category: 'Irrigation',
      launched: 2015,
      agency: 'Agriculture Ministry',
      status: 'Active'
    },
    {
      id: 8,
      name: 'NABARD Schemes',
      description: 'Various rural development and agricultural schemes',
      eligibility: 'Farmers and rural entrepreneurs',
      link: 'https://www.nabard.org',
      category: 'Development',
      launched: 1982,
      agency: 'NABARD',
      status: 'Active'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', ...new Set(schemes.map(scheme => scheme.category))];
  const states = ['All', 'Andhra Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Punjab', 'Kerala', 'Tamil Nadu'];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.eligibility.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesState = selectedState === 'All' || scheme.state === selectedState;

    return matchesSearch && matchesCategory && matchesState;
  }).sort((a, b) => sortBy === 'newest' ? b.launched - a.launched : a.name.localeCompare(b.name));

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Financial Support': return <MonetizationOn />;
      case 'Insurance': return <LocalHospital />;
      default: return <Agriculture />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4, 
        p: 4,
        background: 'linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)',
        borderRadius: 2,
        color: 'white'
      }}>
        <VerifiedUser sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          Government Approved Farmer Schemes
        </Typography>
        <Typography variant="h6">
          Verified and Updated Information from Official Sources
        </Typography>
      </Box>

      {/* Filters Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Schemes"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <Select
            fullWidth
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category === 'All' ? 'All Categories' : category}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6} md={2}>
          <Select
            fullWidth
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {states.map(state => (
              <MenuItem key={state} value={state}>
                {state === 'All' ? 'All States' : state}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="newest">Sort by: Newest First</MenuItem>
            <MenuItem value="alphabetical">Sort by: A-Z</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* Schemes Grid */}
      <Grid container spacing={3}>
        {filteredSchemes.map(scheme => (
          <Grid item xs={12} sm={6} lg={4} key={scheme.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: theme.palette.primary.main,
                    mr: 2
                  }}>
                    {getCategoryIcon(scheme.category)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {scheme.name}
                    {scheme.status === 'Active' && 
                      <Chip 
                        label="Active" 
                        size="small" 
                        color="success" 
                        sx={{ ml: 1, fontSize: '0.7rem' }} 
                      />}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {scheme.description}
                </Typography>

                <Box sx={{ 
                  backgroundColor: '#f5f5f5', 
                  p: 2, 
                  borderRadius: 1, 
                  mb: 2 
                }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    <strong>Implementing Agency:</strong> {scheme.agency}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Launched:</strong> {scheme.launched}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<VerifiedUser />}
                  sx={{ mt: 'auto' }}
                >
                  Visit Official Portal
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Trust Badge */}
      <Box sx={{ 
        textAlign: 'center', 
        mt: 4, 
        p: 2,
        backgroundColor: '#f8f9fa',
        borderRadius: 2
      }}>
        <Typography variant="body2" color="text.secondary">
          <VerifiedUser sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
          All information verified from official government sources
        </Typography>
      </Box>
    </Container>
  );
};

export default FarmerSchemes;