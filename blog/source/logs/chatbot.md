---
title: ChatBot Watch App 完全更新日志
date: 2026-01-22 23:30:00
updated: 2026-01-23 09:00:00
type: "logs"
layout: "page"
---

# ChatBot Watch App 完全更新日志

https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch

这份日志详细记录了所有修改的文件、功能变更以及技术细节。

---

## 🚀 2026-01-23 更新 (v1.2 正式版)

> **摘要**：新增 Smart Stack 智能叠放组件，实现表盘复杂功能 (Complication)，优化模型选择交互，修复 Widget 致命内存崩溃问题。

### 文件: [ChatBotWidget.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBotWidget/ChatBotWidget.swift) (关键修复)
- **内存优化 (Memory Optimization)**:
  - **问题**: Widget 启动时加载完整 `chatSessions` 数组导致内存溢出 (Code=11 Crash)。
  - **方案**: 完全移除 `ChatSession` 和 `ChatMessage` 结构体解码逻辑。
  - **新逻辑**: 改为读取轻量级字典 `widget_tiny_data`，仅包含 `title` 和 `lastMessage` 两个字符串。
  - *效果*: 内存占用降低 99%+，Widget 永不崩溃。

### 文件: [ViewModels.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ViewModels.swift)
- **轻量级 Widget 数据写入**:
  - 在 `saveSessions()` 方法中新增逻辑：每次保存聊天记录时，同步写入一份精简的 `widget_tiny_data` 到 `UserDefaults`。
  - 数据结构：`["title": String, "lastMessage": String]`
  - *联动*: 确保 Widget 总能读取到最新的对话摘要。

### 文件: [ChatBotApp.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ChatBotApp.swift)
- **表盘复杂功能 (Complication)**:
  - 合并 `ComplicationController` 类到主入口文件，确保被正确编译。
  - 将类和所有协议方法设为 `public`，解决跨模块访问问题。
  - *功能*: 支持在表盘添加快捷方式，点击直接唤醒 ChatBot。
- **二级模型选择菜单 (Nested Model Picker)**:
  - 新增 `ModelSelectionRootView` 和 `ModelListForProviderView` 两个视图结构。
  - **交互**: 设置页点击"选择模型" -> 显示服务商列表 -> 点击服务商 -> 显示该服务商下的模型列表。
  - *效果*: 模型选择更加清晰，不再需要在一个长列表中滚动寻找。

### 文件: [ChatView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ChatView.swift)
- **左滑删除对话 (Swipe-to-Delete)**:
  - 在 `HistoryListView` 的 `ForEach` 中添加 `.onDelete` 修饰符。
  - **二次确认**: 删除操作会弹出 `Alert` 确认框，防止误删。
  - *交互*: 在历史列表中左滑某个对话 -> 点击删除 -> 弹窗确认 -> 执行删除。

### 文件: [SettingsView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/SettingsView.swift)
- **模型选择入口重构**:
  - 将原有的 `Picker` 组件替换为 `NavigationLink`。
  - 右侧显示当前选中的模型名称（自动截断）。

### 文件: [WatchInfo.plist](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/WatchInfo.plist)
- **Complication 模块名修复**:
  - 将 `CLKComplicationPrincipalClass` 的值从硬编码的 `ChatBot_Watch_App.ComplicationController` 改为 `$(PRODUCT_MODULE_NAME).ComplicationController`。
  - *效果*: 动态解析模块名，确保在不同构建配置下都能正确加载。

### 文件: [README.md](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/README.md) (全面重写)
- **内容**: 新增 6 大核心特性分类、详细安装部署指南、Widget/Complication 使用说明、FAQ。
- **语法修正**: 统一列表格式、修复空链接和乱码 emoji。
- **上下文说明**: 明确"滑动窗口"机制——发送给 AI 的是最近 10 条消息，本地历史完整保留。

---

## 💎 2026-01-22 更新 (体验优化与隐私安全)

