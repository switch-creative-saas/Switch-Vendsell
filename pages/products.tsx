import { useQuery, useMutation, Provider } from 'urql';
import { urqlClient } from '@/lib/urqlClient';
import { useState } from 'react';

const PRODUCTS_QUERY = `
  query {
    products {
      id
      name
      price
    }
  }
`;

const CREATE_PRODUCT = `
  mutation ($name: String!, $price: Float!) {
    insert_products_one(object: { name: $name, price: $price }) {
      id
      name
      price
    }
  }
`;

export default function ProductsPage() {
  const [result] = useQuery({ query: PRODUCTS_QUERY });
  const [, createProduct] = useMutation(CREATE_PRODUCT);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  return (
    <Provider value={urqlClient}>
      <div>
        <h1>Products</h1>
        <ul>
          {result.data?.products.map((p: any) => (
            <li key={p.id}>{p.name} - ${p.price}</li>
          ))}
        </ul>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" />
        <button onClick={() => createProduct({ name, price: parseFloat(price) })}>Add Product</button>
      </div>
    </Provider>
  );
} 