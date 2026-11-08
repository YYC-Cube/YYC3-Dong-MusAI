#!/usr/bin/env python3
"""
MCP 在不同开发领域的应用示例
"""

import asyncio
from mcp.server.mcpserver import MCPServer

# 创建通用开发 MCP 服务器
universal_mcp = MCPServer("Universal Development Assistant")

# ===== WEB 开发 =====
@universal_mcp.tool()
async def create_web_component(framework: str, component_name: str, props: str = "") -> str:
    """为不同框架创建Web组件"""
    
    if framework.lower() == "react":
        return f"""
// React 组件: {component_name}
import React from 'react';

interface {component_name}Props {{
    {props}
}}

const {component_name}: React.FC<{component_name}Props> = (props) => {{
    return (
        <div className="{component_name.lower()}">
            <h1>Hello from {component_name}!</h1>
        </div>
    );
}};

export default {component_name};
        """
    
    elif framework.lower() == "vue":
        return f"""
<!-- Vue 组件: {component_name} -->
<template>
    <div class="{component_name.lower()}">
        <h1>Hello from {component_name}!</h1>
    </div>
</template>

<script>
export default {{
    name: '{component_name}',
    props: {{
        {props}
    }}
}}
</script>
        """
    
    elif framework.lower() == "angular":
        return f"""
// Angular 组件: {component_name}
import {{ Component }} from '@angular/core';

@Component({{
    selector: 'app-{component_name.lower()}',
    template: `
        <div class="{component_name.lower()}">
            <h1>Hello from {component_name}!</h1>
        </div>
    `
}})
export class {component_name}Component {{
    // 组件逻辑
}}
        """
    
    else:
        return f"不支持的框架: {framework}。支持的框架: React, Vue, Angular"

# ===== 移动开发 =====
@universal_mcp.tool()
async def create_mobile_screen(platform: str, screen_name: str) -> str:
    """为不同平台创建移动应用屏幕"""
    
    if platform.lower() == "react-native":
        return f"""
// React Native 屏幕: {screen_name}
import React from 'react';
import {{ View, Text, StyleSheet }} from 'react-native';

const {screen_name}Screen = () => {{
    return (
        <View style={{styles.container}}>
            <Text style={{styles.title}}>{screen_name}</Text>
        </View>
    );
}};

const styles = StyleSheet.create({{
    container: {{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    }},
    title: {{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    }},
}});

export default {screen_name}Screen;
        """
    
    elif platform.lower() == "flutter":
        return f"""
// Flutter 屏幕: {screen_name}
import 'package:flutter/material.dart';

class {screen_name}Screen extends StatelessWidget {{
    @override
    Widget build(BuildContext context) {{
        return Scaffold(
            appBar: AppBar(
                title: Text('{screen_name}'),
            ),
            body: Center(
                child: Text(
                    'Welcome to {screen_name}!',
                    style: TextStyle(fontSize: 24),
                ),
            ),
        );
    }}
}}
        """
    
    elif platform.lower() == "swift":
        return f"""
// iOS Swift 视图控制器: {screen_name}
import UIKit

class {screen_name}ViewController: UIViewController {{
    
    override func viewDidLoad() {{
        super.viewDidLoad()
        setupUI()
    }}
    
    private func setupUI() {{
        view.backgroundColor = .systemBackground
        title = "{screen_name}"
        
        let titleLabel = UILabel()
        titleLabel.text = "Welcome to {screen_name}!"
        titleLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(titleLabel)
        
        NSLayoutConstraint.activate([
            titleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            titleLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }}
}}
        """
    
    else:
        return f"不支持的平台: {platform}。支持的平台: React Native, Flutter, Swift"

# ===== 后端开发 =====
@universal_mcp.tool()
async def create_api_endpoint(language: str, endpoint_name: str, method: str = "GET") -> str:
    """为不同语言创建API端点"""
    
    if language.lower() == "python":
        return f"""
# Python Flask API 端点
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/{endpoint_name}', methods=['{method}'])
def {endpoint_name}():
    if request.method == '{method}':
        return jsonify({{
            'message': 'Hello from {endpoint_name}!',
            'method': '{method}',
            'timestamp': datetime.utcnow().isoformat()
        }})
        """
    
    elif language.lower() == "javascript":
        return f"""
// Node.js Express API 端点
const express = require('express');
const router = express.Router();

router.{method.lower()}('/{endpoint_name}', (req, res) => {{
    res.json({{
        message: 'Hello from {endpoint_name}!',
        method: '{method}',
        timestamp: new Date().toISOString()
    }});
}});

module.exports = router;
        """
    
    elif language.lower() == "java":
        return f"""
// Java Spring Boot API 端点
@RestController
@RequestMapping("/api")
public class {endpoint_name.capitalize()}Controller {{
    
    @{method.capitalize()}Mapping("/{endpoint_name}")
    public ResponseEntity<Map<String, Object>> {endpoint_name}() {{
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello from {endpoint_name}!");
        response.put("method", "{method}");
        response.put("timestamp", Instant.now().toString());
        
        return ResponseEntity.ok(response);
    }}
}}
        """
    
    else:
        return f"不支持的语言: {language}。支持的语言: Python, JavaScript, Java"

