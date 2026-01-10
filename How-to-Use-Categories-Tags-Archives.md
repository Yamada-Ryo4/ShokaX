# 如何在 Hexo ShokaX 主题中添加归档、标签和分类页面

本文档将指导你如何初始化和配置博客的“归档”、“标签”和“分类”页面。这些页面是博客的标准功能页，通常只需要创建一次。

## 1. 归档页面 (Archives)

归档页面是 Hexo 默认生成的，通常不需要手动创建页面文件。

*   **访问地址**: `http://localhost:4000/archives/`
*   **功能**: 按时间轴展示所有文章。
*   **配置**:
    *   在 `_config.yml` (Hexo 根配置) 中，确保 `archive_generator` 已启用（默认即启用）。
    *   在 `_config.shokax.yml` (主题配置) 的 `menu` 下确保有 `archives: /archives/`。

**如果你发现点击“归档”报 404**，请尝试重新生成：
```bash
npx hexo clean && npx hexo g
```

---

## 2. 标签页面 (Tags)

标签云页面需要手动创建一个特殊的页面文件。

### 第一步：生成页面
在终端执行：
```bash
npx hexo new page tags
```
这会在 `source/tags/` 目录下生成一个 `index.md` 文件。

### 第二步：编辑 Front-matter
打开 `source/tags/index.md`，将其内容修改为：

```markdown
---
title: 标签
date: 2026-01-10 13:00:00
type: "tags"
layout: "page"
---
```

**关键点**:
*   `type: "tags"`：这是告诉主题这个页面要渲染成“标签云”样式的关键。
*   `title`: 页面标题，你可以改为“Tags”或“标签墙”。

---

## 3. 分类页面 (Categories)

分类页面同样需要手动创建。

### 第一步：生成页面
在终端执行：
```bash
npx hexo new page categories
```
这会在 `source/categories/` 目录下生成一个 `index.md` 文件。

### 第二步：编辑 Front-matter
打开 `source/categories/index.md`，将其内容修改为：

```markdown
---
title: 分类
date: 2026-01-10 13:00:00
type: "categories"
layout: "page"
---
```

**关键点**:
*   `type: "categories"`：告诉主题这是一个“分类概览”页面。

---

## 4. 如何在文章中指定标签和分类

创建好上述页面后，它们会自动索引你文章中的 `tags` 和 `categories` 字段。

在写新文章时（例如 `source/_posts/my-new-post.md`），在头部的 Front-matter 中这样写：

```markdown
---
title: 我的新文章
date: 2026-01-10 14:30:00
categories:
  - 技术              # 一级分类
  - 前端开发          # 二级分类
tags:
  - Hexo
  - ShokaX
  - 教程
---

这里是文章正文...
```

*   **Categories (分类)**: 具有层级关系（如上例，前端开发属于技术）。
*   **Tags (标签)**: 扁平化标签，用于描述文章关键词。

---

## 5. 验证

完成上述步骤后，重新部署博客：

```bash
npx hexo clean
npx hexo g
npx hexo s
```

现在点击菜单栏的“标签”和“分类”，应该就能看到自动生成的聚合页面了。
