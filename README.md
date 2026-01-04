# HR Assistant - React Frontend

A modern, premium React application for the HR Chatbot system. This application provides an intuitive interface for employee search and HR policy inquiries.

![HR Assistant](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.3-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🔍 **Employee Search**: Find employees based on skills and years of experience
- 📚 **HR Policy Q&A**: Get answers to HR policy questions using RAG (Retrieval-Augmented Generation)
- 🎨 **Premium UI/UX**: Dark mode with vibrant gradients and glassmorphism effects
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Real-time Chat**: Instant responses with typing indicators
- 🎯 **Smart Responses**: Displays employee cards or policy citations based on query type

## Tech Stack

- **React 18.3** - UI library
- **Vite 7.3** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **Vanilla CSS** - Custom styling with modern design patterns

## Prerequisites

- Node.js 20.19+ or 22.12+ (recommended)
- npm 10+
- FastAPI backend running (see [hr-chatbot](https://github.com/Saurabh07703/hr-chatbot))

## Installation

The project consists of two parts: the React frontend and the FastAPI backend.

### 1. Backend Setup

1.  **Navigate to the backend directory**
    ```bash
    cd backend
    ```

2.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure Environment**
    Create a `.env` file in the `backend` directory and add your Groq API key:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Run the Backend Server**
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    The backend will start at `http://localhost:8000`.

### 2. Frontend Setup

1.  **Navigate to the root directory**
    ```bash
    cd ..
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Deployment

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variable in Vercel dashboard:
   - `VITE_API_URL`: Your production backend URL

### Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Set environment variable in Netlify dashboard:
   - `VITE_API_URL`: Your production backend URL

### Docker

1. **Build the Docker image**:
   ```bash
   docker build -t hr-chatbot-frontend .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:80 -e VITE_API_URL=http://your-backend-url hr-chatbot-frontend
   ```

3. **Or use Docker Compose**:
   ```bash
   docker-compose up -d
   ```

## Project Structure

```
HR_Chatbot_Interface/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ChatInterface.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── InputArea.jsx
│   │   ├── EmployeeCard.jsx
│   │   ├── PolicyCard.jsx
│   │   └── LoadingIndicator.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── utils/           # Utility functions
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles and design system
│   └── main.jsx         # Entry point
├── .env                 # Environment variables (local)
├── .env.production      # Production environment variables
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── netlify.toml         # Netlify configuration
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## API Integration

The application connects to a FastAPI backend with the following endpoints:

- `GET /health` - Health check
- `POST /chat` - Send chat messages
  - Request: `{ "query": "string" }`
  - Response: `{ "answer": "string", "sources": ["string"] }`

## Design System

The application uses a comprehensive design system with:

- **Color Palette**: Dark mode with vibrant purple, pink, and cyan accents
- **Typography**: Inter for UI, JetBrains Mono for code
- **Effects**: Glassmorphism, gradients, smooth animations
- **Responsive**: Mobile-first approach with breakpoints at 768px and 480px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Backend: [hr-chatbot](https://github.com/Saurabh07703/hr-chatbot)
- Icons: [React Icons](https://react-icons.github.io/react-icons/)
- Fonts: [Google Fonts](https://fonts.google.com/)

## Support

For issues and questions, please open an issue on GitHub.
