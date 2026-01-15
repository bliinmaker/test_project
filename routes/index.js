var express = require('express');
var multer = require('multer');
var jwt = require('jsonwebtoken');
var { body, validationResult } = require('express-validator');
var router = express.Router();

const JWT_SECRET = 'your-secret-key';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Returns a hello message
 *     responses:
 *       200:
 *         description: A hello message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello, World!"
 */
/* GET /hello endpoint */
router.get('/hello', function(req, res) {
  res.json({ message: "Hello, World!" });
});

/* GET /greet endpoint with name parameter */
router.get('/greet', function(req, res) {
  const name = req.query.name || 'World';
  res.json({ greeting: `Hello, ${name}!` });
});

/* POST /add endpoint for addition */
router.post('/add', function(req, res) {
  const { a, b } = req.body;
  const sum = Number(a) + Number(b);
  res.json({ sum: sum });
});

/* GET /products endpoint with category filtering */
const products = [
  { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
  { id: 2, name: 'Book', category: 'books', price: 20 },
  { id: 3, name: 'Phone', category: 'electronics', price: 599 },
  { id: 4, name: 'Novel', category: 'books', price: 15 },
  { id: 5, name: 'Tablet', category: 'electronics', price: 299 }
];

router.get('/products', function(req, res) {
  const { category } = req.query;
  
  if (category) {
    const filteredProducts = products.filter(p => p.category === category);
    res.json(filteredProducts);
  } else {
    res.json(products);
  }
});

/* POST /upload endpoint for file upload */
router.post('/upload', upload.single('file'), function(req, res) {
  if (req.file) {
    res.json({
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

/* POST /login endpoint for authentication */
router.post('/login', function(req, res) {
  const { username, password } = req.body;
  
  if (username === 'user' && password === 'pass') {
    const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

/* JWT Authentication Middleware */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

/* GET /protected endpoint */
router.get('/protected', authenticateToken, function(req, res) {
  res.json({ message: 'access allowed' });
});

/* POST /register endpoint with validation */
router.post('/register', [
  body('username').isLength({ min: 3, max: 15 }).withMessage('Username must be 3-15 characters'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('age').isInt({ min: 18, max: 99 }).withMessage('Age must be between 18-99')
], function(req, res) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  res.json({ message: 'User registered successfully' });
});

/* GET /ratelimit endpoint to test rate limiting */
router.get('/ratelimit', function(req, res) {
  res.json({ message: 'Rate limiting test endpoint' });
});

module.exports = router;
