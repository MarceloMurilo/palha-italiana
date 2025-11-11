import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, RefreshCw, LogOut, Gift } from 'lucide-react';
import { api } from '../config/api';
import { useAuth } from '../context/AuthContext';

export default function Vendedor() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pendente');
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [showBrindes, setShowBrindes] = useState(false);
  
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Proteger rota: se NÃO for vendedor, redireciona para /comprar
  useEffect(() => {
    if (user && user.user_metadata?.is_vendedor !== true) {
      console.log('🚫 Cliente tentando acessar /vendedor - redirecionando para /comprar');
      navigate('/comprar');
    }
  }, [user, navigate]);

  useEffect(() => {
    carregarCompras();
    // Auto-reload a cada 10 segundos
    const interval = setInterval(carregarCompras, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const carregarCompras = async () => {
    try {
      const data = await api.listarCompras(filter);
      setCompras(data.data);
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarClientesComBrindes = async () => {
    setLoadingClientes(true);
    try {
      const data = await api.listarClientesComBrindes();
      setClientes(data.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      alert('Erro ao carregar clientes: ' + error.message);
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleDarBaixaBrinde = async (usuarioId, clienteNome) => {
    if (!confirm(`Confirmar entrega do brinde para ${clienteNome}?\n\nAs palhas que geraram brindes serão zeradas, mas as restantes serão mantidas.`)) return;
    
    try {
      const response = await api.darBaixaNoBrinde(usuarioId);
      alert(response.message || '✅ Brinde entregue com sucesso!');
      carregarClientesComBrindes(); // Recarrega lista
    } catch (error) {
      alert('Erro ao dar baixa: ' + error.message);
    }
  };

  const handleConfirmar = async (id) => {
    if (!confirm('Confirmar esta compra?')) return;
    
    try {
      await api.confirmarCompra(id);
      carregarCompras();
      alert('Compra confirmada com sucesso!');
    } catch (error) {
      alert('Erro ao confirmar: ' + error.message);
    }
  };

  const handleRejeitar = async (id) => {
    if (!confirm('Rejeitar esta compra?')) return;
    
    try {
      await api.rejeitarCompra(id);
      carregarCompras();
      alert('Compra rejeitada!');
    } catch (error) {
      alert('Erro ao rejeitar: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const comprasPendentes = compras.filter(c => c.status === 'pendente').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              🛒 Painel do Vendedor
            </h1>
            {comprasPendentes > 0 && (
              <p className="text-sm text-orange-600 font-semibold mt-1">
                {comprasPendentes} compra(s) aguardando confirmação
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={carregarCompras}
              className="bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              title="Atualizar"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Toggle Compras / Brindes */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowBrindes(false)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              !showBrindes
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📦 Compras
          </button>
          <button
            onClick={() => {
              setShowBrindes(true);
              carregarClientesComBrindes();
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              showBrindes
                ? 'bg-green-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Gift className="w-4 h-4 inline mr-1" />
            Brindes
          </button>
        </div>

        {/* Filtros (apenas se showBrindes = false) */}
        {!showBrindes && (
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('pendente')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === 'pendente'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Pendentes
            </button>
            <button
              onClick={() => setFilter('confirmado')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === 'confirmado'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Confirmadas
            </button>
            <button
              onClick={() => setFilter('rejeitado')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === 'rejeitado'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <XCircle className="w-4 h-4 inline mr-1" />
              Rejeitadas
            </button>
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto space-y-4">
        {!showBrindes ? (
          // Lista de Compras
          loading ? (
            <div className="text-center py-12">
              <div className="text-2xl">Carregando...</div>
            </div>
          ) : compras.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600">Nenhuma compra encontrada</p>
            </div>
          ) : (
            compras.map((compra) => (
              <div
                key={compra.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xl font-bold text-gray-800 mb-1">
                      👤 {compra.cliente_nome || 'Cliente'}
                    </p>
                    {compra.cliente_email && (
                      <p className="text-xs text-gray-500 mb-2">
                        📧 {compra.cliente_email}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(compra.criado_em).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {compra.quantidade} palhas + {compra.bonus} brindes
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      R$ {parseFloat(compra.valor_total).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        compra.status === 'pendente'
                          ? 'bg-orange-100 text-orange-700'
                          : compra.status === 'confirmado'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {compra.status === 'pendente' && '⏳ Pendente'}
                      {compra.status === 'confirmado' && '✅ Confirmado'}
                      {compra.status === 'rejeitado' && '❌ Rejeitado'}
                    </span>
                  </div>
                </div>

                {compra.status === 'pendente' && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleConfirmar(compra.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleRejeitar(compra.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Rejeitar
                    </button>
                  </div>
                )}

                {compra.confirmado_em && (
                  <p className="text-xs text-gray-500 mt-3">
                    {compra.status === 'confirmado' ? 'Confirmado' : 'Rejeitado'} em:{' '}
                    {new Date(compra.confirmado_em).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            ))
          )
        ) : (
          // Lista de Clientes com Brindes
          loadingClientes ? (
            <div className="text-center py-12">
              <div className="text-2xl">Carregando clientes...</div>
            </div>
          ) : clientes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🎁</div>
              <p className="text-xl text-gray-600">Nenhum cliente com brinde disponível</p>
            </div>
          ) : (
            clientes.map((cliente) => (
              <div
                key={cliente.usuario_id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-800 mb-1">
                      👤 {cliente.nome}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      📧 {cliente.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      🍫 {cliente.total_palhas} palhas compradas
                    </p>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      🎁 {cliente.brindes_disponiveis} {cliente.brindes_disponiveis === 1 ? 'brinde' : 'brindes'} disponível
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDarBaixaBrinde(cliente.usuario_id, cliente.nome)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Gift className="w-5 h-5" />
                  Entregar Brinde
                </button>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  ⚠️ As palhas restantes (não usadas) serão mantidas
                </p>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

