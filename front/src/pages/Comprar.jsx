import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Gift, LogOut, Copy, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../config/api';

export default function Comprar() {
  const [palhasSelecionadas, setPalhasSelecionadas] = useState([false, false, false, false, false]);
  const [loading, setLoading] = useState(false);
  const [showPix, setShowPix] = useState(false);
  const [compraId, setCompraId] = useState(null);
  const [pixCopiado, setPixCopiado] = useState(false);
  const [palhasBloqueadas, setPalhasBloqueadas] = useState([false, false, false, false, false]);
  const [loadingPalhas, setLoadingPalhas] = useState(true);
  
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Pegar o nome do usuário (ou primeiro nome do email)
  const userName = user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Cliente';
  const firstName = userName.split(' ')[0];

  const CHAVE_PIX = '98982832657';
  const MAX_PALHAS = 5;

  const PRECO_UNITARIO = 5.00;
  const quantidade = palhasSelecionadas.filter(Boolean).length;
  const valorTotal = (quantidade * PRECO_UNITARIO).toFixed(2);
  const bonus = Math.floor(quantidade / 5);
  const palhasDisponiveisCount = palhasBloqueadas.filter(b => !b).length;

  // Proteger rota: se for vendedor, redireciona para /vendedor
  useEffect(() => {
    if (user?.user_metadata?.is_vendedor === true) {
      console.log('🚫 Vendedor tentando acessar /comprar - redirecionando para /vendedor');
      navigate('/vendedor');
    }
  }, [user, navigate]);

  // Carregar palhas bloqueadas ao montar o componente
  useEffect(() => {
    carregarPalhasBloqueadas();

    // Atualizar palhas quando a página ganhar foco (quando voltar de outra aba/página)
    const handleFocus = () => {
      carregarPalhasBloqueadas();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const carregarPalhasBloqueadas = async () => {
    try {
      const result = await api.listarCompras('pendente');
      
      // Criar array de bloqueio baseado nas compras pendentes
      const novasBloqueadas = [false, false, false, false, false];
      let posicao = 0;
      
      // Para cada compra pendente, bloquear as palhas na sequência
      result.data.forEach(compra => {
        for (let i = 0; i < compra.quantidade && posicao < 5; i++) {
          novasBloqueadas[posicao] = true;
          posicao++;
        }
      });
      
      setPalhasBloqueadas(novasBloqueadas);
    } catch (error) {
      console.error('Erro ao carregar palhas bloqueadas:', error);
    } finally {
      setLoadingPalhas(false);
    }
  };

  const handlePalhaClick = (index) => {
    // Se a palha está bloqueada, não permite selecionar
    if (palhasBloqueadas[index]) return;
    
    // Toggle da seleção
    const novasSelecionadas = [...palhasSelecionadas];
    novasSelecionadas[index] = !novasSelecionadas[index];
    setPalhasSelecionadas(novasSelecionadas);
    setShowPix(false);
  };

  const handleConfirmarCompra = async () => {
    if (quantidade === 0) return;
    
    setLoading(true);
    try {
      const result = await api.criarCompra(quantidade, parseFloat(valorTotal));
      setCompraId(result.data.id);
      setShowPix(true);
    } catch (error) {
      alert('Erro ao criar compra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEuPaguei = () => {
    // Limpa as seleções e recarrega as palhas bloqueadas
    setPalhasSelecionadas([false, false, false, false, false]);
    carregarPalhasBloqueadas();
    alert('Pagamento registrado! Aguarde a confirmação do vendedor. Suas palhas foram reservadas.');
    navigate('/pontos');
  };

  const copiarChavePix = async () => {
    try {
      await navigator.clipboard.writeText(CHAVE_PIX);
      setPixCopiado(true);
      setTimeout(() => setPixCopiado(false), 2000);
    } catch (err) {
      alert('Chave copiada: ' + CHAVE_PIX);
    }
  };

  const abrirAppBanco = () => {
    // Tenta abrir o app do banco com deep link
    // A maioria dos bancos suporta links pix://
    const pixUrl = `https://nubank.com.br/pagar/${CHAVE_PIX}/${valorTotal}`;
    window.location.href = pixUrl;
    
    // Fallback: se não abrir em 2 segundos, apenas copia a chave
    setTimeout(() => {
      copiarChavePix();
    }, 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Olá, {firstName}! 🍫
          </h1>
          <p className="text-sm text-gray-600">Bem-vindo à Palha Italiana — é ótimo te ver por aqui!</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/pontos')}
            className="bg-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Gift className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium">Pontos</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-white p-2 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Card Principal */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        {!showPix ? (
          <>
            {/* Título */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Quantas palhas você levou hoje?
            </h2>

            {/* Aviso de Palhas Disponíveis */}
            {palhasBloqueadas.some(Boolean) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Lock className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    {palhasBloqueadas.filter(Boolean).length} palha(s) aguardando confirmação
                  </p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Você tem {palhasDisponiveisCount} palha(s) disponível(is) para comprar agora
                </p>
              </div>
            )}

            {/* Seletor de Palhas - Individual */}
            <div className="grid grid-cols-5 gap-3 mb-8">
              {palhasSelecionadas.map((selecionada, index) => {
                const estaBloqueada = palhasBloqueadas[index];
                
                return (
                  <button
                    key={index}
                    onClick={() => handlePalhaClick(index)}
                    disabled={estaBloqueada}
                    className={`aspect-square rounded-2xl border-4 transition-all relative ${
                      estaBloqueada
                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                        : selecionada
                        ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:scale-105'
                    }`}
                  >
                    <div className="text-5xl">🍫</div>
                    {estaBloqueada && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30 rounded-xl">
                        <Lock className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    {selecionada && !estaBloqueada && (
                      <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-center text-sm text-gray-600 mb-6">
              👆 Clique nas palhas para selecionar quais você comprou
            </p>

            {/* Info da Compra */}
            {quantidade > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800 mb-2">
                    {quantidade} {quantidade === 1 ? 'palha' : 'palhas'} — R$ {valorTotal}
                  </p>
                  {bonus > 0 && (
                    <p className="text-orange-600 font-semibold flex items-center justify-center gap-2">
                      <Gift className="w-5 h-5" />
                      Você ganhou {bonus} de brinde!
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    Após a compra, você terá {palhasDisponiveisCount - quantidade} palha(s) disponível(is)
                  </p>
                </div>
              </div>
            )}

            {loadingPalhas && (
              <div className="text-center text-gray-500 py-4">
                Carregando palhas disponíveis...
              </div>
            )}

            {/* Botão Confirmar */}
            <button
              onClick={handleConfirmarCompra}
              disabled={quantidade === 0 || loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Carregando...'
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  Confirmar compra
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Tela de PIX */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Pague com PIX
            </h2>

            {/* Chave Pix - Destaque */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-600 text-center mb-2">📱 Chave Pix (Telefone)</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <p className="text-3xl font-bold text-gray-800 tracking-wide">
                  {CHAVE_PIX}
                </p>
              </div>
              
              {/* Botão Copiar */}
              <button
                onClick={copiarChavePix}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                  pixCopiado
                    ? 'bg-green-500 text-white'
                    : 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50'
                }`}
              >
                {pixCopiado ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Chave Copiada!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar Chave Pix
                  </>
                )}
              </button>
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium mb-2">💡 Como pagar:</p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Copie a chave Pix acima</li>
                <li>Abra seu app de banco</li>
                <li>Vá em Pix → Pagar</li>
                <li>Cole a chave: <strong>{CHAVE_PIX}</strong></li>
                <li>Pague R$ <strong>{valorTotal}</strong></li>
              </ol>
            </div>

            {/* Info do Pagamento */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="text-center space-y-2">
                <p className="text-lg text-gray-700">
                  Valor: <span className="font-bold text-3xl text-orange-600">R$ {valorTotal}</span>
                </p>
                <p className="text-sm text-gray-600">
                  {quantidade} palhas{bonus > 0 && ` + ${bonus} brinde(s)`}
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <button
                onClick={handleEuPaguei}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6" />
                ✅ Eu paguei
              </button>
              <button
                onClick={() => setShowPix(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Voltar
              </button>
            </div>

            {/* Aviso */}
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>⏱️ Após o pagamento, aguarde a confirmação do vendedor</p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto mt-6 text-center text-sm text-gray-600">
        <p>🎁 A cada 5 palhas compradas, ganhe 1 de brinde!</p>
      </div>
    </div>
  );
}

