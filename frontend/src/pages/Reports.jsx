import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Reports = () => {
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [overview, setOverview] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    fetchReports();
    fetchOverview();
  }, [selectedMonth, selectedYear]);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/reports/monthly', {
        params: { month: selectedMonth, year: selectedYear },
      });
      setMonthlyReport(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await axios.get('/reports/overview');
      setOverview(response.data);
    } catch (error) {
      console.error('Erro ao buscar overview:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Carregando...</div>;
  }

  if (!monthlyReport) {
    return <div className="text-center">Nenhum dado encontrado</div>;
  }

  const expensesByCategory = Object.entries(monthlyReport.expensesByCategory).map(
    ([name, value]) => ({ name, value })
  );

  const revenuesByCategory = Object.entries(monthlyReport.revenuesByCategory).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <div className="flex gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i, 1).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Receitas</h3>
          <p className="mt-2 text-2xl font-bold text-green-600">
            R$ {monthlyReport.summary.totalRevenues.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Despesas</h3>
          <p className="mt-2 text-2xl font-bold text-red-600">
            R$ {monthlyReport.summary.totalExpenses.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Lucro Líquido</h3>
          <p
            className={`mt-2 text-2xl font-bold ${
              monthlyReport.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            R$ {monthlyReport.summary.netProfit.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Margem de Lucro</h3>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {monthlyReport.summary.profitMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Overview Chart */}
      {overview && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Últimos 6 Meses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overview.months}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="monthName"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2).replace('.', ',')}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalRevenues"
                stroke="#22c55e"
                strokeWidth={2}
                name="Receitas"
              />
              <Line
                type="monotone"
                dataKey="totalExpenses"
                stroke="#ef4444"
                strokeWidth={2}
                name="Despesas"
              />
              <Line
                type="monotone"
                dataKey="netProfit"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Lucro Líquido"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        {expensesByCategory.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Despesas por Categoria</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2).replace('.', ',')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Revenues by Category */}
        {revenuesByCategory.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Receitas por Categoria</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenuesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2).replace('.', ',')}`} />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {monthlyReport.suggestions && monthlyReport.suggestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Sugestões</h2>
          <div className="space-y-2">
            {monthlyReport.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  suggestion.type === 'alert'
                    ? 'bg-red-50 border border-red-200'
                    : suggestion.type === 'warning'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <p className="text-sm">{suggestion.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

