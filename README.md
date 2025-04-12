# 📰 News Aggregator App
A modern news aggregation platform built with cutting-edge technologies to deliver a seamless reading experience.
in collaboration with [news API](https://newsapi.org/)
## 🚀 Features
### 🔐 Authentication
* JWT-based secure login/register system
* Password hashing with bcrypt
* Session management
### 📰 News Feed
* Multi-source news aggregation
* Personalized feed based on subscriptions
* Paginated results for smooth browsing
* Redis-cached responses for lightning-fast performance
### 🔔 Subscription Management
* Subscribe/unsubscribe to news sources
* Top sources dashboard
### 📊 Activity Tracking
* Login success/failure logging with timestamps
* User activity monitoring
## 🛠 Tech Stack
### Frontend
* **React** (Vite) - Modern UI framework
* **Context API** - State management
* **Bootstrap** - Utility-first styling
* **Axios** - HTTP client
### Backend
* **Node.js** with **Express** - API server
* **MongoDB** - Primary database
* **Redis** - Caching layer
* **JWT** - Authentication tokens
* **Nginx** - Reverse proxy & load balancing
### Infrastructure
* **Docker** - Containerization
* **Docker Compose** - Orchestration

## ✨ In Action

| Feature          | Screenshot                      |
|------------------|---------------------------------|
| HomePage         | [![Screenshot-from-2025-04-03-00-19-16.png](https://i.postimg.cc/h4LnggQy/Screenshot-from-2025-04-03-00-19-16.png)](https://postimg.cc/pyL4YwZz)   |
| Sources subscription        | [![Screenshot-from-2025-04-03-00-19-41.png](https://i.postimg.cc/Twxkc821/Screenshot-from-2025-04-03-00-19-41.png)](https://postimg.cc/hJCbS5dR)      |
| Top sources page | [![Screenshot-from-2025-04-03-00-20-01.png](https://i.postimg.cc/zvt05VCH/Screenshot-from-2025-04-03-00-20-01.png)](https://postimg.cc/tn6hNRm9)     |
| User Logs page  | [![Screenshot-from-2025-04-03-00-24-06.png](https://i.postimg.cc/vZ63F8cD/Screenshot-from-2025-04-03-00-24-06.png)](https://postimg.cc/sMsp5rPR) |

## 🏗️ System Architecture
```mermaid
graph TD
    A[Client] --> B[Nginx]
    B --> C[React Frontend]
    B --> D[Node.js API]
    D --> E[MongoDB]
    D --> F[Redis Cache]
    D --> G[External News APIs]
```
## 🐳 Docker Setup
The entire application is containerized with Docker Compose:
```yaml
version: '3'

services: 

  back-end:
    build: 
      context: node
    container_name: back-end
    working_dir: /usr/src/app 
    volumes: 
      - ./node:/usr/src/app
      - /usr/src/app/node_modules
    tty: true
    ports: 
      - "3000:3000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - MONGO_URI=mongodb://root:root@mongo:27017
    command: node server.js
    depends_on:
      - redis
      - mongo
    networks:
      - node-network

  front-end:
    build: 
      context: react
    container_name: front-end
    working_dir: /usr/src/app
    networks: 
      - node-network
    volumes: 
      - ./react:/usr/src/app
      - /usr/src/app/node_modules
    tty: true
    ports: 
      - "5173:5173"
    environment: 
      - VITE_BASE_URL=http://localhost:8000/api/v1
    command: npm run dev

  mongo:
    image: mongo:latest
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - node-network

  redis:
    image: redis:latest
    networks: 
      - node-network
    ports:
      - "6379:6379"

  nginx-server:
    build: 
      context: nginx
    container_name: nginx
    restart: always
    tty: true
    ports: 
      - "8000:80"
    networks: 
      - node-network
    depends_on:
       - back-end
       - front-end
  
networks: 
  node-network:
    driver: bridge

volumes:
  mongo-data:
```
## 🛠 Installation
1. **Clone the repository  **`git clone https://github.com/omarkhalil117/news-app.git
`
1. **Set up environment variables**
	* Create `.env` files in both `frontend` and `backend` directories
	* Example backend `.env`:
	* `NEWS_API_KEY=your_news_api_key
	SECRET_KEY=your_jwt_secret_here`

Note : to get your news api key from this [link](https://newsapi.org/register)

1. **Build and run with Docker** `docker-compose up --build
`
1. **Access the application** `http://localhost:8000`
## 🌟 Highlights
* **Optimized Performance**: Redis caching reduces API response times by up to 80%
* **Scalable Architecture**: Containerized setup allows easy horizontal scaling
* **Comprehensive Logging**: Track all user activities and system events using [pino](https://github.com/pinojs/pino)
* **Modern UI**: Simple design
## 📊 API Endpoints
|Endpoint|Method|Description|
|---|---|---|
|`/api/v1/register`|POST|User registration|
|`/api/v1/login`|POST|User login|
|`/api/v1/news`|GET|Paginated news feed|
|`/api/v1/sources`|GET|Available news sources|
|`/api/v1/sources/top-sources`|GET|Top sources|
|`/api/v1/users/subscribe`|POST|Subscribe to source|
|`/api/v1/users/unsubscribe`|POST|Unsubscribe to source|
|`/api/v1/users/subscriptions`|GET|Get user subscriptions|
|`/api/v1/users/news/`|GET|Get user news base on subscriptions|
|`/api/v1/users/logs`|GET|User activity logs|
---

