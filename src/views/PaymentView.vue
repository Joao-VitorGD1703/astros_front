<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, CreditCard, CheckCircle, RefreshCw, LogOut } from 'lucide-vue-next'

const router = useRouter()
const loading = ref(false)
const verifying = ref(false)
const errorMessage = ref('')
const user = ref(null)

const API_BASE_URL = 'https://astrologic-latest.onrender.com';
// Fallback local dev
// const API_BASE_URL = 'http://localhost:3000'; 

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (!userData) {
    router.push('/login')
    return
  }
  user.value = JSON.parse(userData)
  
  // Quick check if they already have access
  if (user.value.pagou_stripe || user.value.stripe_paga) {
    router.push('/chat')
  }
})

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('chat_history'); 
    router.push('/');
}

const gerarPagamento = async () => {
  if (!user.value || !user.value.id) return;
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.value.id })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao gerar sessão de pagamento');
    }
    
    const data = await response.json();
    
    // Redireciona o usuário para a tela de geração do PIX/Cartão da Stripe
    window.location.href = data.url;
  } catch (err) {
    console.error("Payment error:", err);
    errorMessage.value = err.message || 'Erro ao comunicar com a Stripe.';
    loading.value = false;
  }
}

const verificarPagamento = async () => {
  if (!user.value || !user.value.id) return;
  verifying.value = true;
  errorMessage.value = '';
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${user.value.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error('Não foi possível verificar status do usuário.');
    }
    
    const data = await response.json();
    
    if (data.pagou_stripe || data.stripe_paga) {
      // Update local storage
      user.value = data;
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/chat');
    } else {
      errorMessage.value = 'Pagamento ainda não confirmado. Tente novamente em alguns segundos.';
    }
  } catch (err) {
    errorMessage.value = err.message || 'Erro ao verificar pagamento.';
  } finally {
    verifying.value = false;
  }
}

</script>

<template>
  <div class="payment-page">
    <div class="background-effects">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>
    
    <button @click="handleLogout" class="logout-btn" title="Sair">
      <LogOut :size="20" /> Sair
    </button>

    <div class="payment-card">
      <div class="icon-container">
        <Sparkles class="sparkle-icon" :size="48" />
      </div>
      
      <h1>Acesso Premium</h1>
      <p class="subtitle">
        Sua jornada astrológica completa aguarda. Desbloqueie o AstroBot agora!
      </p>
      
      <div v-if="errorMessage" class="error-msg">
        {{ errorMessage }}
      </div>

      <div class="features-list">
        <div class="feature-item">
          <CheckCircle class="feature-icon" :size="20"/>
          <span>Consultas ilimitadas</span>
        </div>
        <div class="feature-item">
          <CheckCircle class="feature-icon" :size="20"/>
          <span>Mapa Astral detalhado</span>
        </div>
        <div class="feature-item">
          <CheckCircle class="feature-icon" :size="20"/>
          <span>Previsões diárias da IA</span>
        </div>
      </div>

      <div class="actions">
        <button @click="gerarPagamento" class="pay-btn" :disabled="loading">
          <CreditCard v-if="!loading" :size="20" />
          <RefreshCw v-else class="spin-icon" :size="20" />
          <span>{{ loading ? 'Redirecionando...' : 'Assinar Premium (PIX/Cartão)' }}</span>
        </button>
        
        <p class="verification-text">Já realizou o pagamento?</p>
        
        <button @click="verificarPagamento" class="verify-btn" :disabled="verifying">
          <RefreshCw :class="{ 'spin-icon': verifying }" :size="20" />
          <span>{{ verifying ? 'Verificando...' : 'Verificar Status do Pagamento' }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.payment-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: var(--accent-color);
  top: 10%;
  left: 20%;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--primary-color);
  bottom: 10%;
  right: 15%;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
  100% { transform: translateY(0px); }
}

.logout-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: var(--text-main);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.payment-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  padding: 3rem 4rem;
  border-radius: 24px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  animation: fadeUp 0.8s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.icon-container {
  color: var(--accent-color);
  margin-bottom: 1rem;
  display: inline-block;
  padding: 1rem;
  background: rgba(255, 204, 0, 0.1);
  border-radius: 50%;
  border: 1px solid rgba(255, 204, 0, 0.3);
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, var(--accent-color), #ff9900);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
  margin-bottom: 2rem;
}

.error-msg {
  color: #ff6b6b;
  text-align: center;
  padding: 0.8rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 2rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.3);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-main);
  font-weight: 500;
}

.feature-icon {
  color: #27ae60;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pay-btn {
  background: linear-gradient(90deg, var(--accent-color), #f39c12);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.pay-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(243, 156, 18, 0.6);
}

.pay-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.verification-text {
  margin-top: 1rem;
  margin-bottom: 0px;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.verify-btn {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(138, 109, 200, 0.3);
  color: var(--primary-color);
  padding: 0.8rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: all 0.3s;
}

.verify-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--primary-color);
}

.spin-icon {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .payment-card {
    padding: 2rem;
    width: 90%;
  }
  h1 {
    font-size: 1.8rem;
  }
}
</style>
