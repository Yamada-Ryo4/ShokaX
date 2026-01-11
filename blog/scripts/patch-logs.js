/**
 * Logs Page Layout Patcher
 * 在 Hexo 生成前修补 logs.pug 布局文件，使其与首页布局一致
 */

const fs = require('fs');
const path = require('path');

const logsPugPath = path.join(__dirname, '../node_modules/hexo-theme-shokax/layout/logs.pug');

const logsPugContent = `extends _partials/layout.pug
include _mixin/segment.pug
include _mixin/postmeta.pug

block head
    != _css('page.css')

block content
    div(class="index wrap")
        h2(class="divider")
            != __('title.logs') || 'Development Logs'
        - var logs = site.pages.toArray().filter(p => p.source && p.source.replace(/\\\\/g, '/').startsWith('logs/') && !p.source.endsWith('index.md') && p.permalink)
        if logs && logs.length > 0
            div(class="segments posts")
                each log in logs
                    article(class="item")
                        div(class="cover")
                            a(href=url_for(log.path), title=log.title, itemprop="url")
                                img(loading="lazy", decoding="async", src=_cover(log) || theme.image_server + '?random=' + Math.random(), alt="article cover")
                        div(class="info")
                            +PMRender(log)
                            h3
                                a(href=url_for(log.path), title=log.title, itemprop="url")= log.title
                            div(class="excerpt")
                                if log.description
                                    != log.description
                                else if log.excerpt
                                    != log.excerpt
                                else
                                    != _truncate(escape_html(_striptags(log.content)), 300)
                            a(href=url_for(log.path), title=log.title, class="btn", itemprop="url") more...
        else
            div(style="padding: 2rem;")
                p(style="color: #ccc;") No log entries found.
                p(style="color: #999; font-size: 0.9em;") Please add log pages under source/logs/ directory.
`;

try {
    fs.writeFileSync(logsPugPath, logsPugContent, 'utf8');
    console.log('✓ Patched logs.pug for card-based layout');
} catch (err) {
    console.error('✗ Failed to patch logs.pug:', err.message);
}
