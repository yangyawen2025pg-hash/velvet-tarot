# Velvet Tarot Room | 丝绒塔罗屋

> 一个治愈系的在线情绪疗愈空间 —— 在这里，你可以与塔罗对话、记录心情轨迹、写下给自己的信。

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://velvet-tarot.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)

---

## 项目介绍

丝绒塔罗屋是一个面向年轻女性的情绪疗愈 Web 应用，融合了塔罗占卜、心情记录、信件书写等功能。设计理念是创造一个温暖、私密、治愈的数字空间，让用户在忙碌的生活中找到片刻宁静。

**核心功能：**

- **牌语心言** — 78张韦特塔罗牌，支持手势交互抽牌，AI 智能解牌
- **星尘记忆** — 水晶球可视化，记录每一封写给自己的信
- **时光信笺** — 信件时间轴，回顾过去的自己
- **心绪织锦** — 心情指数追踪，周度情绪分析

**技术亮点：**

- 手绘油画风格 UI，丁达尔光效、粒子动画
- 鼠标跟随光晕交互、浮动塔罗牌装饰
- 基于情绪词典的心情分析算法
- 全栈架构：React + tRPC + Drizzle ORM + MySQL
- 响应式设计，支持移动端和桌面端

---

## 在线体验

https://velvet-tarot.vercel.app

---

## 技术栈

### 前端

| 技术 | 用途 |
|------|------|
| React 19 + TypeScript | UI 框架 |
| Vite | 构建工具 |
| Tailwind CSS | 样式方案 |
| GSAP + ScrollTrigger | 动画引擎 |
| shadcn/ui | 组件库 |

### 后端

| 技术 | 用途 |
|------|------|
| Hono | HTTP 服务器 |
| tRPC 11 | 类型安全 API |
| Drizzle ORM | 数据库 ORM |
| MySQL | 数据存储 |
| OAuth 2.0 | 用户认证 |

---

## 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/你的用户名/velvet-tarot.git
cd velvet-tarot

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
open http://localhost:3000
```

---

## 项目截图

*(建议在这里添加几张网站截图)*

---

## 设计说明

本项目的设计灵感来源于西方古典油画、杂志封面美学和东方治愈文化。整体色调以暖金、薰衣草紫、鼠尾草绿为主，营造温馨梦幻的氛围。

**字体选择：**
- 中文标题：思源宋体 (Noto Serif SC)
- 英文标题：Cinzel Decorative
- 正文：Cormorant Garamond

---

## 开源许可

MIT License
