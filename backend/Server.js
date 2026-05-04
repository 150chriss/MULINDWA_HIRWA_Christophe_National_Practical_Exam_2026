const express=require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const cors=require('cors');
const app=express();
const PORT=process.env.PORT || 5000;
app.use(express.json());
app.use(cors());  


mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// create a user schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// create product schema

const productSchema= new mongoose.Schema({
  product_name: {type: String, required: true},
  quantity: {type: Number, required: true},
  price: {type: Number, required: true}

})
// create sales schema
const salesSchema = new mongoose.Schema({
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
});

// Define User model
const User = mongoose.model('User', userSchema);

// Define Product model
const Product = mongoose.model('Product', productSchema);

// Define sales model
const Sales = mongoose.model('Sales', salesSchema);

// product routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/products', async (req, res) => {
  const { product_name, quantity, price } = req.body;
  try {
    const newProduct = new Product({
      product_name,
      quantity,
      price
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({ msg: 'Product added successfully', product: savedProduct });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { product_name, quantity, price } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { product_name, quantity, price },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ msg: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ msg: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// sales routes
app.get('/sales', async (req, res) => {
  try {
    const sales = await Sales.find();
    res.status(200).json({ sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/sales', async (req, res) => {
  const { item, amount, date } = req.body;
  try {
    const newSale = new Sales({
      item,
      amount,
      date
    });
    const savedSale = await newSale.save();
    res.status(201).json({ msg: 'Sale added successfully', sale: savedSale });
  } catch (error) {
    console.error('Error saving sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/sales/:id', async (req, res) => {
  const { id } = req.params;
  const { item, amount, date } = req.body;
  try {
    const updatedSale = await Sales.findByIdAndUpdate(
      id,
      { item, amount, date },
      { new: true }
    );
    if (!updatedSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.status(200).json({ msg: 'Sale updated successfully', sale: updatedSale });
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/sales/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSale = await Sales.findByIdAndDelete(id);
    if (!deletedSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.status(200).json({ msg: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define your routes here
app.post('/auth/register',async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Create a new user instance
    const newUser = new User({
      firstname,
      lastname,
      email,
      password
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json({ msg: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the provided password matches the stored password
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
      
    }

    // If credentials are valid, send a success response
    res.status(200).json({ msg: 'Login successful', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});