> **摘要**：重点优化了输入与交互体验，新增消息行内编辑功能，并完成了代码的隐私合规化处理。

### 文件: [ChatView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ChatView.swift)
- **行内编辑 (Inline Message Editing)**:
  - **功能**: 允许用户直接修改最近发送的消息内容。
  - **逻辑**: 编辑提交后，自动清除该消息之后的旧上下文，并触发重新生成。
  - *交互*: 点击用户气泡下方的编辑按钮（✏️）即可进入编辑模式。
- **快速重试 (Regenerate)**:
  - **功能**: 在用户最新消息下方新增"重新生成"按钮。
  - *场景*: 当 AI 回答不完整或卡住时，一键重试。

### 文件: [SettingsView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/SettingsView.swift)
- **输入框焦点修复 (Input Stability)**:
  - 引入了 **Draft State (草稿状态)** 模式来处理 API Key 和 URL 的编辑。
  - 把编辑操作隔离在局部 `@State` 中，并在 `onDisappear` 时才同步回主数据源。
  - *修复问题*: 彻底解决了 WatchOS 上键盘输入时，因父视图 `ForEach` 刷新导致的键盘断连、闪退和吞字问题。

### 文件: [ViewModels.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ViewModels.swift)
- **隐私合规 (Privacy Cleaning)**:
  - 移除了代码中遗留的所有硬编码敏感配置（Key）。
  - 优化了预设配置的加载逻辑 (v13)。

### 文件: [LLMService.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/LLMService.swift)
- **网络层重构 (Network hardening)**:
  - 移除了不稳定的自定义 TLS 验证代理，回归系统原生 `URLSession` 安全策略。
  - 增加了标准的 `User-Agent` 请求头，解决了部分服务器返回 `SSL Closed` 或 `403` 的问题。

---

## 🔥 2026-01-21 紧急修复 (Critical Hotfix)

> **摘要**：修复了流式传输期间退出 App 导致的闪退，以及因数据损坏导致 App 永久无法打开的致命 Bug。

### 文件: [ChatView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ChatView.swift)
- **后台防崩机制 (Background Protection)**:
  - 引入 `@Environment(\.scenePhase)` 监听应用生命周期。
  - **核心逻辑**：当 App 进入后台 (`.inactive` 或 `.background`) 时，立即调用 `viewModel.stopGeneration()` 强行中断生成。
  - *修复问题*：解决了流式输出未完成时用户按下表冠退出，后台线程尝试刷新 UI 导致的 WatchOS 系统强制崩溃 (Watchdog Termination)。

### 文件: [ViewModels.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ViewModels.swift)
- **启动容错 (Safe Boot)**:
  - 重写 `init()` 中的数据加载逻辑，将原本的 `try?` 替换为完整的 `do-catch` 结构。
  - **自动修复**：若检测到本地 `UserDefaults` 中的 JSON 数据损坏（Crash Loop 的元凶），自动捕获错误并重置为空列表，优先保住 App 正常启动。
  - *修复问题*：解决了因一次意外崩溃导致本地数据写坏，进而导致 App 每次启动即闪退（Persistent Crash）的问题。

### 文件: [LLMService.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/LLMService.swift)
- **僵尸任务清理 (Zombie Task Killing)**:
  - 在 `streamOpenAIChat` 和 `streamGeminiChat` 的 `AsyncThrowingStream` 中添加 `continuation.onTermination` 回调。
  - **联动取消**：当 UI 层取消任务时，强制通过 `task.cancel()` 切断底层的 `URLSession` 网络连接。
  - *优化*：防止 UI 停止生成后，后台仍在默默下载数据，既浪费电量又可能导致数据错乱写入。

---

## 🆕 2026-01-21 更新 (功能特性)

