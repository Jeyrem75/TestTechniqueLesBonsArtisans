import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProductFailure, createProductStart, createProductSuccess } from "../redux/productsSlice";

const CreateProduct = () => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        price: '',
        rating: '',
        warranty_years: '',
        available: false,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        const parsedValue = name === 'price' || name === 'rating' ? parseFloat(value) : name === 'warranty_years' ? parseInt(value) : value;
        
        setFormData((prevData) => ({
            ...prevData,
            [name]: parsedValue,
        }));
    };

    const handleSubmit = async (event) => {
        console.log(formData);
        event.preventDefault();
        dispatch(createProductStart());

        try {
            const res = await axios.post("http://localhost:5000/api/products/", formData, {
                headers: {
                    Authorization: `Bearer ${currentUser.accessToken}`
                }
            });
            dispatch(createProductSuccess(res.data));
            navigate("/products");
        }
        catch(err) {
            dispatch(createProductFailure());
        }
    };

    return (
        <>
            {currentUser && currentUser.isAdmin ? (
                <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 8 }}>
                    <Typography variant="h5" component="div" gutterBottom>
                        Création d'un produit
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="name"
                            label="Nom"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            fullWidth
                            sx={{ marginTop: 2 }}
                        />
                        <TextField
                            name="type"
                            label="Type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            fullWidth
                            sx={{ marginTop: 2 }}
                        />
                        <TextField
                            name="price"
                            label="Prix"
                            value={formData.price}
                            onChange={handleChange}
                            type="number"
                            required
                            fullWidth
                            sx={{ marginTop: 2 }}
                        />
                        <TextField
                            name="rating"
                            label="Note"
                            value={formData.rating}
                            onChange={handleChange}
                            type="number"
                            required
                            fullWidth
                            sx={{ marginTop: 2 }}
                        />
                        <TextField
                            name="warranty_years"
                            label="Années de garantie"
                            value={formData.warranty_years}
                            onChange={handleChange}
                            type="number"
                            required
                            fullWidth
                            sx={{ marginTop: 2 }}
                        />
                        <FormControl fullWidth sx={{ marginTop: 2 }}>
                            <InputLabel id="available-label">Disponible</InputLabel>
                            <Select
                            labelId="available-label"
                            id="available-select"
                            name="available"
                            value={formData.available}
                            onChange={handleChange}
                            required
                            sx={{ marginTop: 2 }}
                            >
                            <MenuItem value={true}>Oui</MenuItem>
                            <MenuItem value={false}>Non</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                            Créer le produit
                        </Button>
                    </form>
                </Container>
            ) : (
                <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
                    <Typography color="error" variant="h4" align="center" gutterBottom>
                        Vous n'avez pas l'autorisation de créer un produit!
                    </Typography>
                </Container>
            )}
        
        </>
    );
};

export default CreateProduct;