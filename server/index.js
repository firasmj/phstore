const express = require('express');
const db = require('./db')
const cors = require('cors')
const path = require('path');
const fs = require('fs');

const app = express();
/////////////////////
const multer = require('multer');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//const corsOrigin = 'http://localhost:3000';
app.use(cors({
  //origin: [corsOrigin],
  methods: ['GET', 'POST'],
  credentials: true
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,
      './product images/'));
  }
});

const upload = multer({ storage: storage });

app.post('/image-upload', upload.single('my-image-file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filename = `${req.file.fieldname}-${req.file.size}.jpeg`; // Generate filename
  const newPath = path.join(__dirname, './product images/', filename);

  // Move the file to the desired location (optional)
  fs.rename(req.file.path, newPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error moving file' });
    }

    // Send the response with the image URL
    //res.json({ url: `/product images/${filename}` });
  });
});

const port2 = 4000;
app.listen(port2, process.env.IP, function () {
  console.log(`Server is running on port ${port2}`);
});

//////////////////////




const port = 3300;
app.use(cors({
  //origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL as ID ' + db.threadId);
});

app.get("/api/get", (req, res) => {
  db.query("SELECT * FROM usernames", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});

app.get("/usernames", (req, res) => {
  db.query("SELECT * FROM usernames", (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log(result);
    res.json(result);
  })
});

app.get("/products/latest", (req, res) => {
  db.query("SELECT u.username, p.*  FROM user_products p JOIN user u ON p.user_id = u.id ORDER BY date ASC", (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log(result);
    res.status(200).json(result);
  })
});

app.get("/api/productsMobilesElectronics", (req, res) => {
  db.query("SELECT u.username, p.*  FROM user_products p JOIN user u ON p.user_id = u.id WHERE p.type = 'Mobiles and Accessories' OR p.type = 'Electronics and Appliances' ORDER BY date ASC", (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log(result);
    res.status(200).json(result);
  })
});

app.get("/api/productsFashion", (req, res) => {
  db.query("SELECT u.username, p.*  FROM user_products p JOIN user u ON p.user_id = u.id WHERE p.type = 'Fashion and Beauty' ORDER BY date ASC", (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log(result);
    res.status(200).json(result);
  })
});

app.get("/getProductImages/:id", (req, res) => {
  const product_id = req.params.id;
  const query = `SELECT * FROM product_images JOIN user_products ON product_images.product_id = user_products.id WHERE user_products.id = ?`;
  db.query(query, [product_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      console.log("wrong");
      return res.status(404).json({ error: 'No images found for product' });
    }
    const images = results.map(row => ({
      imageUrl: row.image_url,
      // ... other image properties if needed
    }));
    return res.status(200).json(images);
  });
})

app.get("/getProducts/:id", (req, res) => {
  const id = req.params.id;
  const query = `SELECT p.*, i.image_url FROM user_products p JOIN product_images i ON p.id = i.product_id WHERE p.user_id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // console.log(id);
    return res.status(200).json(results);
  })
});



app.get("/getUser/:id", (req, res) => {
  const id = req.params.id;
  const query = `SELECT username, address, bio FROM user WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // console.log(id);
    return res.status(200).json(results[0]);
  })
});

