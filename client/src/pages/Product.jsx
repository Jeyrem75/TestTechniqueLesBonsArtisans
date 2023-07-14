import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProductFailure, deleteProductStart, deleteProductSuccess } from '../redux/productsSlice';
import { fetchProductFailure, fetchProductStart, fetchProductSuccess } from '../redux/productSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const product = useSelector(state => state.productDetail.product);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');

    const fetchProductDetails = useCallback(async () => {
        try {
            const results = await axios.get(`http://localhost:5000/api/products/${productId}`);
            const data = results.data;
            dispatch(fetchProductSuccess(data));
        }
        catch(err) {
            dispatch(fetchProductFailure());
        }
    }, [dispatch, productId]);

    useEffect(() => {
        dispatch(fetchProductStart());
        fetchProductDetails();
    }, [dispatch, fetchProductDetails]);

    const handleDeleteProduct = async () => {
        dispatch(deleteProductStart());
    
        try {
            console.log(productId);
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.accessToken}`
                }
            });
            dispatch(deleteProductSuccess(productId));
            navigate("/products");
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

    if (!product) {
        return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
            <Typography variant="h4" align="center" gutterBottom>
            Chargement...
            </Typography>
        </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: 8 }}>
            <Card>
                <CardContent>
                <Typography variant="h4" gutterBottom>
                    {product.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Type: {product.type}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Prix: {product.price}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Note: {product.rating}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Années de garenties: {product.warranty_years}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Disponible: {product.available === true ? ( "Oui" ) : ( "Non" )}
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/products")}
                    sx={{ marginRight: 2 }}
                >
                    Retour
                </Button>
                {currentUser.isAdmin && (
                    <>
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
                            onClick={handleDeleteConfirmation}
                        >
                            Supprimer
                        </Button>
                    </>
                )}
                </CardContent>
            </Card>
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
        </Container>
    );
};

export default Product;
