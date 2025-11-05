import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema(
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
        'vendas',
        'servicos',
        'produtos',
        'consultoria',
        'outros',
      ],
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
revenueSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Revenue', revenueSchema);