# ===== 数据库操作 =====
@universal_mcp.tool()
async def create_database_model(database_type: str, table_name: str, fields: str) -> str:
    """为不同数据库类型创建模型"""
    
    if database_type.lower() == "sql":
        return f"""
-- SQL 表创建
CREATE TABLE {table_name} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    {fields},
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_{table_name}_created_at ON {table_name}(created_at);
        """
    
    elif database_type.lower() == "mongodb":
        return f"""
// MongoDB 集合模式
const {table_name}Schema = {{
    {fields},
    createdAt: {{ type: Date, default: Date.now }},
    updatedAt: {{ type: Date, default: Date.now }}
}};

// 创建索引
db.{table_name}.createIndex({{ "createdAt": 1 }});
        """
    
    elif database_type.lower() == "django":
        return f"""
# Django ORM 模型
from django.db import models

class {table_name.capitalize()}(models.Model):
    {fields}
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = '{table_name}'
        ordering = ['-created_at']
        """
    
    else:
        return f"不支持的数据库类型: {database_type}。支持的类型: SQL, MongoDB, Django"

# ===== 测试代码生成 =====
@universal_mcp.tool()
async def create_test_code(testing_framework: str, test_name: str, function_to_test: str) -> str:
    """为不同测试框架创建测试代码"""
    
    if testing_framework.lower() == "pytest":
        return f"""
# PyTest 测试
import pytest
from {function_to_test} import {function_to_test}

class Test{test_name.capitalize()}:
    
    def test_{test_name}_success(self):
        # 测试成功情况
        result = {function_to_test}()
        assert result is not None
        
    def test_{test_name}_failure(self):
        # 测试失败情况
        with pytest.raises(Exception):
            {function_to_test}(invalid_param=True)
        """
    
    elif testing_framework.lower() == "jest":
        return f"""
// Jest 测试
import {{ {function_to_test} }} from './{function_to_test}';

describe('{test_name}', () => {{
    test('should work correctly', () => {{
        const result = {function_to_test}();
        expect(result).toBeDefined();
    }});
    
    test('should handle errors', () => {{
        expect(() => {{
            {function_to_test}({{ invalidParam: true }});
        }}).toThrow();
    }});
}});
        """
    
    elif testing_framework.lower() == "junit":
        return f"""
// JUnit 测试
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class {test_name.capitalize()}Test {{
    
    @Test
    void test{test_name.capitalize()}Success() {{
        // 测试成功情况
        var result = {function_to_test}();
        assertNotNull(result);
    }}
    
    @Test
    void test{test_name.capitalize()}Failure() {{
        // 测试失败情况
        assertThrows(Exception.class, () -> {{
            {function_to_test}(true);
        }});
    }}
}}
        """
    
    else:
        return f"不支持的测试框架: {testing_framework}。支持的框架: PyTest, Jest, JUnit"

# ===== DevOps 和部署 =====
@universal_mcp.tool()
async def create_deployment_config(platform: str, app_name: str, port: int = 3000) -> str:
    """为不同平台创建部署配置"""
    
    if platform.lower() == "docker":
        return f"""
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE {port}
CMD ["npm", "start"]

# docker-compose.yml
version: '3.8'
services:
  {app_name}:
    build: .
    ports:
      - "{port}:{port}"
    environment:
      - NODE_ENV=production
        """
    
    elif platform.lower() == "kubernetes":
        return f"""
# Kubernetes 部署配置
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {app_name}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: {app_name}
  template:
    metadata:
      labels:
        app: {app_name}
    spec:
      containers:
      - name: {app_name}
        image: {app_name}:latest
        ports:
        - containerPort: {port}
---
apiVersion: v1
kind: Service
metadata:
  name: {app_name}-service
spec:
  selector:
    app: {app_name}
  ports:
    - protocol: TCP
      port: 80
      targetPort: {port}
  type: LoadBalancer
        """
    
    elif platform.lower() == "nginx":
        return f"""
# Nginx 配置
server {{
    listen 80;
    server_name {app_name}.example.com;
    
    location / {{
        proxy_pass http://localhost:{port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }}
}}
        """
    
    else:
        return f"不支持的部署平台: {platform}。支持的平台: Docker, Kubernetes, Nginx"

if __name__ == "__main__":
    print("🚀 通用开发 MCP 服务器启动中...")
    universal_mcp.run()
