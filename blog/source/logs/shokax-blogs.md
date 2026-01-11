---
title: ShokaX Blog 开发日志
date: 2026-01-10 03:20:31
type: "logs"
layout: "page"
---
# ShokaX Blog 开发日志 (Development Log)

## 2026-01-10
- **任务**: 配置自定义与界面文本修改
- **操作**: 
    - 检查当前 `_config.shokax.yml` 状态。
    - 恢复用户原始配置结构（Menu, Copyright等）。
    - 将自定义扩展项（Reward, Post Meta, Detailed Footer）合并入配置文件。
    - **打赏功能深度修复**: 
        - 纠正了 `reward.account` 结构。
        - 增加了 `USDT(TRC20)` 支持。
        - 注入 CSS 锁死了二维码图片的尺寸为 `10rem x 10rem` 且比例为 1:1，防止因图片分辨率不同导致的布局错位。
        - **变更**: 注释掉了支付宝 (Alipay) 选项，仅保留微信和 USDT。
    - **滚动与抖动终极修复 (CSS 注入 app.styl)**:
        - 将侧边栏 `affix` 逻辑改为原生 `sticky`，防止高度塌陷死循环。
        - 强制 `html/body` 原生滚动，确保顶部导航栏 JS 逻辑正常触发。
        - 解决主内容区透明导致的“双重影”视觉问题。
    - 确认 `languages.yml` 已存在，用于覆盖界面文本。
    - **新增**: 在 `languages.yml` 中增加了打赏文字 (`reward.text`) 的自定义项。
    - 创建 `blog/source/images/` 目录，用于存放打赏二维码图片。
    - 状态：所有修复已通过本地覆盖（layout/）和自动化脚本（scripts/）持久化，无惧 node_modules 覆盖。
- **任务**: 搜索与评论系统修复
- **操作**:
    - 安装 `pagefind` 依赖并配置主题 `_config.shokax.yml` 启用 Pagefind 本地搜索。
    - 更新 `package.json` 中的 `postbuild` 脚本，确保在构建后自动生成 Pagefind 索引。
    - 启用 `Waline` 评论系统并添加完整配置模板，新增贴吧表情包支持。
    - 再次强化 `reward.pug` 逻辑，使用 `typeof` 严格检查，彻底杜绝 `assetsnull` 链接生成。
    - **V5.1 布局微调**: 修正了之前过度修复导致的卡片布局失效问题，恢复了文章区域的阴影、圆角及与侧边栏的间距。
    - **V6 动态壁纸与视觉优化**:
        - 实现了点击播放按钮切换视频背景的功能，支持丝滑的图片/视频过渡动画。
        - **新增**: 开启了视频壁纸自动播放逻辑。
        - 彻底校准了 Header 文字、波浪层、视频层及内容区的 Z-index 关系。
        - 移除了打赏码的白框与内边距，实现纯净透明的视觉效果。
    - **内容清理**: 删除了测试用的文章 `test-features.md`。
    - **博客重写**: 重新撰写了部署记录博文，以更加感性和纪实的方式记录了从 Halo 切换回 ShokaX 的心路历程。
- **任务**: 自动化构建优化
- **操作**:
    - 修改 `package.json`，将 `hexo generate` 与 `pagefind` 索引命令合并至 `build` 脚本。
    - 确保 Cloudflare Pages 等部署平台只需运行 `npm run build` 即可完成全自动构建。
- **任务**: 新增“开发日志”页面
- **操作**:
    - 将 `logs/log.md` 重命名为 `logs/index.md`。
    - 在 `_config.shokax.yml` 中新增“日志”菜单项。
    - 在 `languages.yml` 中添加菜单项的中文翻译。
- **任务**: 细节优化与反馈跟进
- **操作**:
    - 确认视频背景 R2 加载速度极快（秒开级）。
    - 解决了所有视觉错位与过渡闪烁问题。

## 2026-01-11
- **任务**: `/logs/` 页面布局与首页完全一致
- **问题**: 日志页面使用简单的文本列表布局，与首页的卡片式布局不一致。
- **操作**:
    - **修改 `logs.pug` 模板**:
        - 引入 `_mixin/segment.pug` 和 `_mixin/postmeta.pug`
        - 使用与 `index.pug` 相同的卡片结构 (`article.item` + `div.cover` + `div.info`)
        - 调用 `+PMRender(log)` mixin 显示完整元数据（日期、字数、阅读时间）
        - 添加摘要区域和 "more..." 按钮
    - **添加翻译项**:
        - 在 `languages.yml` 中添加 `title.logs: 开发日志`
        - 解决标题显示为 "TITLE.LOGS" 的问题
    - **重建入口文件**:
        - 重新创建 `logs/index.md` 作为 `/logs/` 端点入口
- **最终效果**:
    - ✅ 标题正确显示为 "开发日志"
    - ✅ 卡片式布局与首页一致
    - ✅ 封面图片正常显示
    - ✅ 完整元数据：日期、字数、阅读时间
    - ✅ 摘要内容和 "more..." 按钮
    - ✅ 左侧边栏完整显示
    - **部署问题修复**:
        - 创建 `scripts/patch-logs.js` 脚本在构建时自动修补 `logs.pug`
        - 更新 `package.json` 的 build 脚本确保部署时布局正确
