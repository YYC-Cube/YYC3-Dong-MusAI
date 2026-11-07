#!/usr/bin/env python3
"""
M98 Weather MCP Server
为董小姐音乐应用提供天气信息服务
"""

import asyncio
import json
from datetime import datetime
from typing import Any, Dict, List, Optional

from mcp.server.fastmcp import FastMCP

# 创建 MCP 服务器实例
mcp = FastMCP("M98 Weather Service")

# 模拟天气数据（在实际应用中会连接真实的天气API）
WEATHER_DATA = {
    "北京": {
        "temperature": 22,
        "humidity": 65,
        "description": "多云",
        "wind_speed": 12,
        "feels_like": 25,
        "uv_index": 6
    },
    "上海": {
        "temperature": 26,
        "humidity": 78,
        "description": "小雨",
        "wind_speed": 8,
        "feels_like": 29,
        "uv_index": 3
    },
    "广州": {
        "temperature": 31,
        "humidity": 82,
        "description": "晴天",
        "wind_speed": 5,
        "feels_like": 36,
        "uv_index": 9
    },
    "深圳": {
        "temperature": 29,
        "humidity": 85,
        "description": "阴天",
        "wind_speed": 7,
        "feels_like": 33,
        "uv_index": 4
    }
}

@mcp.tool()
async def get_weather(city: str) -> str:
    """获取指定城市的天气信息"""
    if city in WEATHER_DATA:
        data = WEATHER_DATA[city]
        return f"""
🌡️ {city}天气信息:
温度: {data['temperature']}°C (体感温度: {data['feels_like']}°C)
天气: {data['description']}
湿度: {data['humidity']}%
风速: {data['wind_speed']} km/h
紫外线指数: {data['uv_index']}
更新时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """.strip()
    else:
        return f"抱歉，暂时无法获取 {city} 的天气信息。支持的城市：{', '.join(WEATHER_DATA.keys())}"

@mcp.tool()
async def get_weather_for_music(city: str) -> str:
    """根据天气推荐适合的音乐风格"""
    if city not in WEATHER_DATA:
        return f"无法获取 {city} 的天气信息"
    
    data = WEATHER_DATA[city]
    temp = data['temperature']
    description = data['description']
    
    # 根据天气推荐音乐风格
    if "晴" in description:
        mood = "明亮、活泼"
        style = "流行、摇滚"
    elif "雨" in description:
        mood = "安静、沉思"
        style = "爵士、民谣"
    elif "阴" in description or "多云" in description:
        mood = "舒缓、温柔"
        style = "轻音乐、古典"
    else:
        mood = "平静、自然"
        style = "新世纪、环境音乐"
    
    # 根据温度调整
    if temp > 30:
        energy = "高能量"
    elif temp < 10:
        energy = "温暖、慰藉"
    else:
        energy = "适中"
    
    return f"""
🎵 {city}天气音乐推荐:
当前天气: {description} ({temp}°C)
推荐心情: {mood}
推荐风格: {style}
能量级别: {energy}

适合董小姐风格的音乐创作方向:
- 温柔的民谣配合当前的{description}天气
- 融入{temp}°C的温度感受
- 创造{mood}的氛围
    """.strip()

@mcp.tool()
async def get_all_weather() -> str:
    """获取所有支持城市的天气概览"""
    result = "🌤️ 全国主要城市天气概览:\n\n"
    
    for city, data in WEATHER_DATA.items():
        result += f"📍 {city}: {data['temperature']}°C, {data['description']}\n"
    
    result += f"\n更新时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    return result

@mcp.resource("weather://cities")
async def list_cities() -> str:
    """列出所有支持的城市"""
    return json.dumps({
        "supported_cities": list(WEATHER_DATA.keys()),
        "total_count": len(WEATHER_DATA),
        "service": "M98 Weather Service"
    }, ensure_ascii=False, indent=2)

@mcp.resource("weather://current/{city}")
async def get_city_weather(city: str) -> str:
    """获取特定城市的详细天气数据"""
    if city in WEATHER_DATA:
        data = WEATHER_DATA[city]
        data["city"] = city
        data["timestamp"] = datetime.now().isoformat()
        return json.dumps(data, ensure_ascii=False, indent=2)
    else:
        return json.dumps({"error": f"City {city} not found"}, ensure_ascii=False)

if __name__ == "__main__":
    # 运行 MCP 服务器
    mcp.run()