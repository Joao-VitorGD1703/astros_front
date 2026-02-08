<script setup>
import { useRouter } from 'vue-router'
import { Star, Moon, Heart } from 'lucide-vue-next'

const router = useRouter()

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="home-container">
    <!-- Header/Navbar -->
    <header class="main-header">
      <div class="logo">
        <i class="fas fa-meteor"></i> AstroBot
      </div>
      <nav class="nav-links">
        <a href="#" @click.prevent="navigateToLogin">Entrar</a>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Seu Futuro Já Está <br />
          <span class="highlight">Escrito nas Estrelas</span>
        </h1>
        <p class="hero-subtitle">
          Descubra o que os astros revelam sobre você. 
          Conecte-se com sua essência cósmica e encontre as respostas que procura.
        </p>
        <div class="hero-actions">
          <button @click="navigateToLogin" class="btn-primary">Ver Meu Mapa</button>
          <button class="btn-secondary">Saber Mais</button>
        </div>
      </div>
      <div class="hero-image">
        <div class="orbit">
            <div class="planet"></div>
            <div class="satellite"></div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">O Universo Fala com Você</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="icon-wrapper">
             <Star :size="32" />
          </div>
          <h3>Mapa Astral</h3>
          <p>Entenda sua personalidade e destino através da posição dos planetas.</p>
        </div>
        <div class="feature-card">
          <div class="icon-wrapper">
            <Moon :size="32" />
          </div>
          <h3>Fases da Lua</h3>
          <p>Saiba como a energia lunar influencia suas emoções e decisões.</p>
        </div>
        <div class="feature-card">
            <div class="icon-wrapper">
                <Heart :size="32" />
            </div>
          <h3>Sinastria Amorosa</h3>
          <p>Descubra a compatibilidade cósmica entre você e quem você ama.</p>
        </div>
      </div>
    </section>

    <!-- Social Proof / Footer -->
    <footer class="footer-section">
      <div class="footer-content">
        <p>&copy; 2026 AstroBot. Todos os direitos reservados.</p>
        <div class="social-links">
             <!-- Placeholders for icons if FontAwesome is available, assuming it is based on previous convos -->
             <span>Instagram</span>
             <span>LinkedIn</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent; /* Uses body gradient */
}

/* Header */
.main-header {
  padding: 1rem 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.logo {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--text-main));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  letter-spacing: -0.5px;
}

.logo i {
    -webkit-text-fill-color: initial; /* Reset gradient for icon usually, or keep it */
    color: var(--primary-color);
    font-size: 1.6rem;
    filter: drop-shadow(0 0 5px rgba(138, 109, 200, 0.5));
}

.nav-links a {
  text-decoration: none;
  color: var(--text-main);
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-links a:hover {
  color: var(--primary-color);
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 15px rgba(138, 109, 200, 0.15);
  transform: translateY(-2px);
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rem 10% 4rem; /* Increased top padding to account for fixed header */
  min-height: 100vh; /* Changed to 100vh to ensure full screen impact */
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--text-main);
}

.highlight {
  background: linear-gradient(120deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  padding: 1rem 2.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(138, 109, 200, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(138, 109, 200, 0.6);
}

.btn-secondary {
  padding: 1rem 2.5rem;
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-secondary:hover {
  background: rgba(138, 109, 200, 0.1);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Orbit Animation Placeholder */
.orbit {
    width: 300px;
    height: 300px;
    border: 2px dashed rgba(138, 109, 200, 0.3);
    border-radius: 50%;
    position: relative;
    animation: spin 20s linear infinite;
}

.planet {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    border-radius: 50%;
    box-shadow: 0 0 30px rgba(138, 109, 200, 0.5);
}

.satellite {
    position: absolute;
    top: -15px;
    left: 50%; /* Center horizontally relative to orbit */
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    background: var(--accent-color);
    border-radius: 50%;
    box-shadow: 0 0 15px var(--accent-color);
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}


/* Features Section */
.features-section {
  padding: 4rem 10%;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--text-main);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: var(--glass-shadow);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.icon-wrapper {
    background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: var(--primary-color);
}

.feature-card h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: var(--text-main);
}

.feature-card p {
  color: var(--text-muted);
  font-size: 1rem;
}

/* Footer */
.footer-section {
  padding: 2rem 10%;
  border-top: 1px solid rgba(0,0,0,0.05);
  margin-top: auto;
  text-align: center;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-muted);
}

.social-links {
    display: flex;
    gap: 1.5rem;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding-top: 2rem;
  }

  .hero-content {
    max-width: 100%;
    margin-bottom: 3rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .footer-content {
      flex-direction: column;
      gap: 1rem;
  }
}
</style>
