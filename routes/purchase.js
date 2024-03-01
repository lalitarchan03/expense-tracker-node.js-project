const express = require('express');
const router = express.Router();

const purchaseControllers = require('../controllers/purchase');

const userAuthorization = require('../middleware/auth');

router.get('/premium-membership', userAuthorization.authenticate, purchaseControllers.purchasePremium);
router.post('/update-transaction-status', userAuthorization.authenticate, purchaseControllers.updateTransactionStatus);

module.exports = router;