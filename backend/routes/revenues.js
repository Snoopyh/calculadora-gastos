import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Revenue from '../models/Revenue.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/revenues
// @desc    Get all revenues for user
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

    const revenues = await Revenue.find(query).sort({ date: -1 });
    res.json(revenues);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar receitas', error: error.message });
  }
});

// @route   POST /api/revenues
// @desc    Create new revenue
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

      const revenue = await Revenue.create({
        ...req.body,
        userId: req.user._id,
      });

      res.status(201).json(revenue);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar receita', error: error.message });
    }
  }
);

// @route   PUT /api/revenues/:id
// @desc    Update revenue
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

      const revenue = await Revenue.findOne({ _id: req.params.id, userId: req.user._id });

      if (!revenue) {
        return res.status(404).json({ message: 'Receita não encontrada' });
      }

      Object.assign(revenue, req.body);
      await revenue.save();

      res.json(revenue);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar receita', error: error.message });
    }
  }
);

// @route   DELETE /api/revenues/:id
// @desc    Delete revenue
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const revenue = await Revenue.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!revenue) {
      return res.status(404).json({ message: 'Receita não encontrada' });
    }

    res.json({ message: 'Receita removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar receita', error: error.message });
  }
});

export default router;

