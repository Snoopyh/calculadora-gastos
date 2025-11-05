import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = () => {
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyReport();
  }, []);

  const fetchMonthlyReport = async () => {
    try {
      const now = new Date();
      const response = await axios.get('/reports/monthly', {
        params: {
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
      });
      setMonthlyReport(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Carregando...</div>;
  }

  if (!monthlyReport) {
    return <div className="text-center">Nenhum dado encontrado</div>;
  }

  const { summary, suggestions } = monthlyReport;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Receitas</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            R$ {summary.totalRevenues.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Despesas</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            R$ {summary.totalExpenses.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Lucro Líquido</h3>
          <p
            className={`mt-2 text-3xl font-bold ${
              summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            R$ {summary.netProfit.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Margem de Lucro</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {summary.profitMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Sugestões</h2>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
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

      {/* Month Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-sm text-gray-500">
          Relatório de {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

