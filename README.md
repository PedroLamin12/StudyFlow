# ⚡ StudyFlow

**Transforme sua rotina de estudos em uma experiência gamificada e produtiva.**

StudyFlow é uma aplicação web de organização e produtividade acadêmica que combina gerenciamento de tarefas, cronograma semanal inteligente e um sistema de gamificação com XP e níveis para manter a motivação em alta. Desenvolvido com React, Vite e Firebase, o projeto oferece autenticação real, sincronização em tempo real na nuvem e uma interface responsiva que se adapta perfeitamente a qualquer dispositivo.

🔗 **Acesse agora:** [studyflow-v4.vercel.app](https://studyflow-v4.vercel.app)

---

## 🎯 Funcionalidades

### Autenticação & Segurança
- Login e cadastro com **Firebase Authentication** (e-mail e senha)
- Guardas de rota protegidas — acesso ao Dashboard apenas para usuários autenticados
- Validação rigorosa de formulários (regex de e-mail, senha mínima de 6 caracteres)
- Sanitização de inputs contra ataques XSS

### Gerenciamento de Tarefas
- Criação, conclusão e organização de tarefas por matéria, prioridade e data
- Calendário semanal dinâmico com visualização de tarefas por dia
- Calendário mensal completo com marcadores visuais de prioridade
- Sincronização em tempo real com **Cloud Firestore** — dados salvos na nuvem do Google

### Gamificação
- Sistema de progressão: **Nível 1** com fórmula matemática `Nível × 200 XP` para subir
- **+50 XP** por tarefa concluída com barra de progresso animada em tempo real
- Alerta visual de **Level Up** com animação
- Conquistas dinâmicas que desbloqueiam automaticamente ao atingir metas

### Interface & Experiência
- Layout **100% responsivo** (Mobile-First):
  - Mobile: Bottom Navigation + coluna única
  - Desktop: Grid de 3 colunas (Sidebar + Feed + Painel de Engajamento)
- **Dark/Light Mode** com switch de tema persistente
- Edição inline de perfil (nome e instituição) com ícone de lápis
- Upload de avatar com preview em tempo real
- Microinterações e transições suaves em toda a interface

### Sincronização Multi-Dispositivo
- Dados de tarefas, XP, nível e perfil sincronizados via Firestore
- Listeners em tempo real (`onSnapshot`) — alterações refletem instantaneamente em todos os dispositivos conectados
- Cada usuário possui dados isolados vinculados ao seu `uid` único

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, Vite 4 |
| Estilização | Tailwind CSS 3 |
| Ícones | Lucide React |
| Autenticação | Firebase Authentication |
| Banco de Dados | Cloud Firestore |
| Deploy | Vercel |

---

## 📁 Estrutura do Projeto

```
src/
├── contexts/          # ThemeContext (tema global) e AppContext (estado da aplicação)
├── services/          # firebase.js, authService.js, databaseService.js
├── views/             # Login, Home, Calendario, Conquistas, Perfil
├── components/        # Sidebar, BottomNavigation, RightPanel, TaskCard, NewTaskModal, LevelUpAlert
├── index.css          # Estilos globais e animações
└── main.jsx           # Entry point
```

---

## 🚀 Como Rodar Localmente

**Pré-requisitos:** Node.js 16+ instalado.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/studyflow.git
cd studyflow

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173`.

---

## 🌐 Deploy

O projeto está publicado e acessível em produção:

**https://studyflow-v4.vercel.app**

---

## 📄 Licença

Este projeto é de uso pessoal e educacional.

---

<p align="center">
  Feito com dedicação e muitas linhas de código. ⚡
</p>
