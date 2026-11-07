#!/usr/bin/env python3
"""
测试天气 MCP 服务的功能
"""

import asyncio
from weather import get_weather, get_weather_for_music, get_all_weather

async def test_weather_functions():
    """测试所有天气功能"""
    print("🌤️ 测试 M98 天气服务功能")
    print("=" * 50)
    
    # 测试获取北京天气
    print("\n1. 获取北京天气：")
    beijing_weather = await get_weather("北京")
    print(beijing_weather)
    
    # 测试根据天气推荐音乐
    print("\n2. 根据上海天气推荐音乐：")
    music_recommendation = await get_weather_for_music("上海")
    print(music_recommendation)
    
    # 测试获取所有城市天气
    print("\n3. 获取所有城市天气概览：")
    all_weather = await get_all_weather()
    print(all_weather)
    
    # 测试不存在的城市
    print("\n4. 测试不存在的城市（成都）：")
    chengdu_weather = await get_weather("成都")
    print(chengdu_weather)

if __name__ == "__main__":
    asyncio.run(test_weather_functions())
