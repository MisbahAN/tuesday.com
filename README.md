<div align="center">

# 🗓️ Tuesday.com

*An innovative project management platform built during HackED 2025*

[![HackED 2025](https://img.shields.io/badge/HackED-2025-orange.svg)](https://github.com/MisbahAN/tuesday.com)
[![Visit our Devpost]](https://devpost.com/software/tuesday-com)
[![Powered by OpenAI](https://img.shields.io/badge/Powered%20by-OpenAI-412991.svg)](https://openai.com)
</div>

## Table of Contents
1. [Overview](#overview)
2. [Core Features](#-Core-Features)
3. [Repository Structure](#-Repository-Structure)
   - [Frontend Structure](#frontend-structure)
   - [Backend Structure](#backend-structure)
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
backend/
├── views/
    ├── register.ejs     # sign up page
    ├── login.ejs        # Login page
    ├── main.ejs         # List selection
    └── tasks.ejs        # Task list
```

### Backend Structure
```
backend/
├── models/
│   ├── Users.js            # User data schema
│   ├── Tasks.js            # Task data schema
|   ├── ListAssignments.js  # List assignments schema
|   ├── Lists.js            # List schema
|   ├── Recommendations.js  # not implemented yet
|   └── Assignments.js      # Task data schema
└── app.js            # app configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- dotenv
- axios

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/MisbahAN/tuesday.com.git
   cd tuesday.exe
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install dotenv
   ```

3. **Start development server**
   ```bash
   node app.js
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


### Built with ❤️ during HackED 2025

[Report Bug](https://github.com/MisbahAN/tuesday.com/issues) · [Request Feature](https://github.com/MisbahAN/tuesday.com/issues)

</div>
