import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Bonjour, bienvenue sur mon Crud Product !
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Merci de vous inscrire et de vous connecter pour accéder aux fonctionnalités.
      </Typography>
      <Typography variant="body1" align="center" gutterBottom sx={{ marginTop: 2 }}>
        Pour accèder aux fonctionnalités créer, modifier et supprimer, il faut créer un compte admin, pour se faire, passez la const isAdmin à true dans le fichier Register.jsx pour pouvoir créer votre compte Admin et n'oubliez pas de la repasser à false pour créer un compte user non admin et pouvoir tester l'app des deux côtés!
      </Typography>
      {currentUser ? (
        <></>
      ) : (
        <>
          <Button component={Link} to="/register" variant="contained" color="primary" sx={{ marginTop: 4 }}>
            S'inscrire
          </Button>
          <Button component={Link} to="/login" variant="outlined" color="primary" sx={{ marginTop: 2 }}>
            Se connecter
          </Button>
        </>
      )}
    </Container>
  );
};

export default Home;