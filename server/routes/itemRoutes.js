import express from 'express';
import { getItems, createItem, resolveItem, deleteItem } from '../controllers/itemController.js';

const router = express.Router();

router.get('/', getItems);
router.post('/', createItem);
router.patch('/:id/resolve', resolveItem);
router.delete('/:id', deleteItem);

export default router;
