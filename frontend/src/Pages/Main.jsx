import React, { useEffect, useState } from 'react'
import { getAllProducts } from '../api/stripe.api';

function Main() {

    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            let products = await getAllProducts();
            if (products.data?.data) {
                setProducts(products.data.data);
            } else {
                console.error('Products Not Found');
            }
            console.log('products', products);
        } catch (error) {
            console.log('error', error);
        }
    }
    return (
        <div className='productsCardHolder'>
            {
                products.length > 0 && products.map((product, index) =>
                    <div key={`productCard_${index}`} style={{ padding: '2rem', backgroundColor: '#ccc', border: '1px solid lightgrey', width: '250px', height: '360px' }}>
                        <label style={{ fontWeight: '900' }} htmlFor="">Product Name:</label>
                        <span style={{ margin: '0 .5rem' }}>{product.name}</span>
                        <img style={{ margin: '1rem 0', maxWidth: '100%', height: '50%' }} src={product.images[0]} alt="" srcset="" />
                        <div style={{ border: '1px dotted grey', padding: '2rem', textAlign: 'center' }}>
                            <div style={{ width: '100%', textAlign: 'center', fontWeight: '900' }}>Description:</div>
                            {product.description}
                        </div>
                        <div style={{ border: '1px dotted grey', padding: '.5rem', textAlign: 'center' }}>
                           <span style={{fontWeight:'900'}}>Price:</span> {product.description}                            
                        </div>

                    </div>

                )
            }

        </div>
    )
}

export default Main