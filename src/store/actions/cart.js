import * as actionTypes from './actionsTypes';


export const addProductToCart = (id, title, description, category, price, image) => {

    const token = localStorage.getItem('token');

    if(token){
        fetch('https://strix-market-place.herokuapp.com/cart/add-product/' + id, {
        method: 'POST',
        headers: {
        Authorization: 'Bearer ' + token,
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !==201){
                throw new Error('Adding product failed')
            }

            return res.json();
        })
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })

    }


    return {
        type: actionTypes.ADD_PRODUCT_TO_CART,
        id: id,
        title: title,
        description: description,
        category: category,
        price: price,
        image: image
    }
}

export const postOrder = (paymentData) => {

    const token = localStorage.getItem('token');
    const formOrderData = new FormData();

    formOrderData.append('address', paymentData.address);
    formOrderData.append('products', paymentData.products);
    formOrderData.append('deliveryDate', paymentData.deliveryDate);
    formOrderData.append('subTotalPrice', paymentData.subTotalPrice);
    formOrderData.append('taxes', paymentData.taxes);
    formOrderData.append('deliveryPrice', paymentData.deliveryPrice);
    formOrderData.append('totalPrice', paymentData.totalPrice);
    formOrderData.append('totalProductsCount', paymentData.totalProductsCount);

    if(token){
        fetch('https://strix-market-place.herokuapp.com/cart/order/' , {
            headers: {
                Authorization: 'Bearer ' + token
            },
            method: 'POST',
            body: formOrderData
        })
        .then(res => {
            if(res.status !== 200 && res.status !==201){
                throw new Error('Creating a post failed')
            }

            return res.json();
       })
       .then( resData => {
           console.log(resData)
       })
       .catch(err => {
           console.log(err)
       })
    }
    



}

export const deleteProduct = (id, price) =>{

    const token = localStorage.getItem('token');
    if(token){
        fetch('https://strix-market-place.herokuapp.com/cart/delete-product/' + id, {
            method: 'POST',
            headers: {
            Authorization: 'Bearer ' + token,
                }
            })
        .then(res => {
            if(res.status !== 200 && res.status !==201){
                throw new Error('Deleting product failed')
            }

            return res.json();
        })
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return {
        type: actionTypes.DELETE_PRODUCT,
        id: id,
        price: price
    }
}

export const selectAddressHandler = (data) => {
    return {
        type: actionTypes.ADD_USER_INFO,
        data: data
    }
}

export const updateCheckoutStep = nextStep => {
    return {
        type: actionTypes.UPDATE_CHECKOUT_STEP,
        nextStep: nextStep
    }
}

export const selectDeliveryHandler = (data) => {
    return {
        type: actionTypes.ADD_DELIVERY_INFO,
        data: data
    }
}

export const setProductsToCart = (data, auth) => {
    if(auth){
        return {
            type: actionTypes.SET_PRODUCTS_TO_CART,
            products: data.products,
            totalProductsCount: data.totalProductsCount,
            subTotalPrice: data.subTotalPrice,
            taxes: data.taxes,
            totalPrice: data.totalPrice,
            taxRate: data.taxRate,
            auth: auth
        }
    } else {
        return {
            type: actionTypes.SET_PRODUCTS_TO_CART,
            products: data
        }
    }
    
}

export const setProductsInCart = (products, token) => {

    if(token){

        return dispatch => {

            let data = new FormData();
            data.append('products', JSON.stringify(products))

            fetch('https://strix-market-place.herokuapp.com/cart/', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token,
                },          
                body: data
            })
            .then(res => {
                if(res.status !== 200 && res.status !==201){
                    throw new Error('Creating a post failed')
                }
                return res.json();
            })
            .then( resData => {
                let auth = true;
                dispatch(setProductsToCart(resData, auth))
            })
            .catch(err => {
                console.log(err)
            })
    
        }
    } else {
        return dispatch => {
            dispatch(setProductsToCart(products))
        }
    }

}





export const clearProductsInCart = () => {
    localStorage.removeItem('productsInCart');
    const token = localStorage.getItem('token');


    if(token){
        fetch('https://strix-market-place.herokuapp.com/cart/', {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + token,
                }
        })
        .then(res => {
            if(res.status !== 200 && res.status !==201){
                throw new Error('Clearing cart failed')
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData)
        })
        .catch(err => {
            console.log(err)
        })

    }


    return {
        type: actionTypes.CLEAR_PRODUCTS_IN_CART
    }
}


