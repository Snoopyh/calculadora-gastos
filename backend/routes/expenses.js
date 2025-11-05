import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/expenses
// @desc    Get all expenses for user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { month, year, category } = req.query;
    const query = { userId: req.user._id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar despesas', error: error.message });
  }
});

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Private
router.post(
  '/',
  [
    body('description').trim().notEmpty().withMessage('Descrição é obrigatória'),
    body('amount').isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
    body('category').notEmpty().withMessage('Categoria é obrigatória'),
    body('date').optional().isISO8601().withMessage('Data inválida'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const expense = await Expense.create({
        ...req.body,
        userId: req.user._id,
      });

      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar despesa', error: error.message });
    }
  }
);

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put(
  '/:id',
  [
    body('amount').optional().isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
    body('date').optional().isISO8601().withMessage('Data inválida'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });

      if (!expense) {
        return res.status(404).json({ message: 'Despesa não encontrada' });
      }

      Object.assign(expense, req.body);
      await expense.save();

      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar despesa', error: error.message });
    }
  }
);

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Despesa não encontrada' });
    }

    res.json({ message: 'Despesa removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar despesa', error: error.message });
  }
});

export default router;

