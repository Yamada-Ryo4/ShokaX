---
title: ChatBot Watch App 完全更新日志
date: 2026-01-21 02:08:00
updated: 2026-01-21 02:08:00
type: "logs"
layout: "page"
---

# ChatBot Watch App 完全更新日志

这份日志详细记录了所有修改的文件、功能变更以及技术细节。

---

## 🆕 2026-01-21 更新

### 文件: [ChatView.swift](cci:7://file:///Users/lengfengy/Documents/ChatBot/ChatBot%20Watch%20App/ChatView.swift:0:0-0:0)
- **回到底部浮动按钮 (Scroll-to-Bottom Button)**：
  - 使用 `GeometryReader` + `PreferenceKey` 检测底部是否可见。
  - 加入**状态防抖**（`if isAtBottom != isVisible`），防止无限重绘导致闪退。
  - 使用 `.overlay(alignment: .bottom)` 确保按钮可点击（避免 ZStack 与 ScrollView 的触摸冲突）。
  - UI：纯蓝色向下箭头 `chevron.down`，无背景，触控区域 60×44pt。
- **用户气泡颜色**：
  - 从蓝色 (`Color.blue`) 改为绿色 (`Color.green`)，模仿 iMessage 风格。

### 文件: [SettingsView.swift](cci:7://file:///Users/lengfengy/Documents/ChatBot/ChatBot%20Watch%20App/SettingsView.swift:0:0-0:0)
- **新增 Toggle：显示/隐藏导航栏模型名称**。
- **新增 Toggle：显示/隐藏回到底部按钮**。

### 文件: [ViewModels.swift](cci:7://file:///Users/lengfengy/Documents/ChatBot/ChatBot%20Watch%20App/ViewModels.swift:0:0-0:0)
- **新增属性**：
  - `@Published var showModelNameInNavBar: Bool`
  - `@Published var showScrollToBottomButton: Bool`
  - `@Published var isInputVisible: Bool`
- **模型名称缓存**：
  - 新增 `_cachedModelName` 和 `_cachedModelID`，减少遍历计算。

---

## 🛠 2026-01-13 更新 (核心架构与稳定性)

### 文件: [ChatView.swift](cci:7://file:///Users/lengfengy/Documents/ChatBot/ChatBot%20Watch%20App/ChatView.swift:0:0-0:0)
- **重构视图结构**：将 `LazyVStack` 替换为 `VStack`。
  - *原因*：`LazyVStack` 在 WatchOS 上会导致动态加载时的 UI 跳动（黑屏闪烁）。
  - *效果*：流式输出现在丝般顺滑，不再抖动。
- **智能滚动 (Auto-Scroll)**：
  - 修改 `onChange(of: viewModel.currentMessages.count)` 逻辑。
  - *效果*：仅当新消息增加时才滚动到底部，查看历史消息时不会被强制拉回。
- **消息截断 (Message Capping)**：
  - 仅渲染最近的 **20** 条消息。
  - *原因*：防止长对话导致 Watch 内存溢出（OOM Crash）。
- **Sheet 修复**：
  - 将 `.sheet(isPresented: $showHistory)` 移动到 `NavigationStack` 最外层。
  - *效果*：彻底修复了"历史记录列表点不开"的 Bug。

### 文件: [ViewModels.swift](cci:7://file:///Users/lengfengy/Documents/ChatBot/ChatBot%20Watch%20App/ViewModels.swift:0:0-0:0)
- **强制配置刷新**：
  - 将 `currentVersion` 从 `v9` 升级到 `v10`。
  - *效果*：强制清空旧的 `UserDefaults` 缓存，确保新的 API Key 不会被覆盖。
- **触觉反馈 (Haptics)**：
  - 引入 `WatchKit`，在 `sendMessage`, `stopGeneration`, `error` 等关键节点加入震动。
  - *效果*：操作更有"质感"，不再是干巴巴的点击。

---

## 🎨 渲染引擎增强 (Rendering Engine)

### 文件: `LaTeXParser.swift` (完全重写)
- **移除正则**：放弃了不稳定的正则表达式，改用递归下降解析。
- **新增数学符号支持**：
  - **向量**：`\vec{a}` -> `a⃗`
  - **顶部符号**：`\bar{x}` -> `x̅`, `\hat{i}` -> `î`
  - **矩阵**：`\begin{bmatrix} ... \end{bmatrix}` -> 自动转为 ASCII 对齐块。
  - **嵌套分数**：支持无限层级的 `\frac{}{}` 嵌套。
- **防吞字机制 (Fallback)**：
  - 以前：遇到不认识的 `\command` 直接删除。
  - 现在：遇到不认识的命令，保留原文本 `\command`，绝不吞掉用户的一个字。

### 文件: `MarkdownParser.swift` (完全重写)
- **代码块保护 (Code Protection)**：
  - 增加预处理逻辑，按 ` ``` ` 分割文本。
  - *效果*：源码块内的 LaTeX 或表格语法不再被解析，保持原样。
- **手表专用表格 (Watch Tables)**：
  - 样式：`| Header |` -> ` Header ` (去除两端竖线，节省空间)。
  - 分隔：使用 ` │ ` (全角/空格组合) 代替普通竖线，防止排版错乱。
  - 线条：使用短横线 `──────` 代替长线，防止换行。

---

## ✨ UI/UX 细节打磨 (Polish)

### 文件: [ChatView.swift](cci:7://file:///Users/lengfengy/Documents/ChatBot/ChatBot%20Watch%20App/ChatView.swift:0:0-0:0)
- **原始模式 (Raw Mode)**：
  - 新增 `PrettyMessageBubble` 内的 `@State private var showRaw`。
  - **功能**：点击气泡右下角的 `{}` 图标，瞬间切换"渲染视图"和"原始 Markdown"。
  - *目的*：作为渲染出错时的终极兜底方案。
- **按钮优化 (Touch Targets)**：
  - **历史记录 (右上)** & **设置 (左上)** 按钮：
  - 尺寸：强制设定为 `44x44` pt (Apple 推荐的最小触摸区)。
  - 样式：统一加粗 (`Font.weight(.bold)`)，视觉更平衡。
- **停止按钮 (Stop Button)**：
  - 在 `BottomInputArea` 中，当 `isLoading` 为 true 时，发送箭头变为红色停止方块。

### 文件: [ViewModels.swift](cci:7://file:///Users/lengfengy/Documents/ChatBot/ChatBot%20Watch%20App/ViewModels.swift:0:0-0:0) (配置)
- **免费模型内置**：
  - 智谱 AI (GLM-4.6V-Flash)
  - *状态*：已硬编码写入，开箱即用。

---

## 📝 总结
本次更新从**底层架构**（防崩溃）、**渲染层**（数理化/表格增强）到**交互层**（震动/大按钮/原始模式/回到底部）进行了全方位的改造。现在它不仅仅是一个能用的 App，更是一个稳定、好用且强大的解题助手。
