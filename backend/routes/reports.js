import express from 'express';
import { protect } from '../middleware/auth.js';
import Expense from '../models/Expense.js';
import Revenue from '../models/Revenue.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/reports/monthly
// @desc    Get monthly financial report
// @access  Private
router.get('/monthly', async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const reportMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const reportYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59);

    // Get expenses and revenues for the month
    const expenses = await Expense.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    const revenues = await Revenue.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRevenues = revenues.reduce((sum, rev) => sum + rev.amount, 0);
    const netProfit = totalRevenues - totalExpenses;
    const profitMargin = totalRevenues > 0 ? (netProfit / totalRevenues) * 100 : 0;

    // Expenses by category
    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    // Revenues by category
    const revenuesByCategory = revenues.reduce((acc, rev) => {
      acc[rev.category] = (acc[rev.category] || 0) + rev.amount;
      return acc;
    }, {});

    // Suggestions
    const suggestions = [];
    if (totalExpenses > totalRevenues) {
      suggestions.push({
        type: 'alert',
        message: '⚠️ Atenção: Despesas superam receitas este mês!',
      });
    }
    if (profitMargin < 10 && totalRevenues > 0) {
      suggestions.push({
        type: 'warning',
        message: 'Margem de lucro abaixo de 10%. Considere revisar custos.',
      });
    }

    // Find largest expense category
    const largestExpenseCategory = Object.entries(expensesByCategory).sort(
      (a, b) => b[1] - a[1]
    )[0];
    if (largestExpenseCategory && largestExpenseCategory[1] > totalExpenses * 0.4) {
      suggestions.push({
        type: 'info',
        message: `A categoria "${largestExpenseCategory[0]}" representa mais de 40% das despesas. Considere otimizar.`,
      });
    }

    res.json({
      month: reportMonth,
      year: reportYear,
      summary: {
        totalExpenses,
        totalRevenues,
        netProfit,
        profitMargin: parseFloat(profitMargin.toFixed(2)),
      },
      expensesByCategory,
      revenuesByCategory,
      suggestions,
      expensesCount: expenses.length,
      revenuesCount: revenues.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
  }
});

// @route   GET /api/reports/overview
// @desc    Get overview of last 6 months
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    const currentDate = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const expenses = await Expense.find({
        userId: req.user._id,
        date: { $gte: startDate, $lte: endDate },
      });

      const revenues = await Revenue.find({
        userId: req.user._id,
        date: { $gte: startDate, $lte: endDate },
      });

      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalRevenues = revenues.reduce((sum, rev) => sum + rev.amount, 0);
      const netProfit = totalRevenues - totalExpenses;

      months.push({
        month,
        year,
        monthName: date.toLocaleString('pt-BR', { month: 'long' }),
        totalExpenses,
        totalRevenues,
        netProfit,
      });
    }

    res.json({ months });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar overview', error: error.message });
  }
});

export default router;