app.post("/api/deleteProduct", (req, res) => {
  const {id} = req.body;
  console.log(id);
  const query = `DELETE FROM user_products WHERE id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log(`deleted product ${id}`);
    return res.status(200).json(results);
  })
})


app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  // console.log(email + password);

  const query = "SELECT * FROM user WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      console.log("wrong");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Valid credentials
    const user = results[0];
    return res.status(200).json(user);
  });
});


app.get('/api/checkUsername/:username', (req, res) => {
  const username = req.params.username;
  const query = `SELECT * FROM user WHERE username = ?`;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while checking the username' });
    }

    res.json({ available: results.length === 0 });
  });
});

app.get('/api/checkEmail/:email', (req, res) => {
  const email = req.params.email;
  const query = `SELECT * FROM user WHERE email = ?`;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while checking the email' });
    }

    res.json({ available: results.length === 0 });
  });
});

app.post("/api/registerUser", (req, res) => {
  const { username, email, password } = req.body;
  const query = `INSERT INTO user(username, password, register, email) VALUES (?, ?, NOW(), ?)`;
  const values = [username, password, email];
  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(results);
  })
});

app.get("api/userdata", (req, res) => {
  const email = req.body;
  db.query("SELECT * FROM user WHERE email = ?", email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json(results);
  })
});

app.post("/api/updateUser", (req, res) => {
  const { oldUsername, username, email, password, address, bio } = req.body;
  // console.log(req.body);
  const query = `UPDATE user SET username = ?, email = ?, password = ?, address = ?, bio = ? WHERE username = ?`;
  const values = [username, email, password, address, bio, oldUsername];
  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
    return res.status(200).send("Updated Successfully!");
  })
});

app.post("/api/addProduct", (req, res) => {
  const { id, pName, pPrice, pQuantity, pType, pDetails, pVisibility } = req.body;
  // console.log(req.body);
  const query = `INSERT INTO user_products(name, price, quantity, user_id, type, status, details, visibility, date) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, NOW())`;
  const values = [pName, pPrice, pQuantity, id, pType, pDetails, pVisibility];
  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
    const id = results.insertId;
    return res.status(200).json({ id: id });
  });
});

app.post("/api/adminLogin", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM admin WHERE username = ? and password = ?";
  const values = [username, password];
  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      console.log("wrong");
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = results[0];
    return res.status(200).json(user);
  })
});

app.post("/api/updateProductStatus", (req, res) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || !ids.every(id => typeof id === 'number')) {
    return res.status(400).json({ error: 'Invalid "ids" array: must be an array of numbers' });
  }

  if (typeof status !== 'string' || status.trim() === '') {
    return res.status(400).json({ error: 'Invalid "status": must be a non-empty string' });
  }
  const query = "UPDATE user_products SET status = ? WHERE id IN (?)";
  const values = [status, ids];
  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json("Updated status successfully");
  });
});

app.post("/api/updateProductSold", (req, res) => {
  const { id, status } = req.body;
  const query = "UPDATE user_products SET status = ? WHERE id = ?";
  const values = [status, id];
  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    // console.log(id + status);
    return res.status(200).json("Updated status successfully");
  });
});

app.post("/api/addImage", (req, res) => {
  const { pId, url1 } = req.body;
  const query = "INSERT INTO product_images(product_id, image_url) VALUES (?, ?)";
  const values = [pId, url1];
  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json("Inserted Image successfully");
  })
});


app.post("/api/getUsers", (req, res) => {
  // Validate request body (basic validation)
  const searchTerm = req.body;
  // console.log(searchTerm);

  const sql = 'SELECT id, username FROM user WHERE username LIKE ?';
  // const values = [`%${sanitizedTerm}%`];

  db.query(sql, [`${Object.values(searchTerm)}%`], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // console.log(results);
    return res.status(200).json(results);
  });
});

app.get("/api/getAllProducts", (req, res) => {
  const query = "SELECT p.*, u.username, i.image_url FROM user u JOIN user_products p JOIN product_images i ON u.id = p.user_id AND p.id = i.product_id WHERE p.status = 'accepted'"
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err: "Internal Server Error" });
    }
    // console.log(results);
    return res.status(200).json(results);
  });
});

app.get("/api/getAllProductsSort", (req, res) => {
  const sort = req.query.sort;
  const filter = req.query.filter;
  var query = `SELECT p.*, u.username, i.image_url FROM user u JOIN user_products p JOIN product_images i ON u.id = p.user_id AND p.id = i.product_id WHERE p.status = 'accepted' AND p.type = '${filter}' ORDER BY ${sort}`;
  if(filter == ''){
  // console.log(sort);
  query = `SELECT p.*, u.username, i.image_url FROM user u JOIN user_products p JOIN product_images i ON u.id = p.user_id AND p.id = i.product_id WHERE p.status = 'accepted' ORDER BY ${sort}`;
  }
  db.query(query, [], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    // console.log(results);
    return res.status(200).json(results);
  })
})

app.get('/api/getProductsByType/:filter', (req, res) => {
  const filter = req.params.filter;
  console.log(filter);
  const query = `SELECT p.*, u.username, i.image_url FROM user u JOIN user_products p JOIN product_images i ON u.id = p.user_id AND p.id = i.product_id WHERE p.status = 'accepted' AND type = ?`;
  db.query(query, [filter], (err, results) => {
    if(err){
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log(results);
    return res.status(200).json(results);
  })
});

app.get("/api/getFavoriteProducts/:ids", (req, res) => {
  const idString = req.params.ids;
  const ids = idString.split(',');
  console.log(ids);
  const query = "SELECT p.*, u.username, i.image_url FROM user u JOIN user_products p JOIN product_images i ON u.id = p.user_id AND p.id = i.product_id WHERE p.status = 'accepted' AND p.id IN (?)";
  db.query(query, [ids], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ err: "Internal Server Error" });
    }
    console.log(results);
    return res.status(200).json(results);
  })
})

app.get("/api/getFavorites/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const query = `SELECT product_id FROM favorites WHERE user_id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (results.length === 0) {
      // console.log(results);
      return res.status(200).json({ message: 'No favorites' });
    } else {
      const data = results.map(row => row.product_id);
      // console.log(data);
      return res.status(200).json(data);
    }
  });
});

app.get("/api/getFavoritesNb", (req, res) => {
  const query = 'SELECT product_id, COUNT(*) AS total_count FROM favorites GROUP BY product_id';
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    // console.log(results);
    return res.status(200).json(results);
  })
})

app.post("/api/addFavorites", (req, res) => {
  const { id, userId } = req.body;
  const query = `INSERT INTO favorites(user_id, product_id) VALUES (?, ?)`;
  const values = [userId, id];
  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json(results);
  });
});

app.post("/api/removeFavorites", (req, res) => {
  const { id, userId } = req.body;
  const query = `DELETE FROM favorites WHERE user_id = ? AND product_id = ?`;
  const values = [userId, id];
  db.query(query, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json(results);
  });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
});
