import React, { useState } from 'react';
import axios from "axios";
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerFailure, registerStart, registerSuccess } from "../redux/userSlice";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const isAdmin = false;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        dispatch(registerStart());
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", { email, password, isAdmin });
            dispatch(registerSuccess(res.data));
            navigate("/login");
        }
        catch(err) {
            dispatch(registerFailure());
        }
    };
    return (
        <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
            <Typography variant="h5" component="div" gutterBottom>
                Inscription
            </Typography>
            <form onSubmit={handleRegister} sx={{ width: '100%', marginTop: 1 }}>
                <TextField
                label="Adresse email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                />
                <TextField
                label="Mot de passe"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                    S'inscrire
                </Button>
            </form>
            <Typography variant="body2" component="div" align="center" marginTop={2}>
                Déjà inscrit ? <Link href="/login">Se connecter</Link>
            </Typography>
        </Container>
    )
}

export default Register