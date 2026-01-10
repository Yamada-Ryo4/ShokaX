/**
 * 核心样式及逻辑持久化补丁 (Theme Patcher)
 * - 解决滚动抖动、侧边栏死循环、打赏码大小不一。
 * - 强制禁用 Algolia，防止 "Not initialized" 报错。
 * - 恢复视觉视差层级与 Body 背景。
 * - [V7] 硬删除支付宝数据，彻底杜绝图标残留。
 */

// 1. 数据级修复：在生成前从内存中删除支付宝配置
hexo.extend.filter.register('before_generate', function() {
    // 强制禁用 Algolia 搜索模块
    if (hexo.config.algolia) {
        hexo.config.algolia = false;
    }
    
    // 硬删除打赏账户中的 alipay
    if (hexo.theme.config.reward && hexo.theme.config.reward.account) {
        delete hexo.theme.config.reward.account.alipay;
        console.log('--- Theme Patcher: Alipay account hard-deleted ---');
    }
});

// 2. CSS 样式注入
hexo.extend.filter.register('after_render:html', function(str, data) {
    const customCSS = `
    <style>
        /* 强制原生滚动 */
        html { overflow-y: scroll !important; scrollbar-gutter: stable !important; }
        body { overflow: visible !important; }

        /* 解决侧边栏抖动 */
        #sidebar > .inner { position: sticky !important; top: 2rem !important; z-index: 10 !important; }
        #sidebar.affix > .inner { position: sticky !important; top: 2rem !important; }

        /* 恢复视差与层级 */
        #header { position: relative; z-index: 1 !important; }
        #waves { position: relative; z-index: 2 !important; transform: none !important; }
        main { position: relative; z-index: 3 !important; }
        #imgs { position: fixed !important; z-index: -1 !important; transform: none !important; }

        /* 打赏二维码：透明底、大间隔、1:1比例 */
        #qr > div { 
            display: inline-block !important; 
            margin: 2rem !important; 
            vertical-align: top !important; 
            background: transparent !important;
        }
        #qr > div > img {
            width: 12rem !important; 
            height: 12rem !important;
            object-fit: contain !important; 
            background-color: transparent !important; 
            padding: 0 !important; 
            border: none !important; 
            box-shadow: none !important;
        }
        #qr > div > p {
            margin-top: 0.5rem !important;
            color: var(--grey-5) !important;
        }

        /* 杂项 */
        #footer { position: relative; z-index: 10; }
    </style>`;

    return str.replace('</head>', customCSS + '</head>');
});
