import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, nome);
        setSuccess('✅ Cadastro realizado! Verifique seu email para confirmar sua conta antes de fazer login.');
        
        // Limpar formulário
        setEmail('');
        setPassword('');
        setNome('');
        
        // Voltar para tela de login após 5 segundos
        setTimeout(() => {
          setIsRegister(false);
          setSuccess('');
        }, 5000);
      } else {
        await login(email, password);
        
        // Verificar se é vendedor para redirecionar corretamente
        try {
          const vendedorResponse = await fetch('http://localhost:3000/api/compras', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          });
          const vendedorData = await vendedorResponse.json();
          
          if (vendedorData.is_vendedor) {
            navigate('/vendedor');
          } else {
            navigate('/comprar');
          }
        } catch (err) {
          // Se der erro ao verificar, vai para comprar mesmo
          navigate('/comprar');
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao fazer login';
      
      // Mensagem mais amigável para erro de confirmação de email
      if (errorMessage.includes('Email not confirmed') || errorMessage.includes('confirm')) {
        setError('⚠️ Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada!');
      } else if (errorMessage.includes('Invalid login credentials')) {
        setError('❌ Email ou senha incorretos. Verifique seus dados!');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🍫</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Palha Italiana
            </h1>
            <p className="text-gray-600">
              Sistema de Fidelidade
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Seu nome"
                  required={isRegister}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Carregando...' : isRegister ? 'Cadastrar' : 'Entrar'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccess('');
              }}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {isRegister ? 'Já tem conta? Fazer login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🎁 Compre 5 palhas e ganhe 1 de brinde!</p>
          {isRegister && (
            <p className="mt-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg">
              📧 Após o cadastro, você receberá um email de confirmação. Confirme seu email antes de fazer login!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

