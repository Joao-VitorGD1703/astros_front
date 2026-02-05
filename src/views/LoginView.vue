<script setup>
import { useRouter } from 'vue-router'
import { Sparkles, ArrowRight } from 'lucide-vue-next'

const router = useRouter()

const handleLogin = () => {
  router.push('/chat')
}
</script>

<template>
  <div class="login-page">
    <div class="background-effects">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>
    
    <div class="login-card">
      <div class="icon-container">
        <Sparkles class="sparkle-icon" :size="48" />
      </div>
      
      <h1>AstraBot</h1>
      <p class="subtitle">Unlock the secrets of the cosmos</p>
      
      <button @click="handleLogin" class="enter-btn">
        <span>Enter Cosmic Chat</span>
        <ArrowRight :size="20" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-page {
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
  background: var(--primary-color);
  top: 10%;
  left: 20%;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--secondary-color);
  bottom: 10%;
  right: 15%;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
  100% { transform: translateY(0px); }
}

.login-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  padding: 3rem 4rem;
  border-radius: 24px;
  text-align: center;
  max-width: 450px;
  width: 90%;
  animation: fadeUp 0.8s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.icon-container {
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: inline-block;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, var(--primary-color), #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
}

.enter-btn {
  background: linear-gradient(90deg, var(--primary-color), #a29bfe);
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
  box-shadow: 0 4px 15px rgba(138, 109, 200, 0.4);
}

.enter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(138, 109, 200, 0.6);
  box-shadow: 0 6px 20px rgba(138, 109, 200, 0.6);
}

@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
    width: 90%;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style>
