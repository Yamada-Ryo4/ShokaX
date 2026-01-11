# 开发日志 (Development Log)

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




