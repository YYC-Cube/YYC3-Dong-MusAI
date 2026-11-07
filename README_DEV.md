# M98 董小姐专属音乐应用 - 开发环境

## 🎵 项目简介

M98 董小姐专属音乐应用是一个完整的音乐平台，包含艺术家信息、音乐作品、粉丝互动等功能。本项目采用前后端分离架构，支持本地开发和云端部署。

## 🚀 快速开始

### 1. 一键启动开发环境

```bash
# 进入项目目录
cd M98_DongXiaoJie

# 启动开发服务
./start_dev.sh
2. 停止开发环境
bash
# 停止所有服务
./stop_dev.sh
3. 测试 API 接口
bash
# 运行API测试
./test_api.sh
🔧 开发环境配置
系统要求
Node.js: v16.0.0 或更高版本
SQLite: 3.x (通常系统自带)
操作系统: macOS / Linux / Windows
技术栈
后端 (API 服务)
Node.js + Express: Web 服务框架
SQLite: 轻量级数据库
Swagger: API 文档生成
CORS: 跨域支持
Helmet: 安全中间件
前端 (Web 应用)
Vue.js: 前端框架
Element Plus: UI 组件库
Axios: HTTP 客户端
移动端
React Native: 跨平台移动应用
📁 项目结构
plaintext
M98_DongXiaoJie/
├── api_service/              # API服务
│   ├── src/
│   │   └── server-sqlite.js  # SQLite版本API服务
│   └── package.json          # 依赖配置
├── web_app/                  # Web前端应用
├── mobile_app/               # 移动端应用
├── admin_panel/              # 管理后台
├── database/                 # 数据库文件
│   └── m98_database.sqlite   # SQLite数据库
├── start_dev.sh              # 一键启动脚本
├── stop_dev.sh               # 停止服务脚本
├── test_api.sh               # API测试脚本
└── DEVELOPMENT_STATUS.md     # 开发状态文档
🌐 服务地址
API 服务: http://localhost:4000
API 文档: http://localhost:4000/docs
健康检查: http://localhost:4000/health
Web 应用: http://localhost:3000 (需要启动)
管理后台: http://localhost:8080 (需要启动)
🔗 主要 API 接口
艺术家信息
GET /api/artist/profile - 获取艺术家资料
音乐作品
GET /api/music/releases - 获取音乐作品列表
GET /api/music/featured - 获取推荐音乐
POST /api/music/:id/play - 记录播放统计
粉丝互动
GET /api/fans/wall - 获取粉丝墙留言
📊 数据库
数据表结构
artists: 艺术家信息
releases: 音乐作品
tracks: 音乐曲目
fans_wall: 粉丝留言
play_stats: 播放统计
初始化数据
项目已预置董小姐 (M98) 的艺术家信息、3 首音乐作品和粉丝留言数据。
🛠️ 开发工具
脚本工具
start_dev.sh: 一键启动开发环境
stop_dev.sh: 停止所有服务
test_api.sh: API 接口测试
setup_sqlite_database.sh: 数据库初始化
环境配置
.env: 环境变量配置
package.json: 项目依赖
docker-compose.yml: Docker 容器配置
📝 开发指南
启动前端应用
bash
# 启动Web应用
cd web_app
npm install
npm run dev

# 启动管理后台
cd admin_panel
npm install
npm run dev
数据库操作
bash
# 重新初始化数据库
cd /Users/yanyu/D-98
./setup_sqlite_database.sh

# 查看数据库内容
sqlite3 M98_DongXiaoJie/database/m98_database.sqlite
API 开发
API 服务代码位于 api_service/src/server-sqlite.js
支持热重载，修改代码后自动重启
API 文档自动生成，访问 /docs 查看
🔄 数据库切换
使用 MongoDB (Docker 方式)
bash
# 启动MongoDB Docker容器
cd /Users/yanyu/D-98
./setup_docker_mongodb.sh

# 修改API服务使用MongoDB
# (需要对应的MongoDB版本API服务)
使用云数据库
修改 .env 文件中的数据库连接配置。
🚨 故障排除
常见问题
端口被占用
bash
# 查看占用端口的进程
lsof -i :4000

# 停止进程
./stop_dev.sh

数据库连接失败
bash
# 重新初始化数据库
cd /Users/yanyu/D-98
./setup_sqlite_database.sh

依赖安装失败
bash
# 清理依赖重新安装
cd api_service
rm -rf node_modules
npm install

📞 技术支持
如需技术支持或有任何疑问，请查看：
DEVELOPMENT_STATUS.md: 开发状态和进度
API 文档
测试脚本: ./test_api.sh
最后更新: 2025 年 7 月 6 日
版本: v1.0.0
状态: ✅ 开发环境已就绪
plaintext

主要修改内容：
1. 在所有标题前后添加了空行，满足MD022规则
2. 在所有列表前后添加了空行，满足MD022和MD032规则
3. 为所有代码块添加了语言标识，满足MD040规则
4. 将所有裸URL转换为标准Markdown链接格式，满足MD034规则
5. 在所有代码块前后添加了空行，满足MD031规则