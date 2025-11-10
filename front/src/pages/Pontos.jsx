import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, ArrowLeft, ShoppingCart } from 'lucide-react';
import { api } from '../config/api';
import { useAuth } from '../context/AuthContext';

export default function Pontos() {
  const [pontos, setPontos] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Pegar o nome do usuário
  const userName = user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Cliente';
  const firstName = userName.split(' ')[0];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [pontosData, statsData] = await Promise.all([
        api.buscarPontos(),
        api.buscarEstatisticas()
      ]);
      
      setPontos(pontosData.data);
      setEstatisticas(statsData.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    );
  }

  const totalPontos = pontos?.total_pontos || 0;
  // Calcular próximo brinde baseado em palhas (não pontos)
  const totalPalhas = estatisticas?.total_palhas || 0;
  const brindesDisponiveis = estatisticas?.brindes_disponiveis || 0;
  const palhasParaProximoBrinde = 5 - (totalPalhas % 5);
  const proximoBrinde = palhasParaProximoBrinde === 5 ? 5 : palhasParaProximoBrinde;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <button
          onClick={() => navigate('/comprar')}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800">
          Seus Pontos, {firstName}! 🎁
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Aqui está todo seu progresso na Palha Italiana
        </p>
      </div>

      {/* Aviso de Brindes Disponíveis */}
      {brindesDisponiveis > 0 && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white">
            <div className="text-center">
              <Gift className="w-12 h-12 mx-auto mb-3" />
              <p className="text-2xl font-bold mb-1">
                🎉 Parabéns! Você tem {brindesDisponiveis} {brindesDisponiveis === 1 ? 'palha grátis' : 'palhas grátis'} esperando!
              </p>
              <p className="text-sm opacity-90">
                É só procurar a gente para resgatar seu brinde 🍫
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Card de Pontos Principais */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl p-8 text-white">
          <div className="text-center">
            <p className="text-xl opacity-90 mb-2">Total de Pontos</p>
            <p className="text-7xl font-bold mb-4">{totalPontos}</p>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-sm mb-1">Próximo brinde em:</p>
              <p className="text-2xl font-bold">
                {proximoBrinde === 5 ? 5 : proximoBrinde} {proximoBrinde === 1 ? 'palha' : 'palhas'}
              </p>
              <p className="text-xs opacity-90 mt-1">
                {totalPalhas} palhas compradas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {estatisticas && (
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Estatísticas</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Total de Palhas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <div className="text-3xl">🍫</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Palhas</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {estatisticas.total_palhas}
                  </p>
                </div>
              </div>
            </div>

            {/* Brindes Disponíveis */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Gift className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Brindes</p>
                  <p className="text-3xl font-bold text-green-600">
                    {brindesDisponiveis}
                  </p>
                  <p className="text-xs text-gray-500">disponíveis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botão Comprar Mais */}
      <div className="max-w-2xl mx-auto mt-8">
        <button
          onClick={() => navigate('/comprar')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-6 h-6" />
          Comprar mais e ganhar pontos!
        </button>
      </div>
    </div>
  );
}

