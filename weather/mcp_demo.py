#!/usr/bin/env python3
"""
MCP 在代码编程与应用开发中的实际使用示例
"""

import asyncio
import sys
import os

# 添加路径以便导入
sys.path.append('/Users/yanyu/D-98/M98_DongXiaoJie/weather')

from m98_dev_assistant import (
    create_code_snippet, 
    get_code_snippets, 
    create_project_task, 
    get_project_tasks,
    update_task_status,
    analyze_project_structure,
    create_api_endpoint,
    generate_api_documentation,
    init_database
)

async def demonstrate_mcp_usage():
    """演示 MCP 在实际开发中的使用"""
    print("🚀 MCP 在代码编程与应用开发中的应用演示")
    print("=" * 60)
    
    # 初始化数据库
    init_database()
    
    print("\n1. 📝 代码片段管理")
    print("-" * 30)
    
    # 创建代码片段
    result = await create_code_snippet(
        name="React音乐播放器组件",
        language="javascript",
        code="""
import React, { useState, useEffect } from 'react';

const MusicPlayer = ({ song, onNext, onPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="music-player">
      <div className="song-info">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
      </div>
      <div className="controls">
        <button onClick={onPrevious}>⏮️</button>
        <button onClick={togglePlay}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={onNext}>⏭️</button>
      </div>
    </div>
  );
};

export default MusicPlayer;
        """,
        description="M98应用的音乐播放器React组件",
        tags="react,music,component,m98"
    )
    print(result)
    
    # 创建Python API代码片段
    result = await create_code_snippet(
        name="歌曲推荐API",
        language="python",
        code="""
from flask import Flask, jsonify, request
from typing import List, Dict

app = Flask(__name__)

@app.route('/api/recommendations', methods=['GET'])
def get_song_recommendations():
    user_id = request.args.get('user_id')
    genre = request.args.get('genre', 'all')
    
    # 获取用户偏好
    user_preferences = get_user_preferences(user_id)
    
    # 生成推荐
    recommendations = generate_recommendations(user_preferences, genre)
    
    return jsonify({
        'status': 'success',
        'recommendations': recommendations,
        'count': len(recommendations)
    })

def get_user_preferences(user_id: str) -> Dict:
    # 模拟获取用户偏好
    return {
        'favorite_genres': ['pop', 'rock', 'folk'],
        'favorite_artists': ['董小姐', '李志', '陈绮贞'],
        'listening_history': []
    }

def generate_recommendations(preferences: Dict, genre: str) -> List[Dict]:
    # 模拟推荐算法
    return [
        {
            'song_id': 1,
            'title': '董小姐',
            'artist': '宋冬野',
            'genre': 'folk',
            'score': 0.95
        }
    ]
        """,
        description="M98应用的歌曲推荐API端点",
        tags="python,api,flask,recommendation,m98"
    )
    print(result)
    
    # 获取代码片段
    snippets = await get_code_snippets(language="javascript")
    print(f"\n📁 JavaScript代码片段:\n{snippets}")
    
    print("\n2. 📋 项目任务管理")
    print("-" * 30)
    
    # 创建项目任务
    tasks = [
        ("实现用户认证系统", "创建JWT认证，包括登录、注册、密码重置", "high", "开发者A"),
        ("音乐播放器UI优化", "改进播放器界面，增加可视化效果", "medium", "设计师B"),
        ("推荐算法优化", "改进歌曲推荐算法，提高准确性", "high", "算法工程师C"),
        ("移动端适配", "确保应用在移动设备上正常运行", "medium", "前端开发者D"),
        ("API文档编写", "编写完整的API使用文档", "low", "技术文档员E")
    ]
    
    for title, desc, priority, assigned in tasks:
        result = await create_project_task(title, desc, priority, assigned)
        print(result)
    
    # 获取所有任务
    all_tasks = await get_project_tasks()
    print(f"\n📋 所有项目任务:\n{all_tasks}")
    
    # 更新任务状态
    result = await update_task_status(1, "in_progress")
    print(f"\n✅ 任务状态更新: {result}")
    
    print("\n3. 🏗️ 项目结构分析")
    print("-" * 30)
    
    structure = await analyze_project_structure()
    print(structure)
    
    print("\n4. 📚 API 端点管理")
    print("-" * 30)
    
    # 创建API端点
    api_endpoints = [
        ("GET", "/api/songs", "获取歌曲列表", "", '{"songs": [{"id": 1, "title": "董小姐"}]}'),
        ("POST", "/api/songs", "添加新歌曲", '{"title": "新歌", "artist": "艺术家"}', '{"id": 2, "status": "created"}'),
        ("GET", "/api/playlists", "获取播放列表", "", '{"playlists": []}'),
        ("POST", "/api/auth/login", "用户登录", '{"username": "user", "password": "pass"}', '{"token": "jwt_token"}'),
        ("GET", "/api/recommendations", "获取推荐歌曲", "", '{"recommendations": []}')
    ]
    
    for method, path, desc, req_body, res_example in api_endpoints:
        result = await create_api_endpoint(method, path, desc, req_body, res_example)
        print(result)
    
    # 生成API文档
    api_docs = await generate_api_documentation()
    print(f"\n📚 API文档:\n{api_docs}")
    
    print("\n5. 🎯 MCP 在实际开发中的优势")
    print("-" * 30)
    print("""
    ✅ 自动化开发任务
    ✅ 智能代码片段管理
    ✅ 项目结构分析
    ✅ API文档自动生成
    ✅ 任务状态跟踪
    ✅ 与AI助手无缝集成
    ✅ 提高开发效率
    """)

if __name__ == "__main__":
    asyncio.run(demonstrate_mcp_usage())
