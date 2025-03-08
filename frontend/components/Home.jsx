import "./Home.css";
import { Container, Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { LocalFlorist, Cloud, Article, AttachMoney, Storefront, Newspaper } from "@mui/icons-material";
import Sos from "./SOS"
const features = [
  { title: "Your Crop Doctor", icon: <LocalFlorist fontSize="large" />, description: "Get AI-driven crop health analysis." },
  { title: "Weather Forecasts", icon: <Cloud fontSize="large" />, description: "Stay updated with real-time weather conditions." },
  { title: "Government Schemes", icon: <Article fontSize="large" />, description: "Explore latest farming policies and benefits." },
  { title: "Market Prices", icon: <AttachMoney fontSize="large" />, description: "Track real-time agricultural commodity prices." },
  { title: "Buy & Sell Marketplace", icon: <Storefront fontSize="large" />, description: "Trade crops and equipment with other farmers." },
  { title: "News", icon: <Newspaper fontSize="large" />, description: "Read the latest agricultural news and updates." }
];

export default function Home() {
  return (
    <><Sos className="sos-button" />
    <Box
      className="home"
      sx={{
        backgroundImage: "url('data:image/jpeg;base64,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')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        p: 4
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" fontWeight="bold" gutterBottom sx={{color:"white",textShadow:"2px 2px 5px black"}}>
          Empowering Farmers with Technology
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 ,color: "white",fontWeight:"bold",textShadow:"0 0 2px black,0 0 4px black,0 0 6px black"}}>
          Access essential farming tools, insights, and support at your fingertips.
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                color: "white",
                textAlign: "center",
                p: 2,
                transition: "transform 0.2s",
                '&:hover': { transform: "scale(1.05)" }
              }}>
                <CardContent>
                  {feature.icon}
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>
      </>
  );
}
