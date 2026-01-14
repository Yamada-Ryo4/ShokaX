---
title: API-Proxy更新日志
date: 2026-01-14 18:09:04
type: "logs"
layout: "page"
---
# Update Log

## [2026-01-14] - Omni-Proxy Update

本次更新重点扩展了对 OpenAI 和 Claude 的原生支持，并新增了跨协议转换功能（Gemini 伪装成 Claude），同时对文档进行了全面重构。

### ✨ 新增功能 (New Features)

#### 1. 多平台代理支持
- **OpenAI Native Proxy (`openai.js`)**
  - 新增对 OpenAI 官方接口的完整支持。
  - **关键特性**：原生支持 WebSocket 协议转发，完美兼容 OpenAI Realtime API (实时语音/视频)。
  - 支持 SSE (Server-Sent Events) 流式输出。

- **Claude Native Proxy (`claude.js`)**
  - 新增 Anthropic Claude 官方接口代理。
  - **关键特性**：自动处理 `x-api-key`、`anthropic-version` 等专用 Header，修复浏览器端调用的 CORS 问题。

#### 2. 协议转换适配器 (Protocol Adapters)
- **Gemini-to-Claude Adapter (`gemini-claude.js`)**
  - 实现将 Gemini API 伪装成 Claude 协议。
  - **核心逻辑**：
    - 自动映射 `messages` 结构至 Gemini 的 `contents`。
    - 支持提取 System Prompt 并转换为 `system_instruction`。
    - 兼容非流式 (Non-Streaming) 及基础流式响应。
  - **适用场景**：CodeX/ClaudeCode 等仅支持 Claude 协议但需要调用 Google 模型的工具。

### 📚 文档更新 (Documentation)

- **README 重构**：
  - 重新设计了文档结构，引入分类表格（直连代理 vs 协议转换）。
  - 新增各平台 Shield Badges (OpenAI, Claude, Gemini)。
  - 补充了 GCLI 路由网关的详细配置说明。
- **配置指引**：
  - 新增 `UPSTREAM_MAP` 路由表说明，明确了 `/codeassist`, `/oauth` 等路径的转发规则。

### ⚡ 优化与修复 (Improvements)

- **隐私增强**：所有新脚本均内置隐私清洗逻辑，自动移除 `Cf-Connecting-Ip`、`X-Forwarded-For`、`X-Real-Ip` 等 Cloudflare 边缘节点特征头。
- **CORS 标准化**：统一了所有脚本的跨域资源共享 (CORS) 设置，确保 Web 版客户端（如 NextChat, LobeChat）能无障碍调用。
- **安全性**：强化了 `Host` 和 `Origin` 的伪装逻辑，确保能通过上游服务商的严格校验。

---

> **Note:** 部署新脚本后，请务必在 Cloudflare 后台绑定自定义域名以保证服务的连通性。
