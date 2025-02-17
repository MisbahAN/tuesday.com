<div align="center">

# 🗓️ Tuesday.com

*An innovative project management platform built during HackED 2025*

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HackED 2025](https://img.shields.io/badge/HackED-2025-orange.svg)](https://github.com/MisbahAN/tuesday.com)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg)](https://reactjs.org)
[![Powered by OpenAI](https://img.shields.io/badge/Powered%20by-OpenAI-412991.svg)](https://openai.com)
</div>

![Tuesday.com Dashboard](AI-Integration/tuesday-loginpage.png)

## Table of Contents
1. [Overview](#overview)
2. [Core Features](#-Core-Features)
3. [Repository Structure](#-Repository-Structure)
   - [Frontend Structure](#frontend-structure)
   - [Backend Structure](#backend-structure)
   - [AI Integration](#ai-integration)
4. [Installation & Setup](#Installation-&-Setup)
   - [Prerequisites](#prerequisites)
   - [Getting Started](#getting-started)
5. [Future Enhancements](#-Future-Enhancements)
6. [Contributing](#-Contributing)

---
## Overview

**Tuesday.com** is a comprehensive project management platform that combines advanced task management capabilities with AI-driven automation. Built during **HackED 2025**, it offers a modern approach to team collaboration and project organization.


## 🚀 Core Features

### 🤖 AI-Driven Task Automation
- Intelligent task generation and management
- Smart task prioritization
- Predictive task scheduling

### 📊 Task Management System
- Intuitive Kanban board interface
- Customizable task workflows
- Real-time collaboration tools

### 📱 User Experience
- Interactive dashboard
- Real-time updates
- Responsive design

## 📁 Repository Structure

### Frontend Structure
```
src/
├── components/
│   ├── Login.js         # Authentication components
│   ├── Dashboard.js     # Main workspace
│   ├── Task.js          # Task management
│   └── AIRecommendations.js
├── context/
│   └── AuthContext.js   # Global state management
└── hooks/
    └── useTasks.js      # Custom task hooks
```

### Backend Structure
```
backend/
├── models/
│   ├── User.js          # User data schema
│   └── Task.js          # Task data schema
├── routes/
│   ├── auth.js          # Authentication routes
│   └── tasks.js         # Task management routes
└── server.js            # Server configuration
```

### AI Integration
```
AI-Integration/
└── openai.js            # OpenAI API integration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Python 3.8+ (for AI features)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/MisbahAN/tuesday.com.git
   cd tuesday.exe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Create production build**
   ```bash
   npm run build
   ```

## 🔮 Future Enhancements

### Near-term Goals
- [ ] AI-Powered Insights
- [ ] Real-Time Collaboration
- [ ] Gamification Features

### Long-term Vision
- [ ] Third-Party Integrations
- [ ] Mobile Apps
- [ ] Voice Commands
- [ ] Advanced Analytics

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Built with ❤️ during HackED 2025

[Report Bug](https://github.com/MisbahAN/tuesday.com/issues) · [Request Feature](https://github.com/MisbahAN/tuesday.com/issues)

</div>
