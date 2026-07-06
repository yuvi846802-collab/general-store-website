

async function test() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@hakeemstore.com', password: 'admin' })
  });
  const loginData = await loginRes.json();
  if (!loginData.accessToken) {
    console.log('Login failed:', loginData);
    return;
  }
  
  const token = loginData.accessToken;
  const productPayload = {
    name: 'Test Product ' + Date.now(),
    description: 'Test description',
    price: 100,
    category: 'Groceries',
    stock: 10,
    status: 'active'
  };
  
  const createRes = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productPayload)
  });
  
  const createData = await createRes.json();
  console.log('Create Response:', createRes.status, createData);
}

test();
