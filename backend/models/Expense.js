import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Valor é obrigatório'],
      min: [0, 'Valor não pode ser negativo'],
    },
    category: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      enum: [
        'aluguel',
        'fornecedores',
        'impostos',
        'salarios',
        'marketing',
        'equipamentos',
        'utilitarios',
        'transportes',
        'outros',
      ],
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
expenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Expense', expenseSchema);

