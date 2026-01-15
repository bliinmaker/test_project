var express = require('express');
var router = express.Router();

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(users);
});

/* GET specific user by ID */
router.get('/:id', function(req, res) {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    res.json({ userId: user.id, exists: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

/* PUT - Update user by ID */
router.put('/:id', function(req, res) {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    const { name } = req.body;
    users[userIndex].name = name;
    res.json({ deleted: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

/* DELETE - Delete user by ID */
router.delete('/:id', function(req, res) {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({ deleted: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;
