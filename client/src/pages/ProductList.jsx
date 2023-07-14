import React, { useCallback, useEffect, useState } from 'react';
import { Container, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsFailure, fetchProductsStart, fetchProductsSuccess, deleteProductFailure, deleteProductStart, deleteProductSuccess } from '../redux/productsSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');

    const fetchProducts = useCallback(async () => {
        try {
            const results = await axios.get("http://localhost:5000/api/products/");
            const data = results.data;
            dispatch(fetchProductsSuccess(data));
        }
        catch(err) {
            dispatch(fetchProductsFailure());
        }
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchProductsStart());
        fetchProducts();
    }, [dispatch, fetchProducts]);

    const handleDeleteProduct = async (productId) => {
        dispatch(deleteProductStart());
        
        try {
            console.log(productId);
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.accessToken}`
                }
            });
            dispatch(deleteProductSuccess(productId));
            fetchProducts();
        } catch(err) {
            console.log(err);
            dispatch(deleteProductFailure());
        }
    };

    const handleDeleteConfirmation = (productId) => {
        setSelectedProductId(productId);
        setOpenDialog(true);
    };
    
    const handleDeleteConfirmed = async () => {
        setOpenDialog(false);
        await handleDeleteProduct(selectedProductId);
    };

    const handleDeleteCancelled = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="xs" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginTop: 8 }}>
            <div>
                <Typography variant="h4" gutterBottom>
                    Liste des produits
                </Typography>
                {currentUser.isAdmin ? (
                    <Button 
                        variant="outlined"
                        color="success" 
                        sx={{ marginTop: 4, marginBottom: 4 }}
                        onClick={() => navigate("/products/create")}
                    >
                        Créer un produit
                    </Button>
                ) : (
                    <></>
                )}
                <TableContainer>
                    <Table style={{ minWidth: 650 }} aria-label="Product table">
                    <TableHead>
                        <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Prix</TableCell>
                        <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {products ? (
                        <TableBody>
                            {products.map(product => (
                            <TableRow key={product._id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.type}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    {currentUser.isAdmin ? (
                                        <>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => navigate(`/products/${product._id}`)}
                                                sx={{ marginRight: 2 }}
                                            >
                                                Voir
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => navigate(`/products/edit/${product._id}`)}
                                                sx={{ marginRight: 2 }}
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeleteConfirmation(product._id)}
                                            >
                                                Supprimer
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => navigate(`/products/${product._id}`)}
                                            >
                                                Voir
                                            </Button>

                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                    </Table>
                </TableContainer>
                <Dialog open={openDialog} onClose={handleDeleteCancelled}>
                    <DialogTitle>Confirmation de suppression</DialogTitle>
                    <DialogContent>
                        <Typography>Voulez-vous vraiment supprimer ce produit ?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button color='primary' onClick={handleDeleteCancelled}>Annuler</Button>
                        <Button color='error' onClick={handleDeleteConfirmed}>Supprimer</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Container>
    );
}

export default ProductList;


