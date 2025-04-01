const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory user storage
const users = [];

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Basic Login System');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.get('/register', (req, res) => {
    res.send(`
      <h2>Register</h2>
      <form action="/register" method="POST">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required><br><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br><br>
        <button type="submit">Register</button>
      </form>
    `);
  });
  

  app.get('/login', (req, res) => {
    res.send(`
      <h2>Login</h2>
      <form action="/login" method="POST">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required><br><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required><br><br>
        <button type="submit">Login</button>
      </form>
    `);
  });
  

  app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    // Basic validation
    if (!username || !password) {
      return res.send('Please provide both username and password.');
    }
  
    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.send('Username already exists. Please choose another.');
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Store user
    users.push({ username, password: hashedPassword });
    res.send('Registration successful! You can now <a href="/login">login</a>.');
  });
  

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Basic validation
    if (!username || !password) {
      return res.send('Please provide both username and password.');
    }
  
    // Find user
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.send('Invalid username or password.');
    }
  
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('Invalid username or password.');
    }
  
    res.send('Login successful! Welcome, ' + username);
  });
  