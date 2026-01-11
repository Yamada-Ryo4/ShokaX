---
title: 测试日志
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
    - 再次强化 `reward.pug` 逻辑，使用 `typeof` 严格检查，彻底杜绝 `assetsnull` 链