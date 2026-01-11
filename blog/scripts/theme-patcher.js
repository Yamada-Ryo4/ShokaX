/**
 * 核心样式及逻辑持久化补丁 (Theme Patcher) - V20 自动播放版
 * - [V19] 解决切回图片时的"灰色闪烁"问题。
 * - [V20] 开启网页自动加载视频壁纸功能。
 */

// 1. 数据级修复
hexo.extend.filter.register('before_generate', function() {
    if (hexo.config.algolia) hexo.config.algolia = false;
    if (hexo.theme.config.reward && hexo.theme.config.reward.account) {
        delete hexo.theme.config.reward.account.alipay;
    }
}, 10);

// 2. CSS 样式注入
hexo.extend.filter.register('after_render:html', function(str, data) {
    const customCSS = `
    <style>
        /* [核心] 强制原生滚动 */
        html { overflow-y: scroll !important; scrollbar-gutter: stable !important; }
        body { overflow: visible !important; }

        /* [核心] 侧边栏 Sticky 方案解决抖动 */
        #sidebar { overflow: visible !important; }
        #sidebar > .inner { position: sticky !important; top: 2rem !important; z-index: 10 !important; }
        #sidebar.affix > .inner { position: sticky !important; top: 2rem !important; }

        /* [层级] 恢复原版层级嵌套 */
        #nav { position: fixed !important; top: 0 !important; z-index: 1000 !important; }
        #header { position: relative !important; z-index: auto !important; }
        #brand { position: relative !important; z-index: 1 !important; }
        #waves { position: relative !important; z-index: 2 !important; pointer-events: none !important; }
        main { position: relative !important; z-index: 5 !important; }
        
        #imgs { 
            position: fixed !important; top: 0 !important; left: 0 !important; 
            width: 100% !important; height: 100% !important; 
            z-index: -1 !important; 
        }
        
        #bgVideo {
            position: absolute !important; top: 0; left: 0; 
            width: 100%; height: 100%; object-fit: cover;
            z-index: -2 !important; 
            transition: opacity 0.4s ease-in-out;
        }

        #imgs img, #imgs ul { transition: opacity 0.4s ease-in-out !important; }
        .video-playing #imgs img, .video-playing #imgs ul { opacity: 0 !important; }

        #tool { position: fixed !important; z-index: 10000 !important; }
        #playBtn { cursor: pointer !important; }

        #qr > div { display: inline-block !important; margin: 2rem !important; vertical-align: top !important; background: transparent !important; }
        #qr > div > img {
            width: 12rem !important; height: 12rem !important;
            object-fit: contain !important; background-color: transparent !important;
            padding: 0 !important; border: none !important; box-shadow: none !important;
        }
        h2::before, h3::before, h4::before, h5::before, h6::before { display: none !important; }
    </style>`;

    const videoScript = `
    <script>
    (function() {
        var isPlaying = false;
        var videoElement = null;
        var videoUrl = 'https://pub-28a25d97afbd45fdba5366e39cf5f003.r2.dev/1_1080p_15mbps_amf.mp4';
        
        function handlePlay() {
            var imgs = document.getElementById('imgs');
            if (!imgs) return;
            var video = document.getElementById('bgVideo');
            if (!video) {
                video = document.createElement('video');
                video.id = 'bgVideo';
                video.src = videoUrl;
                video.loop = true;
                video.muted = true;
                video.setAttribute('playsinline', '');
                video.setAttribute('autoplay', '');
                imgs.appendChild(video);
                videoElement = video;
            }
            if (!isPlaying) {
                video.style.display = 'block';
                video.style.opacity = '1';
                video.play().then(() => { 
                    isPlaying = true; 
                    document.body.classList.add('video-playing');
                }).catch(err => console.error(err));
            } else {
                document.body.classList.remove('video-playing');
                setTimeout(function() {
                    if (!document.body.classList.contains('video-playing')) {
                        video.pause();
                        video.style.display = 'none';
                    }
                }, 400);
                isPlaying = false;
            }
        }

        // 自动播放逻辑：检测到容器即加载
        var autoPlayCheck = setInterval(function() {
            var imgs = document.getElementById('imgs');
            if (imgs) {
                clearInterval(autoPlayCheck);
                handlePlay();
            }
        }, 100);

        var checkInterval = setInterval(function() {
            var btn = document.getElementById('playBtn');
            if (btn && !btn.hasAttribute('data-patched')) {
                btn.setAttribute('data-patched', 'true');
                btn.onclick = function(e) {
                    e.preventDefault(); e.stopPropagation();
                    handlePlay();
                };
            }
        }, 1000);
    })();
    </script>
    `;

    return str.replace('</head>', customCSS + '</head>').replace('</body>', videoScript + '</body>');
});
