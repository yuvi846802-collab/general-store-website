import fs from 'fs';

async function testCreateProduct() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'yuvrajpaajisardar@gmail.com', password: 'admin123' })
  });
  
  const loginData = await loginRes.json();
  const token = loginData.accessToken;
  console.log('Login Token:', token);

  const productRes = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: "Test API Product",
      description: "Description",
      price: 150,
      category: "Grocery Items",
      stock: 10,
      image: "",
      status: "active"
    })
  });

  const productData = await productRes.json();
  console.log('Product Response:', productRes.status, productData);
}

testCreateProduct();
