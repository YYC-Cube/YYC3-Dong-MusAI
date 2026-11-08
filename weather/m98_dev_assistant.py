#!/usr/bin/env python3
"""
M98 完整 MCP 服务器示例
演示如何在应用开发中使用 MCP
"""

import asyncio
import json
import os
import sqlite3
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path

from mcp.server.mcpserver import MCPServer

# 创建 MCP 服务器实例
app = MCPServer("M98 Development Assistant")

# 数据库路径
DB_PATH = "/Users/yanyu/D-98/M98_DongXiaoJie/content_db/m98_dev.db"

def init_database():
    """初始化开发数据库"""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 创建代码片段表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS code_snippets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            language TEXT NOT NULL,
            code TEXT NOT NULL,
            description TEXT,
            tags TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 创建项目任务表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS project_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'medium',
            assigned_to TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 创建API端点表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS api_endpoints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            method TEXT NOT NULL,
            path TEXT NOT NULL,
            description TEXT,
            request_body TEXT,
            response_example TEXT,
            status TEXT DEFAULT 'planned'
        )
    ''')
    
    conn.commit()
    conn.close()

@app.tool()
async def create_code_snippet(name: str, language: str, code: str, description: str = "", tags: str = "") -> str:
    """创建和保存代码片段"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO code_snippets (name, language, code, description, tags)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, language, code, description, tags))
    
    conn.commit()
    snippet_id = cursor.lastrowid
    conn.close()
    
    return f"✅ 代码片段 '{name}' 已保存 (ID: {snippet_id})"

@app.tool()
async def get_code_snippets(language: str = "", tag: str = "") -> str:
    """获取代码片段列表"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    query = "SELECT id, name, language, description, tags FROM code_snippets WHERE 1=1"
    params = []
    
    if language:
        query += " AND language = ?"
        params.append(language)
    
    if tag:
        query += " AND tags LIKE ?"
        params.append(f"%{tag}%")
    
    cursor.execute(query, params)
    snippets = cursor.fetchall()
    conn.close()
    
    if not snippets:
        return "没有找到匹配的代码片段"
    
    result = "📁 代码片段列表:\n\n"
    for snippet in snippets:
        result += f"🔹 ID: {snippet[0]} | {snippet[1]} ({snippet[2]})\n"
        result += f"   描述: {snippet[3]}\n"
        result += f"   标签: {snippet[4]}\n\n"
    
    return result

@app.tool()
async def create_project_task(title: str, description: str = "", priority: str = "medium", assigned_to: str = "") -> str:
    """创建项目任务"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO project_tasks (title, description, priority, assigned_to)
        VALUES (?, ?, ?, ?)
    ''', (title, description, priority, assigned_to))
    
    conn.commit()
    task_id = cursor.lastrowid
    conn.close()
    
    return f"✅ 任务 '{title}' 已创建 (ID: {task_id})"

