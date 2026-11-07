#!/bin/bash

# M98项目数据库配置选择器

echo "🎵 M98董小姐应用 - 数据库配置选择"
echo "================================"
echo ""
echo "请选择您要配置的数据库类型："
echo ""
echo "1) MongoDB (推荐) - 文档型数据库，适合音乐应用"
echo "2) PostgreSQL - 关系型数据库，数据一致性强"  
echo "3) SQLite - 轻量级，零配置"
echo "4) 保持Mock模式 - 无需真实数据库"
echo ""
read -p "请输入选择 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🎯 您选择了: MongoDB"
        echo "正在安装和配置MongoDB..."
        ./install_mongodb.sh
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "📝 正在更新API配置..."
            
            # 更新.env文件
            cd /Users/yanyu/D-98/M98_DongXiaoJie/api_service
            sed -i '' 's|MONGODB_URI=mongodb://db:27017/m98_database|MONGODB_URI=mongodb://localhost:27017/m98_database|' .env
            
            echo "✅ MongoDB配置完成！"
            echo ""
            echo "📋 下一步操作："
            echo "1. 重启API服务: cd api_service && npm start"
            echo "2. 访问 http://localhost:4000/api/artist/profile"
            echo "3. 数据将自动创建在MongoDB中"
        fi
        ;;
    2)
        echo ""
        echo "🎯 您选择了: PostgreSQL"
        ./install_postgresql.sh
        
        if [ $? -eq 0 ]; then
            echo "📝 需要安装PostgreSQL适配器..."
            cd /Users/yanyu/D-98/M98_DongXiaoJie/api_service
            npm install pg sequelize
            echo "⚠️  需要手动修改API代码以支持PostgreSQL"
        fi
        ;;
    3)
        echo ""
        echo "🎯 您选择了: SQLite"
        ./setup_sqlite.sh
        
        if [ $? -eq 0 ]; then
            echo "📝 需要安装SQLite适配器..."
            cd /Users/yanyu/D-98/M98_DongXiaoJie/api_service
            npm install sqlite3 sequelize
            echo "⚠️  需要手动修改API代码以支持SQLite"
        fi
        ;;
    4)
        echo ""
        echo "🎯 您选择了: 保持Mock模式"
        echo "✅ 当前配置无需修改，继续使用模拟数据"
        echo ""
        echo "Mock模式特点:"
        echo "- 无需安装数据库"
        echo "- 数据重启后重置"
        echo "- 适合开发和演示"
        ;;
    *)
        echo ""
        echo "❌ 无效选择，请重新运行脚本"
        exit 1
        ;;
esac

echo ""
echo "🎉 数据库配置完成！"
echo ""
echo "💡 提示："
echo "- MongoDB: 最适合M98项目，推荐生产使用"
echo "- PostgreSQL: 企业级应用，复杂查询优秀"
echo "- SQLite: 简单轻量，适合原型开发"
echo "- Mock模式: 快速开发，无需配置"
