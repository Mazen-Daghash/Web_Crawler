# 🕷️ Web Crawler

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-17+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A high-performance, full-stack web crawler with a modern React frontend and Flask backend, designed for efficient and ethical web scraping.

![Web Crawler Demo](web%20crawler.png)

## ✨ Features

- **Intelligent Crawling**
  - Configurable depth control (up to 6 levels)
  - Maximum page limit (100 pages per session)
  - Respects `robots.txt` rules
  - Asynchronous request processing

- **Powerful Backend**
  - Built with Flask for high performance
  - BeautifulSoup for efficient HTML parsing
  - Robust error handling and retry mechanisms
  - Queue-based URL management

- **Modern Frontend**
  - Real-time crawl monitoring
  - Interactive dashboard
  - Responsive design
  - No build step required (CDN-based React)

- **Performance Optimized**
  - Parallel request processing
  - Domain-aware rate limiting
  - In-memory URL deduplication
  - Efficient resource utilization

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+ (for frontend development)
- pip (Python package manager)
- npm or yarn (Node package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mazen-Daghash/webcrawler.git
   cd webcrawler
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

## 🛠️ Usage

1. **Start the backend server**
   ```bash
   cd backend
   python server.py
   ```

2. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm start
   ```

3. Open your browser to `http://localhost:3000`

## 📚 API Documentation

### Start a new crawl
```http
POST /api/crawl/start
Content-Type: application/json

{
  "url": "https://example.com",
  "max_depth": 3,
  "max_pages": 50
}
```

### Get crawl status
```http
GET /api/crawl/status
```

### Stop crawling
```http
POST /api/crawl/stop
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- BeautifulSoup for HTML parsing
- React for the frontend
- Flask for the backend API
- All contributors who have helped improve this project