@app.tool()
async def get_project_tasks(status: str = "") -> str:
    """获取项目任务列表"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if status:
        cursor.execute("SELECT * FROM project_tasks WHERE status = ?", (status,))
    else:
        cursor.execute("SELECT * FROM project_tasks ORDER BY priority DESC, created_at DESC")
    
    tasks = cursor.fetchall()
    conn.close()
    
    if not tasks:
        return "没有找到任务"
    
    result = "📋 项目任务列表:\n\n"
    for task in tasks:
        status_emoji = {"pending": "⏳", "in_progress": "🔄", "completed": "✅", "blocked": "🚫"}.get(task[4], "❓")
        priority_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(task[5], "⚪")
        
        result += f"{status_emoji} {priority_emoji} [{task[0]}] {task[1]}\n"
        result += f"   描述: {task[2]}\n"
        result += f"   状态: {task[4]} | 优先级: {task[5]}\n"
        result += f"   分配给: {task[6] or '未分配'}\n\n"
    
    return result

@app.tool()
async def update_task_status(task_id: int, status: str) -> str:
    """更新任务状态"""
    valid_statuses = ["pending", "in_progress", "completed", "blocked"]
    if status not in valid_statuses:
        return f"❌ 无效状态。有效状态: {', '.join(valid_statuses)}"
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE project_tasks 
        SET status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    ''', (status, task_id))
    
    if cursor.rowcount == 0:
        conn.close()
        return f"❌ 未找到任务 ID: {task_id}"
    
    conn.commit()
    conn.close()
    
    return f"✅ 任务 {task_id} 状态已更新为: {status}"

@app.tool()
async def analyze_project_structure() -> str:
    """分析项目结构"""
    project_root = "/Users/yanyu/D-98/M98_DongXiaoJie"
    
    if not os.path.exists(project_root):
        return "❌ 项目目录不存在"
    
    structure = {}
    file_count = 0
    
    for root, dirs, files in os.walk(project_root):
        # 跳过隐藏目录和虚拟环境
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__']
        
        rel_path = os.path.relpath(root, project_root)
        if rel_path == '.':
            rel_path = 'root'
        
        structure[rel_path] = {
            'dirs': dirs,
            'files': [f for f in files if not f.startswith('.') and not f.endswith('.pyc')],
            'file_count': len([f for f in files if not f.startswith('.') and not f.endswith('.pyc')])
        }
        file_count += structure[rel_path]['file_count']
    
    result = f"📊 M98 项目结构分析:\n\n"
    result += f"📁 总文件数: {file_count}\n"
    result += f"📁 目录数: {len(structure)}\n\n"
    
    # 分析主要目录
    main_dirs = ['web_app', 'api_service', 'mobile_app', 'ai_services', 'admin_panel']
    for dir_name in main_dirs:
        if dir_name in structure:
            result += f"📂 {dir_name}/: {structure[dir_name]['file_count']} 个文件\n"
    
    return result

@app.tool()
async def generate_api_documentation() -> str:
    """生成API文档"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM api_endpoints ORDER BY method, path")
    endpoints = cursor.fetchall()
    conn.close()
    
    if not endpoints:
        return "📚 API 端点列表为空，请先添加一些端点"
    
    result = "📚 M98 API 文档\n"
    result += "=" * 50 + "\n\n"
    
    methods = {}
    for endpoint in endpoints:
        method = endpoint[1]
        if method not in methods:
            methods[method] = []
        methods[method].append(endpoint)
    
    for method, method_endpoints in methods.items():
        result += f"## {method} 请求\n\n"
        for endpoint in method_endpoints:
            result += f"### {endpoint[1]} {endpoint[2]}\n"
            result += f"**描述**: {endpoint[3] or '无描述'}\n"
            result += f"**状态**: {endpoint[6]}\n"
            if endpoint[4]:
                result += f"**请求体**: {endpoint[4]}\n"
            if endpoint[5]:
                result += f"**响应示例**: {endpoint[5]}\n"
            result += "\n"
    
    return result

@app.tool()
async def create_api_endpoint(method: str, path: str, description: str = "", request_body: str = "", response_example: str = "") -> str:
    """创建API端点"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO api_endpoints (method, path, description, request_body, response_example)
        VALUES (?, ?, ?, ?, ?)
    ''', (method.upper(), path, description, request_body, response_example))
    
    conn.commit()
    endpoint_id = cursor.lastrowid
    conn.close()
    
    return f"✅ API 端点 '{method.upper()} {path}' 已创建 (ID: {endpoint_id})"

@app.resource("project://structure")
async def get_project_structure() -> str:
    """获取项目结构资源"""
    return await analyze_project_structure()

@app.resource("project://tasks")
async def get_all_tasks() -> str:
    """获取所有任务资源"""
    return await get_project_tasks()

if __name__ == "__main__":
    # 初始化数据库
    init_database()
    
    # 运行 MCP 服务器
    print("🚀 启动 M98 开发助手 MCP 服务器...")
    app.run()
