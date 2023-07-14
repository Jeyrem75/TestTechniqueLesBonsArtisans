import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

const Navbar = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    }

    return (
        <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            Crud Product
            </Typography>
            <Button color="inherit" component={Link} to="/">Accueil</Button>
            {currentUser ? (
                <>
                    <Button color="inherit" component={Link} to="/products">Produits</Button>
                    <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>
                </>
            ) : (
                <>
                    <Button color="inherit" component={Link} to="/register">Inscription</Button>
                    <Button color="inherit" component={Link} to="/login">Connexion</Button>
                </>
            )}
        </Toolbar>
        </AppBar>
    )
}

export default Navbar;