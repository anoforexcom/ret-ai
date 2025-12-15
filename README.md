# RetroColor AI 🎨

Uma aplicação web moderna para restaurar e colorir fotos antigas a preto e branco utilizando Inteligência Artificial (Google Gemini Vision).

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-indigo)
![Tech](https://img.shields.io/badge/Tech-React_TS_Tailwind-blue)

## 🚀 Funcionalidades

- **Restauração IA**: Remove riscos e ruído de fotos antigas.
- **Colorização Automática**: Transforma fotos a preto e branco em cores vibrantes.
- **Comparação Antes/Depois**: Slider interativo para visualizar os resultados.
- **Sistema de Loja**: Carrinho e checkout (simulado com integração PayPal/MB Way pronta).
- **Painel de Administração**: Gestão de encomendas e configurações da loja.

## 🛠️ Tecnologias Usadas

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **IA**: Google Gemini API (`gemini-2.5-flash-image`)
- **Backend/DB**: Firebase Firestore (opcional para persistência de encomendas)
- **Icons**: Lucide React

## 📦 Como Instalar

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/retrocolor-ai.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um ficheiro `.env` na raiz do projeto com a sua chave da Google AI Studio:
   ```env
   API_KEY=sua_chave_gemini_aqui
   ```

4. Inicie o servidor local:
   ```bash
   npm start
   ```

## ☁️ Deploy (Firebase)

O projeto está configurado para deploy fácil no Firebase Hosting:

```bash
npm run build
firebase deploy
```

## 📝 Licença

Este projeto é de código aberto sob a licença MIT.