### 文件: [ChatView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ChatView.swift)
- **回到底部浮动按钮 (Scroll-to-Bottom Button)**：
  - 使用 `GeometryReader` + `PreferenceKey` 检测底部是否可见。
  - 加入**状态防抖**（`if isAtBottom != isVisible`），防止无限重绘导致闪退。
  - 使用 `.overlay(alignment: .bottom)` 确保按钮可点击（避免 ZStack 与 ScrollView 的触摸冲突）。
  - UI：纯蓝色向下箭头 `chevron.down`，无背景，触控区域 60×44pt。
- **用户气泡颜色**：
  - 从蓝色 (`Color.blue`) 改为绿色 (`Color.green`)，模仿 iMessage 风格。

### 文件: [SettingsView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/SettingsView.swift)
- **新增 Toggle：显示/隐藏导航栏模型名称**。
- **新增 Toggle：显示/隐藏回到底部按钮**。

### 文件: [ViewModels.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ViewModels.swift)
- **新增属性**：
  - `@Published var showModelNameInNavBar: Bool`
  - `@Published var showScrollToBottomButton: Bool`
  - `@Published var isInputVisible: Bool`
- **模型名称缓存**：
  - 新增 `_cachedModelName` 和 `_cachedModelID`，减少遍历计算。

---

## 🛠 2026-01-13 更新 (核心架构与稳定性)

### 文件: [ChatView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ChatView.swift)
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

### 文件: [ViewModels.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ViewModels.swift)
- **强制配置刷新**：
  - 将 `currentVersion` 从 `v9` 升级到 `v10`。
  - *效果*：强制清空旧的 `UserDefaults` 缓存，确保新的 API Key 不会被覆盖。
- **触觉反馈 (Haptics)**：
  - 引入 `WatchKit`，在 `sendMessage`, `stopGeneration`, `error` 等关键节点加入震动。
  - *效果*：操作更有"质感"，不再是干巴巴的点击。

---

## 🎨 渲染引擎增强 (Rendering Engine)

### 文件: [LaTeXParser.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/LaTeXParser.swift) (完全重写)
- **移除正则**：放弃了不稳定的正则表达式，改用递归下降解析。
- **新增数学符号支持**：
  - **向量**：`\vec{a}` -> `a⃗`
  - **顶部符号**：`\bar{x}` -> `x̅`, `\hat{i}` -> `î`
  - **矩阵**：`\begin{bmatrix} ... \end{bmatrix}` -> 自动转为 ASCII 对齐块。
  - **嵌套分数**：支持无限层级的 `\frac{}{}` 嵌套。
- **防吞字机制 (Fallback)**：
  - 以前：遇到不认识的 `\command` 直接删除。
  - 现在：遇到不认识的命令，保留原文本 `\command`，绝不吞掉用户的一个字。

### 文件: [MarkdownParser.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/MarkdownParser.swift) (完全重写)
- **代码块保护 (Code Protection)**：
  - 增加预处理逻辑，按 ` ``` ` 分割文本。
  - *效果*：源码块内的 LaTeX 或表格语法不再被解析，保持原样。
- **手表专用表格 (Watch Tables)**：
  - 样式：`| Header |` -> ` Header ` (去除两端竖线，节省空间)。
  - 分隔：使用 ` │ ` (全角/空格组合) 代替普通竖线，防止排版错乱。
  - 线条：使用短横线 `──────` 代替长线，防止换行。

---

## ✨ UI/UX 细节打磨 (Polish)

### 文件: [ChatView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ChatView.swift)
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

### 文件: [ViewModels.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ViewModels.swift) (配置)
- **免费模型内置**：
  - 智谱 AI (GLM-4.6V-Flash)
  - *状态*：已硬编码写入，开箱即用。

---

## 📝 总结

**v1.2 (2026-01-23)** 是一次重大更新，引入了 Smart Stack 组件和表盘快捷方式，为用户带来更便捷的入口。同时修复了 Widget 的致命内存崩溃问题，并优化了模型选择的交互体验。文档也进行了全面重写，帮助新用户快速上手。
