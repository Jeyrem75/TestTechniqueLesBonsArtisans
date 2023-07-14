import React, { useState } from 'react';
import axios from "axios";
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            dispatch(loginSuccess(res.data));
            navigate("/");
        }
        catch(err) {
            dispatch(loginFailure());
        }
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
            <Typography variant="h5" component="div" gutterBottom>
                Connexion
            </Typography>
            <form onSubmit={handleLogin} sx={{ width: '100%', marginTop: 1 }}>
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
                    Se connecter
                </Button>
            </form>
            <Typography variant="body2" component="div" align="center" marginTop={2}>
                Pas encore inscrit ? <Link href="/register">S'inscrire</Link>
            </Typography>
        </Container>
    )
}

export default Login;