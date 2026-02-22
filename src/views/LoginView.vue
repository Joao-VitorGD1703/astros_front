<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, ArrowRight, User, Mail, Lock, UserPlus, LogIn } from 'lucide-vue-next'

const router = useRouter()
const isRegister = ref(false)

const API_BASE_URL = 'https://astrologic-latest.onrender.com';

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: ''
})

const errorMessage = ref('');
const loading = ref(false);

const toggleMode = () => {
  isRegister.value = !isRegister.value
  errorMessage.value = '';
  // Reset form
  form.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: ''
  }
}

const handleAuth = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    if (isRegister.value) {
      if (form.value.password !== form.value.confirmPassword) {
        errorMessage.value = "Passwords do not match!";
        loading.value = false;
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.value.name,
          email: form.value.email,
          senha: form.value.password,
          idade: Number(form.value.age) || 0
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Render or backend message can vary check for message or details
        throw new Error(data.message || data.error || 'Registration failed');
      }
      
      alert('Account created successfully! Please log in.');
      toggleMode();
      
    } else {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: form.value.email, 
          senha: form.value.password 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      
      localStorage.setItem('token', data.token);
      router.push('/chat');
    }
  } catch (err) {
    errorMessage.value = err.message || 'An error occurred';
    console.error("Auth Error:", err);
  } finally {
    loading.value = false;
  }
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
      <p class="subtitle">
        {{ isRegister ? 'Join the cosmos' : 'Unlock the secrets of the cosmos' }}
      </p>
      
      <form @submit.prevent="handleAuth" class="auth-form">
        <div v-if="errorMessage" style="color: #ff6b6b; text-align: left; padding: 0.5rem; background: rgba(255, 107, 107, 0.1); border-radius: 8px; font-size: 0.9rem;">
          {{ errorMessage }}
        </div>
        <!-- Name Field (Register Only) -->
        <div v-if="isRegister" class="input-group">
          <div class="icon-wrapper">
            <User :size="20" />
          </div>
          <input 
            v-model="form.name"
            type="text" 
            placeholder="Your Name" 
            required 
            class="glass-input"
          />
        </div>

        <!-- Age Field (Register Only) -->
        <div v-if="isRegister" class="input-group">
          <div class="icon-wrapper">
            <User :size="20" />
          </div>
          <input 
            v-model="form.age"
            type="number" 
            placeholder="Your Age" 
            required 
            min="1"
            class="glass-input"
          />
        </div>

        <!-- Email Field -->
        <div class="input-group">
          <div class="icon-wrapper">
            <Mail :size="20" />
          </div>
          <input 
            v-model="form.email"
            type="email" 
            placeholder="Email Address" 
            required 
            class="glass-input"
          />
        </div>

        <!-- Password Field -->
        <div class="input-group">
          <div class="icon-wrapper">
            <Lock :size="20" />
          </div>
          <input 
            v-model="form.password"
            type="password" 
            placeholder="Password" 
            required 
            class="glass-input"
          />
        </div>

        <!-- Confirm Password (Register Only) -->
        <div v-if="isRegister" class="input-group">
          <div class="icon-wrapper">
            <Lock :size="20" />
          </div>
          <input 
            v-model="form.confirmPassword"
            type="password" 
            placeholder="Confirm Password" 
            required 
            class="glass-input"
          />
        </div>

        <button type="submit" class="enter-btn" :disabled="loading" :style="{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }">
          <span>{{ loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Enter Cosmic Chat') }}</span>
          <ArrowRight v-if="!loading" :size="20" />
        </button>
      </form>

      <div class="toggle-container">
        <p>
          {{ isRegister ? 'Already have an account?' : "Don't have an account?" }}
          <button type="button" @click="toggleMode" class="toggle-btn">
            {{ isRegister ? 'Login' : 'Sign Up' }}
          </button>
        </p>
      </div>
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
  transition: all 0.3s ease;
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
  margin-bottom: 2rem;
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-wrapper {
  position: absolute;
  left: 15px;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  pointer-events: none;
}

.glass-input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  border-radius: 12px;
  border: 1px solid rgba(138, 109, 200, 0.2);
  background: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  font-family: inherit;
  color: var(--text-main);
  transition: all 0.3s ease;
  outline: none;
}

.glass-input:focus {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(138, 109, 200, 0.1);
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
  margin-top: 0.5rem;
}

.enter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(138, 109, 200, 0.6);
}

.toggle-container {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-top: 1rem;
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 0 4px;
}

.toggle-btn:hover {
  text-decoration: underline;
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
