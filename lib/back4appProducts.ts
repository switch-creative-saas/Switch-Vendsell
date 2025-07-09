import Parse from './parseClient';

export async function createProduct(name: string, price: number) {
  const Product = Parse.Object.extend('Product');
  const product = new Product();
  product.set('name', name);
  product.set('price', price);
  await product.save();
  return product;
}

export async function getProducts() {
  const Product = Parse.Object.extend('Product');
  const query = new Parse.Query(Product);
  return await query.find();
}

export async function updateProduct(id: string, updates: { name?: string; price?: number }) {
  const Product = Parse.Object.extend('Product');
  const query = new Parse.Query(Product);
  const product = await query.get(id);
  if (updates.name) product.set('name', updates.name);
  if (updates.price) product.set('price', updates.price);
  await product.save();
  return product;
}

export async function deleteProduct(id: string) {
  const Product = Parse.Object.extend('Product');
  const query = new Parse.Query(Product);
  const product = await query.get(id);
  await product.destroy();
} 