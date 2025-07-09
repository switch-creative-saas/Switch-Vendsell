import { useEffect, useState } from 'react';
import { createProduct, getProducts, deleteProduct } from '@/lib/back4appProducts';

export default function Back4AppProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    setProducts(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    await createProduct(name, parseFloat(price));
    setName('');
    setPrice('');
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    fetchProducts();
  };

  return (
    <div>
      <h1>Products</h1>
      {loading ? <div>Loading...</div> : (
        <ul>
          {products.map((p: any) => (
            <li key={p.id}>
              {p.get('name')} - ${p.get('price')}
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" />
      <button onClick={handleCreate}>Add Product</button>
    </div>
  );
} 