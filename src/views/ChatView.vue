<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Send, ArrowLeft, Sparkles, User, RefreshCw } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { getAstrologyResponse } from '../services/gemini'
import { parse } from 'marked'

const router = useRouter()
const messages = ref([])
const userInput = ref('')
const messagesContainer = ref(null)
const isTyping = ref(false)

const goBack = () => {
  router.push('/')
}

const addMessage = (text, isUser = false) => {
  messages.value.push({
    id: Date.now(),
    text,
    isUser,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const processBotResponse = async (input) => {
  isTyping.value = true
  
  // Call Gemini Service with history
  // Pass a copy of existing messages (excluding the one just added? No, the one just added is in messages, but getAstrologyResponse considers 'input' as the new message)
  // We need to pass messages *excluding* the one we just added manually in sendMessage, OR handle it carefully.
  // Actually, 'addMessage' pushes to 'messages'. So 'messages' includes the user's latest input.
  // We should pass 'messages' excluding the last one (which is the current input) to be the 'history'.
  
  const historyForAI = messages.value.slice(0, -1); // Exclude the just-added user message
  const response = await getAstrologyResponse(input, historyForAI)
  
  isTyping.value = false
  addMessage(response, false)
}

const sendMessage = () => {
  const text = userInput.value.trim()
  if (!text) return
  
  addMessage(text, true)
  userInput.value = ''
  
  processBotResponse(text)
}

onMounted(() => {
  // Load messages from LocalStorage
  const savedMessages = localStorage.getItem('chat_history')
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages)
  } else {
    // Initial Greeting if no history
    setTimeout(() => {
      addMessage("Bem-vindo(a)! ✨ Que revelações cósmicas você busca hoje? Para começar, por favor me diga sua data, hora e cidade de nascimento.", false)
    }, 500)
  }
})

const saveMessages = () => {
  localStorage.setItem('chat_history', JSON.stringify(messages.value))
}

// Watch messages to save changes
import { watch } from 'vue'
watch(messages, () => {
  saveMessages()
}, { deep: true })

const clearHistory = () => {
  if (confirm('Deseja realmente limpar o histórico cósmico?')) {
    localStorage.removeItem('chat_history')
    messages.value = []
    // Reset welcome message
    setTimeout(() => {
      addMessage("Bem-vindo(a)! ✨ Que revelações cósmicas você busca hoje? Para começar, por favor me diga sua data, hora e cidade de nascimento.", false)
    }, 500)
    // Reload page to reset Gemini session context
    setTimeout(() => {
       window.location.reload()
    }, 1500)
  }
}
</script>

<template>
  <div class="chat-view">
    <!-- Header -->
    <header class="chat-header">
      <button @click="goBack" class="back-btn">
        <ArrowLeft :size="24" />
      </button>
      <div class="bot-profile">
        <div class="avatar">
          <Sparkles class="avatar-icon" />
        </div>
        <div class="bot-info">
          <h2>AstraBot</h2>
          <span class="status">Online & Ready to Explore Your Stars</span>
        </div>
      </div>
      <button @click="clearHistory" class="clear-btn" title="Limpar Histórico">
        <RefreshCw :size="20" />
      </button>
    </header>

    <!-- Messages Area -->
    <div class="messages-container" ref="messagesContainer">
      <div v-for="msg in messages" :key="msg.id" :class="['message-wrapper', msg.isUser ? 'user' : 'bot']">
        <div class="message-bubble">
          <div v-if="!msg.isUser" v-html="parse(msg.text)" class="markdown-content"></div>
          <div v-else>{{ msg.text }}</div>
          <span class="timestamp">{{ msg.timestamp }}</span>
        </div>
      </div>
      
      <div v-if="isTyping" class="message-wrapper bot">
        <div class="message-bubble typing">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <form @submit.prevent="sendMessage" class="input-form">
        <input 
          v-model="userInput" 
          type="text" 
          placeholder="Type your question..." 
          class="chat-input"
        >
        <button type="submit" class="send-btn" :disabled="!userInput.trim()">
          <Send :size="20" />
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent; /* Uses body gradient */
}

.chat-header {
  height: 80px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  z-index: 10;
}

.back-btn {
  background: transparent;
  color: var(--text-main);
  padding: 8px;
  border-radius: 50%;
}
.back-btn:hover {
  background: rgba(0,0,0,0.05);
}

.clear-btn {
  background: transparent;
  color: var(--text-muted);
  padding: 8px;
  border-radius: 50%;
  margin-left: auto; /* Pushes button to the far right */
}

.clear-btn:hover {
  background: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
  transform: rotate(180deg);
}

.bot-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a29bfe, #74b9ff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(162, 155, 254, 0.4);
}

.bot-info h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-main);
}

.status {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (max-width: 768px) {
  .messages-container {
    width: 95%;
    padding: 15px;
  }
}

@media (min-width: 1280px) {
  .messages-container {
    width: 80%;
  }
}


.message-wrapper {
  display: flex;
  max-width: 80%;
}

.message-wrapper.bot {
  align-self: flex-start;
}

.message-wrapper.user {
  align-self: flex-end;
}

.message-bubble {
  padding: 12px 18px;
  border-radius: 18px;
  font-size: 1rem;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Bot Bubble Style */
.bot .message-bubble {
  background: white;
  color: var(--text-main);
  border-bottom-left-radius: 4px;
}

/* User Bubble Style */
.user .message-bubble {
  background: linear-gradient(135deg, var(--primary-color), #a29bfe);
  color: white;
  border-bottom-right-radius: 4px;
}

.timestamp {
  display: block;
  font-size: 0.7rem;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
}

.typing span {
  display: inline-block;
  animation: blink 1.4s infinite both;
  font-size: 1.5rem;
  line-height: 10px;
  margin: 0 1px;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.input-area {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}

.input-form {
  display: flex;
  gap: 10px;
  background: #ffffff;
  padding: 8px;
  border-radius: 50px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  border: 1px solid rgba(255,255,255,1);
  width: 75%;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .input-form {
    width: 95%;
  }
  .messages-container {
    width: 95%;
    padding: 15px;
  }
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-family: inherit;
  background: transparent;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent-color); /* Gold */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  background: #ffcc00;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Markdown Styles */
:deep(.markdown-content) {
  font-size: 0.95rem;
  line-height: 1.6;
}

:deep(.markdown-content h3) {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.markdown-content h3:first-child) {
  margin-top: 0;
}

:deep(.markdown-content strong) {
  color: var(--text-main);
  font-weight: 600;
}

:deep(.markdown-content blockquote) {
  margin: 1em 0;
  padding: 12px 20px;
  background: rgba(138, 109, 200, 0.08); /* Light purple tint */
  border-left: 4px solid var(--accent-color);
  border-radius: 8px;
  color: var(--text-main);
  font-style: italic;
}

:deep(.markdown-content hr) {
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
  margin: 2em 0;
}

:deep(.markdown-content p) {
  margin-bottom: 1em;
}

:deep(.markdown-content p:last-child) {
  margin-bottom: 0;
}

</style>
