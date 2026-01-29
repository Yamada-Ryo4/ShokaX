---
title: ChatBot Watch App 完全更新日志
date: 2026-01-22 23:30:00
updated: 2026-01-29 11:00:00
type: "logs"
layout: "page"
---

# ChatBot Watch App 完全更新日志

https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch

这份日志详细记录了所有修改的文件、功能变更以及技术细节。

---

## 🎯 2026-01-29 更新 (v1.3 正式版)

> **摘要**：重构 LaTeX 渲染系统，新增双模式切换、多 API Key 轮询、温度参数、系统提示词自定义等功能，大幅优化代码结构。

### 文件: [ChatView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ChatView.swift)
- **LaTeX 渲染双模式**:
  - 新增 `SimpleLatexConverter` 简单模式，使用原生 `Text` + Unicode 符号替换，稳定可靠。
  - 保留 `AdvancedLatexView` 高级模式，使用 FlowLayout + AST 解析，效果更精细。
  - `MessageContentView` 根据设置自动切换渲染方式。
- **嵌套 LaTeX 支持**:
  - 支持 `$$` 双美元符号标记。
  - 预处理 `\text{}` 命令，避免花括号干扰正则匹配。
  - 迭代处理 `\frac{}{}` 支持深层嵌套（最多 10 层）。
  - 单独处理 `\sqrt{}` 显示为 `√(内容)`。
- **根号视图优化**:
  - 高级模式使用 `overlay` 绘制横线，宽度自动匹配内容，不再溢出。
  - 添加 `.fixedSize()` 防止视图扩展。
- **代码优化**:
  - 符号映射表（希腊字母、数学运算符、上下标）改为静态常量。
  - 正则表达式缓存为静态属性，避免每次调用重新编译。
  - 删除约 200 行冗余代码。

### 文件: [ViewModels.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/ViewModels.swift)
- **新增设置项**:
  - `@AppStorage("latexRenderingEnabled")` - LaTeX 数学公式渲染开关（默认开启）。
  - `@AppStorage("advancedLatexEnabled")` - 高级渲染模式开关（默认关闭）。
  - `@AppStorage("enableHapticFeedback")` - 振动反馈开关（默认开启）。
  - `@AppStorage("historyMessageCount")` - 可配置对话历史数量（5-50 条，默认 10 条）。
  - `@AppStorage("customSystemPrompt")` - 自定义系统提示词。
  - `@AppStorage("temperature")` - 温度参数 (0.0-2.0，默认 0.7)。
- **条件性触觉反馈**:
  - 所有 `WKInterfaceDevice.current().play(...)` 调用改为根据 `enableHapticFeedback` 设置决定是否执行。
- **动态历史窗口**:
  - `buildHistoryWithContext` 方法使用 `historyMessageCount` 配置值替代硬编码的 10 条。
- **会话标题优化**:
  - 标题自动使用用户首条消息的前 15 字符 + 省略号。
  - 仅在标题为空或"新对话"时更新，避免覆盖已有标题。

### 文件: [Models.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/Models.swift)
- **多 API Key 支持 (Multi-Key Rotation)**:
  - 重构 `ProviderConfig` 结构，将单一 `apiKey` 改为 `apiKeys: [String]` 数组。
  - 新增 `currentKeyIndex` 跟踪当前使用的 Key 索引。
  - 添加 `rotateKey()` 方法实现自动轮询。
  - 保留向后兼容的 `apiKey` 计算属性，无缝升级。

### 文件: [SettingsView.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/SettingsView.swift)
- **新增「数学公式渲染」Section**:
  - 「启用 LaTeX 渲染」Toggle 主开关。
  - 「高级渲染模式」Toggle 子开关（仅在启用时显示）。
  - 高级模式警告提示："可能导致排版错误和渲染问题"。
- **新增「模型参数」Section**:
  - 温度 Picker (0.0-2.0，步进 0.1)。
  - 系统提示词编辑入口 (NavigationLink)。
- **界面设置新增**:
  - 「启用振动反馈」Toggle 开关。
  - 「对话历史上下文」Picker 控件（5-50 条，步进 5）。
- **多 Key 管理界面**:
  - `ProviderDetailView` 重构为列表式 Key 管理。
  - 显示所有已添加的 Key（掩码显示），当前使用的 Key 带 ✓ 标记。
  - 支持删除单个 Key（至少保留一个）。
- **新增 `SystemPromptEditView`**:
  - 使用 `TextField` 多行输入。
  - 保存/清空功能。
- **UI 优化**:
  - 全面移除设置页装饰性图标，回归原生简洁风格。
  - 控件改为 Picker，交互更统一。

### 文件: [LLMService.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/LLMService.swift)
- **温度参数支持**:
  - `streamChat` 方法签名新增 `temperature: Double` 参数。
  - OpenAI: 将 temperature 加入请求 body。
  - Gemini: 通过 `generationConfig` 传递 temperature。

### 文件: [LaTeXParser.swift](https://github.com/Yamada-Ryo4/ChatBot-For-Apple-Watch/blob/main/ChatBot%20Watch%20App/LaTeXParser.swift)
- **数学符号增强**:
  - **常用分数**：½, ⅓, ⅔, ¼, ¾ 等 15 个 Unicode 分数符号。
  - **三角函数**：sin, cos, tan, cot, sec, csc, arcsin, arccos, arctan, sinh, cosh, tanh。
  - **数学函数**：log, ln, exp, lg, lim, max, min, sup, inf, det, dim, ker, deg, gcd, lcm。
  - **希腊字母**：扩充至完整大小写 24 个字母。
  - **运算符**：新增 ∓, ≡, ∝, ∏, ∮, ∀, ∃, ∈, ∉, ⊂, ⊃, ⊆, ⊇, ∪, ∩, ∅, ⇐, ↔, ⇔, ∵, ∴, ∠, ⊥, ∥, △, ° 等。

### Bug 修复
- 修复 `SecureField` 导致无法使用手机键盘连续互通输入的问题，改用 `TextField`。
- 修复供应商配置页因动态标题刷新导致输入中断的问题 (Title 改为静态)。
- **LaTeX 渲染修复**:
  - 增加对 `/cos`, `/sin` 等非标准前缀的容错支持。
  - **分数优化**: 支持 `\frac{a}{b}` 的正确解析，不再因嵌套花括号失效。
  - 引入 `FlowLayout` 实现图文混排，支持**长数字/长单词自动换行**。
  - **逻辑修复**: 恢复了 components 模式下对上标(^)、下标(_)等符号的解析支持。

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
- **预设服务商**：
  - 智谱 AI、DeepSeek、硅基流动、阿里云百炼、ModelScope、OpenRouter、Gemini、GeminCLI。
  - 用户需自行配置 API Key。

---

## 📝 总结

**v1.3 (2026-01-29)** 是一次重大更新，重构了 LaTeX 渲染系统并提供双模式选择，新增多 API Key 轮询、温度参数、系统提示词等高级功能，同时大幅优化代码结构和性能。

**v1.2 (2026-01-23)** 引入了 Smart Stack 组件和表盘快捷方式，修复了 Widget 的致命内存崩溃问题。

**v1.1 及更早版本** 完成了核心功能的开发和稳定性修复。
