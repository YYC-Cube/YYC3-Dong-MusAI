# 🚀 MCP 在代码编程与应用开发中的完整使用指南

## 📋 目录

1. [MCP 基础概念](#mcp-基础概念)
2. [在 VS Code 中使用 MCP](#在-vs-code-中使用-mcp)
3. [实际开发场景](#实际开发场景)
4. [高级功能](#高级功能)
5. [最佳实践](#最佳实践)

---

## 🎯 MCP 基础概念

### 什么是 MCP？

Model Context Protocol (MCP) 是一个标准化协议，允许 AI 模型与外部工具、数据源和服务进行交互。

### 核心优势

- 🔧 **工具集成**: 与数据库、API、文件系统等外部系统交互
- 🧠 **智能助手**: 为 AI 提供实时数据和功能
- 🔄 **自动化**: 自动化重复性开发任务
- 📊 **数据分析**: 实时分析项目状态和代码质量

---

## 💻 在 VS Code 中使用 MCP

### 1. 配置 MCP 服务器

当前配置 (`.vscode/mcp.json`):

```json
{
    "servers": {
        "weather": {
            "command": "python",
            "args": ["/Users/yanyu/D-98/M98_DongXiaoJie/weather/weather.py"]
        },
        "dev_assistant": {
            "command": "python",
            "args": ["/Users/yanyu/D-98/M98_DongXiaoJie/weather/m98_dev_assistant.py"]
        }
    }
}
```

### 2. 在 Copilot Chat 中使用

#### 🌤️ 天气服务

```bash
@workspace 北京的天气怎么样？
@workspace 根据天气推荐音乐风格
@workspace 获取所有城市天气概览
```

#### 🛠️ 开发助手

```bash
@workspace 分析项目结构
@workspace 创建一个React组件的代码片段
@workspace 添加一个新的API端点
@workspace 查看当前项目任务
@workspace 生成API文档
```

---

## 🏗️ 实际开发场景

### 场景1: 代码片段管理
```python
# 保存常用代码片段
await create_code_snippet(
    name="用户认证中间件",
    language="javascript",
    code="...",
    description="Express.js用户认证中间件",
    tags="express,auth,middleware"
)

# 检索代码片段
snippets = await get_code_snippets(language="javascript", tag="auth")
```

### 场景2: 项目任务管理
```python
# 创建开发任务
await create_project_task(
    title="实现音乐播放器",
    description="创建支持多格式的音乐播放器组件",
    priority="high",
    assigned_to="前端开发者"
)

# 跟踪任务状态
await update_task_status(task_id=1, status="in_progress")
```

### 场景3: API 开发
```python
# 定义API端点
await create_api_endpoint(
    method="GET",
    path="/api/songs/{id}",
    description="获取特定歌曲信息",
    response_example='{"id": 1, "title": "董小姐", "artist": "宋冬野"}'
)

# 生成API文档
docs = await generate_api_documentation()
```

---

## 🔧 高级功能

### 1. 自定义 MCP 工具

```python
from mcp.server.fastmcp import FastMCP

app = FastMCP("My Development Assistant")

@app.tool()
async def analyze_code_quality(file_path: str) -> str:
    """分析代码质量"""
    # 实现代码质量分析逻辑
    return "代码质量分析结果"

@app.tool()
async def run_tests(test_suite: str) -> str:
    """运行测试套件"""
    # 实现测试运行逻辑
    return "测试运行结果"

@app.resource("project://metrics")
async def get_project_metrics() -> str:
    """获取项目指标"""
    # 返回项目统计信息
    return json.dumps({"lines_of_code": 1000, "test_coverage": 85})
```

### 2. 数据库集成

```python
import sqlite3

def init_development_database():
    """初始化开发数据库"""
    conn = sqlite3.connect("development.db")
    cursor = conn.cursor()
    
    # 创建表结构
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS code_reviews (
            id INTEGER PRIMARY KEY,
            file_path TEXT,
            reviewer TEXT,
            status TEXT,
            comments TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
```

### 3. 外部 API 集成

```python
import httpx

@app.tool()
async def check_github_issues(repo: str) -> str:
    """检查GitHub仓库的问题"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.github.com/repos/{repo}/issues")
        issues = response.json()
        return f"仓库 {repo} 有 {len(issues)} 个开放问题"
```

---

## 📝 最佳实践

### 1. 组织 MCP 服务器

```
mcp_servers/
├── core/
│   ├── database.py      # 数据库工具
│   ├── file_system.py   # 文件系统工具
│   └── git_tools.py     # Git操作工具
├── development/
│   ├── code_analysis.py # 代码分析
│   ├── testing.py       # 测试工具
│   └── deployment.py    # 部署工具
└── project_specific/
    ├── m98_tools.py     # M98特定工具
    └── music_api.py     # 音乐API工具
```

### 2. 错误处理

```python
@app.tool()
async def safe_operation(param: str) -> str:
    """安全执行操作"""
    try:
        # 执行操作
        result = await perform_operation(param)
        return f"✅ 操作成功: {result}"
    except Exception as e:
        return f"❌ 操作失败: {str(e)}"
```

### 3. 参数验证

```python
@app.tool()
async def validate_and_process(data: str) -> str:
    """验证并处理数据"""
    if not data or len(data.strip()) == 0:
        return "❌ 输入数据不能为空"
    
    if len(data) > 1000:
        return "❌ 输入数据过长"
    
    # 处理数据
    return f"✅ 数据处理完成: {data}"
```

---

## 🎨 在 M98 项目中的应用

### 1. 音乐推荐系统
```python
@app.tool()
async def generate_music_recommendations(user_id: str, mood: str) -> str:
    """根据用户和心情生成音乐推荐"""
    # 获取用户偏好
    user_prefs = get_user_preferences(user_id)
    
    # 根据心情调整推荐
    recommendations = adjust_by_mood(user_prefs, mood)
    
    return format_recommendations(recommendations)
```

### 2. 用户行为分析
```python
@app.tool()
async def analyze_user_behavior(user_id: str) -> str:
    """分析用户行为模式"""
    # 获取用户行为数据
    behavior_data = get_user_behavior(user_id)
    
    # 分析模式
    patterns = analyze_patterns(behavior_data)
    
    return generate_insights(patterns)
```

### 3. 内容管理
```python
@app.tool()
async def manage_music_content(action: str, content_id: str) -> str:
    """管理音乐内容"""
    if action == "upload":
        return upload_music_content(content_id)
    elif action == "delete":
        return delete_music_content(content_id)
    elif action == "update":
        return update_music_content(content_id)
```

---

## 🚀 开始使用

### 1. 重启 VS Code
更新配置后，重启 VS Code 以加载 MCP 服务器。

### 2. 验证连接
在 Copilot Chat 中输入：
```
@workspace 显示项目结构
@workspace 创建一个测试任务
@workspace 查看天气信息
```

### 3. 探索功能
尝试不同的命令和工具，了解 MCP 的强大功能。

---

## 📚 扩展资源

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [FastMCP 框架](https://github.com/modelcontextprotocol/python-sdk)
- [VS Code MCP 扩展](https://marketplace.visualstudio.com/items?itemName=automatalabs.copilot-mcp)

---

**🎵 现在您的 M98 项目已经具备了完整的 MCP 功能！通过这些工具，您可以：**
- 🔧 自动化开发任务
- 📊 实时分析项目状态
- 🎯 提高开发效率
- 🤖 与 AI 助手无缝协作

重启 VS Code 后，在 Copilot Chat 中尝试这些功能吧！
