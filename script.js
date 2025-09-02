// 烟花颜色
        const colors = [
            '#ff3366', '#ff9933', '#ffcc00', '#66ccff', 
            '#9966ff', '#ff66cc', '#ff5050', '#33cc99',
            '#66ff66', '#66ccff', '#ffcc66', '#cc99ff',
            '#ff3399', '#33ccff', '#ff9966', '#66ffcc'
        ];
        
        // 获取Canvas元素和上下文
        const canvas = document.getElementById('fireworksCanvas');
        const ctx = canvas.getContext('2d');
        
        // 音频元素
        const backgroundMusic = document.getElementById('backgroundMusic');
        const fireworkSound = document.getElementById('fireworkSound');
        const audioControl = document.getElementById('audioControl');
        
        // 设置初始音量
        backgroundMusic.volume = 0.5;
        fireworkSound.volume = 0.3;
        
        // 设置音频控制按钮事件
        let isMuted = false;
        audioControl.addEventListener('click', function() {
            isMuted = !isMuted;
            backgroundMusic.muted = isMuted;
            fireworkSound.muted = isMuted;
            
            this.innerHTML = isMuted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        });
        
        // 设置Canvas大小为窗口大小
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // 初始化Canvas大小
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // 烟花计数器
        let fireworkCounter = 0;
        const fireworkCountEl = document.getElementById('fireworkCount');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const loadingStatus = document.getElementById('loadingStatus');
        const progressBar = document.getElementById('progressBar');
        const hintBox = document.getElementById('hintBox');
        const textNotification = document.getElementById('textNotification');
        const buttonContainer = document.getElementById('buttonContainer');
        const daysTogether = document.getElementById('daysTogether');
        
        // 资源状态元素
        const musicStatus = document.getElementById('musicStatus');
        const soundStatus = document.getElementById('soundStatus');
        const imageStatus = document.getElementById('imageStatus');
        const textStatus = document.getElementById('textStatus');
        
        // 更新资源状态显示
        function updateResourceStatus(element, status) {
            element.classList.remove('local', 'network', 'failed');
            switch(status) {
                case 'local': element.classList.add('local'); break;
                case 'network': element.classList.add('network'); break;
                case 'failed': element.classList.add('failed'); break;
            }
        }
        
        // 相识日期（2024年3月12日）
        const startDate = new Date(2024, 2, 12);
        
        // 计算相识天数
        function calculateDaysTogether() {
            const today = new Date();
            const timeDiff = today.getTime() - startDate.getTime();
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            daysTogether.textContent = `${days}`;
            return days;
        }
        
        // 加载暖心文字
        let warmTexts = [];
        async function loadWarmTexts() {
            // 尝试从本地存储加载自定义文本
            const customTexts = localStorage.getItem('customWarmTexts');
            if (customTexts) {
                warmTexts = JSON.parse(customTexts);
                updateResourceStatus(textStatus, 'local');
                return { success: true, message: '自定义暖心文字加载成功' };
            }
            
            try {
                const response = await fetch('text/warm_texts.txt');
                if (response.ok) {
                    const text = await response.text();
                    warmTexts = text.split('\n').filter(line => line.trim() !== '');
                    updateResourceStatus(textStatus, 'local');
                    return { success: true, message: '本地暖心文字加载成功' };
                }
            } catch (error) {
                console.log('本地文字加载失败，使用内置文字');
            }
            
            // 内置文字
            warmTexts = [
                "累了歇会儿，别硬撑呀，不然下一秒可能就变成'葛优躺'啦",
                "愿我们携手走过更多美好时光",
                "每一天都因你而更加精彩",
                "心怀希望，未来可期",
                "你是独一无二的存在",
                "生活因你而美好",
                "坚持梦想，终会发光",
                "微笑面对每一天",
                "你值得拥有最好的",
                "困难只是暂时的",
                "相信自己的力量",
                "阳光总在风雨后",
                "爱自己，是终身浪漫的开始",
                "保持热爱，奔赴山海",
                "你的努力终将开花结果",
                "世界因你而不同",
                "每一天都是生命的礼物",
                "坚持做对的事，时间会给你答案",
                "愿你被爱包围，幸福常在",
                "保持善良，保持努力",
                "最美的风景在路上",
                "未来的路，希望能一路同行",
                "皱眉头啦？笑一笑好看,不然皱纹都要被你挤出来开会啦",
                "走,看场电影放松下,不去当观众,难道要在家当'沙发土豆'吗？",
                "今天辛苦啦,喝口水吧,不然嘴巴都要干成'撒哈拉沙漠'啦",
                "别急别慌,我陪你弄,我可是你专属的'万能小助手'哦",
                "方案不急,思路清晰更重要,别让脑袋变成'浆糊搅拌机'啦",
                "肩膀绷太紧？揉揉会好些,来,让我给你来个'超级马杀鸡'",
                "星星还亮着,天塌不下来,就算塌下来也有我这个'人肉垫子'在呢",
                "放下手机,我们出去走走啦,不然眼睛都要变成'电子屏幕监控器'啦",
                "这事儿过了,请你吃大餐,咱们去把肚子撑成个'移动的小仓库'",
                "我可能不擅长说情话，但会用行动把'我喜欢你'写进每一天",
                "遇见你后，我的生活从黑白默片变成了4K全彩电影"
            ];
            
            updateResourceStatus(textStatus, 'network');
            return { success: true, message: '内置暖心文字加载成功' };
        }
        
        // 加载音频资源
        async function loadAudio() {
            let musicLoaded = false;
            let soundLoaded = false;
            
// 添加本地路径加载背景音乐
    try {
        backgroundMusic.src = 'musics/background.mp3'; // 修改为你的本地音乐路径
        await new Promise((resolve, reject) => {
            backgroundMusic.oncanplaythrough = resolve;
            backgroundMusic.onerror = () => reject(new Error('本地音乐加载失败'));
        });
        musicLoaded = true;
        updateResourceStatus(musicStatus, 'local');
        console.log('本地背景音乐加载成功');
    } catch (localError) {
        console.log('本地背景音乐加载失败', localError);
        // 继续尝试其他加载方式...
    }

    // 添加本地路径加载音效
    try {
        fireworkSound.src = 'musics/firework.mp3'; // 修改为你的本地音效路径
        await new Promise((resolve, reject) => {
            fireworkSound.oncanplaythrough = resolve;
            fireworkSound.onerror = () => reject(new Error('本地音效加载失败'));
        });
        soundLoaded = true;
        updateResourceStatus(soundStatus, 'local');
        console.log('本地音效加载成功');
    } catch (localError) {
        console.log('本地音效加载失败', localError);
        // 继续尝试其他加载方式...
    }
            /**
            
            // 尝试从本地存储加载背景音乐
            const customMusic = localStorage.getItem('music/background.mp3');
            if (customMusic) {
                backgroundMusic.src = customMusic;
                try {
                    await new Promise((resolve, reject) => {
                        backgroundMusic.oncanplaythrough = resolve;
                        backgroundMusic.onerror = () => reject(new Error('加载失败'));
                    });
                    musicLoaded = true;
                    updateResourceStatus(musicStatus, 'local');
                } catch (e) {
                    console.log('自定义背景音乐加载失败');
                }
            }
            
            // 尝试从本地存储加载音效
            const customSound = localStorage.getItem('customFireworkSound？');
            if (customSound) {
                fireworkSound.src = customSound;
                try {
                    await new Promise((resolve, reject) => {
                        fireworkSound.oncanplaythrough = resolve;
                        fireworkSound.onerror = () => reject(new Error('音效加载失败'));
                    });
                    soundLoaded = true;
                    updateResourceStatus(soundStatus, 'local');
                } catch (e) {
                    console.log('自定义音效加载失败');
                }
            }
            **/
            // 如果自定义资源加载失败，尝试网络资源
            if (!musicLoaded) {
                try {
                    backgroundMusic.src = 'https://music.163.com/song/media/outer/url?id=1413863166.mp3';
                    await new Promise((resolve, reject) => {
                        backgroundMusic.oncanplaythrough = resolve;
                        backgroundMusic.onerror = () => reject(new Error('音乐加载失败'));
                    });
                    musicLoaded = true;
                    updateResourceStatus(musicStatus, 'network');
                } catch (e) {
                    console.log('网络背景音乐加载失败');
                    updateResourceStatus(musicStatus, 'failed');
                }
            }
            
            if (!soundLoaded) {
                try {
                    fireworkSound.src = '';
                    await new Promise((resolve, reject) => {
                        fireworkSound.oncanplaythrough = resolve;
                        fireworkSound.onerror = () => reject(new Error('音效加载失败'));
                    });
                    soundLoaded = true;
                    updateResourceStatus(soundStatus, 'network');
                } catch (e) {
                    console.log('网络音效加载失败');
                    updateResourceStatus(soundStatus, 'failed');
                }
            }
            
            return { music: musicLoaded, sound: soundLoaded };
        }
        
        // 加载图片
        async function loadImages() {
            const tvImages = document.querySelectorAll('.tv-image');
            let loadedCount = 0;
            let usedCustom = false;
            let usedNetwork = false;
            
            // 尝试从本地存储加载自定义图片
	            for (let i = 0; i < 5; i++) {
                const customImage = localStorage.getItem(`customImage${i}`);
                if (customImage) {
                    tvImages[i].style.backgroundImage = `url('${customImage}')`;
                    loadedCount++;
                    usedCustom = true;
                }
            }
            
            if (loadedCount === 5) {
                updateResourceStatus(imageStatus, 'local');
                return { success: true, message: '自定义图片加载成功' };
            }
            
            // 图片资源
            const imageSources = [
                ['image/image1.jpg', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400'],
                ['image/image2.jpg', 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400'],
                ['image/image3.jpg', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400'],
                ['image/image4.jpg', 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400'],
                ['image/image5.jpg', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400']
            ];
            
            // 默认图片
            const defaultImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400";
            
            for (let i = 0; i < 5; i++) {
                // 如果这个位置已经有自定义图片，跳过
                if (localStorage.getItem(`customImage${i}`)) continue;
                
                let loaded = false;
                
                // 尝试加载本地图片
                try {
                    await loadImageWithTimeout(imageSources[i][0], 1500);
                    tvImages[i].style.backgroundImage = `url('${imageSources[i][0]}')`;
                    loaded = true;
                    loadedCount++;
                } catch (error) {
                    console.log(`本地图片 ${i+1} 加载失败`);
                }
                
                // 本地加载失败，尝试网络图片
                if (!loaded) {
                    try {
                        await loadImageWithTimeout(imageSources[i][1], 1500);
                        tvImages[i].style.backgroundImage = `url('${imageSources[i][1]}')`;
                        loaded = true;
                        loadedCount++;
                        usedNetwork = true;
                    } catch (error) {
                        console.log(`网络图片 ${i+1} 加载失败`);
                    }
                }
                
                // 如果都失败，使用默认图片
                if (!loaded) {
                    tvImages[i].style.backgroundImage = `url('${defaultImage}')`;
                }
            }
            
            // 更新图片状态
            if (usedCustom) {
                updateResourceStatus(imageStatus, 'local');
                return { success: true, message: '图片加载成功（自定义+默认）' };
            } else if (loadedCount === 4 && !usedNetwork) {
                updateResourceStatus(imageStatus, 'local');
                return { success: true, message: '图片加载成功（本地）' };
            } else if (loadedCount === 4 && usedNetwork) {
                updateResourceStatus(imageStatus, 'network');
                return { success: true, message: '图片加载成功（网络）' };
            } else {
                updateResourceStatus(imageStatus, 'failed');
                return { success: false, message: `${4 - loadedCount}张图片加载失败，使用默认图片` };
            }
        }
        
        // 带超时的图片加载
        function loadImageWithTimeout(src, timeout) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const timer = setTimeout(() => {
                    img.onload = null;
                    img.onerror = null;
                    reject(new Error('图片加载超时'));
                }, timeout);
                
                img.onload = () => {
                    clearTimeout(timer);
                    resolve();
                };
                
                img.onerror = () => {
                    clearTimeout(timer);
                    reject(new Error('图片加载失败'));
                };
                
                img.src = src;
            });
        }
        
        // 初始化资源加载
        async function initResources() {
            loadingIndicator.style.display = 'block';
            let statusMessages = [];
            let loadedCount = 0;
            const totalResources = 4;
            
            // 更新进度条
            function updateProgress() {
                loadedCount++;
                const percent = Math.min(100, Math.round((loadedCount / totalResources) * 100));
                progressBar.style.width = `${percent}%`;
            }
            
            try {
                // 并行加载资源
                const promises = [
                    loadWarmTexts().then(result => {
                        statusMessages.push(result.message);
                        updateProgress();
                    }),
                    loadAudio().then(result => {
                        statusMessages.push(result.music ? '音频加载成功' : '背景音乐加载失败');
                        statusMessages.push(result.sound ? '音效加载成功' : '音效加载失败');
                        updateProgress();
                        updateProgress(); // 音频包含两个资源
                    }),
                    loadImages().then(result => {
                        statusMessages.push(result.message);
                        updateProgress();
                    })
                ];
                
                // 设置5秒超时
                await Promise.race([
                    Promise.all(promises),
                    new Promise(resolve => setTimeout(resolve, 5000))
                ]);
                
                loadingStatus.textContent = statusMessages.join('\n');
                loadingStatus.style.color = '#66ff66';
            } catch (error) {
                console.error('资源加载错误:', error);
                loadingStatus.textContent = '资源加载完成，部分资源可能未加载成功';
                loadingStatus.style.color = '#ffcc00';
            } finally {
                // 延迟隐藏加载指示器
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                    
                    // 在用户交互后开始播放音乐
                    document.addEventListener('click', function startMusic() {
                        try {
                            backgroundMusic.play().catch(e => {
                                console.log('需要用户交互才能播放音频');
                                // 重试播放
                                setTimeout(() => backgroundMusic.play(), 1000);
                            });
                            document.removeEventListener('click', startMusic);
                        } catch (e) {
                            console.log('音频播放错误:', e);
                        }
                    }, { once: true });
                    
                    // 显示提示框，5秒后自动隐藏
                    setTimeout(() => {
                        hintBox.classList.add('hidden');
                    }, 5000);
                }, 1000);
            }
        }
        
        // 烟花类
        class Firework {
            constructor() {
                this.reset();
                this.id = Date.now() + Math.random().toString(36).substr(2, 9); // 唯一ID
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height;
                this.targetY = Math.random() * canvas.height * 0.4 + 50;
                this.currentX = this.x;
                this.currentY = this.y;
                this.speed = 2 + Math.random() * 3;
                this.size = Math.random() * 2 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                
               // 为整个烟花选择一个随机颜色
                this.explosionColor = colors[Math.floor(Math.random() * colors.length)];
                this.particles = [];
                this.state = 0;
            }
            
            update() {
                if (this.state === 0) {
                    this.currentY -= this.speed;
                    if (this.currentY <= this.targetY) {
                        this.explode();
                        fireworkCounter++;
                        fireworkCountEl.textContent = fireworkCounter;
                    }
                } else {
                    for (let i = 0; i < this.particles.length; i++) {
                        this.particles[i].update();
                        if (this.particles[i].alpha <= 0) {
                            this.particles.splice(i, 1);
                            i--;
                        }
                    }
                    if (this.particles.length === 0) {
                        this.reset();
                    }
                }
            }
            
            explode() {
                this.state = 1;
                try {
                    fireworkSound.currentTime = 0;
                    fireworkSound.play().catch(e => console.log('音效播放失败:', e));
                } catch (e) {
                    console.log('音效播放错误:', e);
                }
                
                const particleCount = Math.floor(Math.random() * 200) + 150;
                for (let i = 0; i < particleCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 6 + 2;
                    const vx = Math.cos(angle) * speed;
                    const vy = Math.sin(angle) * speed;
                    const size = Math.random() * 2 + 1;
                    
                    
                    const color = this.explosionColor;
                    //const color = colors[Math.floor(Math.random() * colors.length)];
                    
                    this.particles.push({
                        x: this.currentX,
                        y: this.currentY,
                        vx: vx,
                        vy: vy,
                        size: size,
                        color: color,
                        alpha: 1,
                        gravity: 0.05,
                        friction: 0.97,
                        update: function() {
                            this.x += this.vx;
                            this.y += this.vy;
                            this.vy += this.gravity;
                            this.vx *= this.friction;
                            this.vy *= this.friction;
                            this.alpha -= 0.008;
                        }
                    });
                }
            }
            
            draw() {
                if (this.state === 0) {
		// 绘制上升轨迹线（保持不变）
		        ctx.beginPath();
		        ctx.moveTo(this.x, canvas.height);
		        ctx.lineTo(this.currentX, this.currentY);
		        ctx.strokeStyle = this.color;
		        ctx.lineWidth = 1;
		        ctx.stroke();
		        
		        // 绘制皇冠图标代替圆形
		        ctx.font = `${this.size * 4}px Arial`; // 根据烟花大小调整字体
		        ctx.fillStyle = this.color;
		        ctx.textAlign = 'center';
		        ctx.textBaseline = 'middle';
		        ctx.fillText('👑', this.currentX, this.currentY);
                } else {
                    for (let i = 0; i < this.particles.length; i++) {
                        const p = this.particles[i];
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${parseInt(p.color.slice(1, 3), 16)}, ${parseInt(p.color.slice(3, 5), 16)}, ${parseInt(p.color.slice(5, 7), 16)}, ${p.alpha})`;
                        ctx.fill();
                    }
                }
            }
        }
        
        
        // 创建烟花数组
        const fireworks = [];
        const fireworkCount = 6;
        let fireworkInterval = 80;
        
        // 初始化烟花
        for (let i = 0; i < fireworkCount; i++) {
            fireworks.push(new Firework());
            setTimeout(() => {}, i * fireworkInterval);
        }
        
        // 飘屏文字管理
        class FloatingTextManager {
            constructor() {
                this.texts = [];
                this.container = document.getElementById('floatingTexts');
                this.lastTextTime = 0;
                // 文字频率等级 (0-5)
                this.textFrequencyLevel = 1;
                // 文字速度等级 (0-5)
                this.speedLevel = 3;
                // 记录上一个频率等级
                this.lastFrequencyLevel = 1;
            }
            
            // 根据频率等级获取间隔时间
            getFrequencyInterval() {
                // 频率等级对应的间隔时间（毫秒）
                const intervals = [
                    Number.MAX_SAFE_INTEGER, // 等级0：不显示
                    1000, // 等级1：每1秒一个
                    500, // 等级2：每0.5秒一个
                    250, // 等级3：每0.25秒一个
                    150,  // 等级4：每0.15秒一个
                    50   // 等级5：每0.05秒一个
                ];
                return intervals[this.textFrequencyLevel];
            }
            
            // 根据速度等级获取动画持续时间
            getSpeedDuration() {
                // 速度等级对应的动画持续时间（秒）
                const durations = [
                    9999, // 等级0：几乎不动
                    20,   // 等级1：20秒
                    10,   // 等级2：10秒
                    5,   // 等级3：5秒
                    2,   // 等级4：2秒
                    1    // 等级5：1秒
                ];
                return durations[this.speedLevel];
            }
            
            addText() {
                if (warmTexts.length === 0 || this.textFrequencyLevel === 0) return;
                
                const text = document.createElement('div');
                text.className = 'floating-text';
                const textIndex = Math.floor(Math.random() * warmTexts.length);
			                text.textContent = warmTexts[textIndex];
			// 只在下1/5屏幕显示（屏幕底部20%区域）
			    const minTop = canvas.height * 0.7;  // 屏幕75%位置开始
			    const maxTop = canvas.height - 50;   // 屏幕底部减去50px边距
			    const top = Math.random() * (maxTop - minTop) + minTop;
			    text.style.top = `${top}px`;
			    
			    const size = Math.floor(Math.random() * 4) + 14;
			    text.style.fontSize = `${size}px`;
			    text.style.color = colors[Math.floor(Math.random() * colors.length)];
			                // 根据速度等级设置动画持续时间
                const duration = this.getSpeedDuration();
                text.style.animationDuration = `${duration}s`;
                
                this.container.appendChild(text);
                
                setTimeout(() => {
                    if (text.parentNode) {
                        text.parentNode.removeChild(text);
                    }
                }, duration * 1000);
            }
            
            // 清除所有漂浮文字
            clearAllTexts() {
                while (this.container.firstChild) {
                    this.container.removeChild(this.container.firstChild);
                }
            }
            
            update() {
                const now = Date.now();
                const interval = this.getFrequencyInterval();
                
                // 当频率等级从0变为非0时，重置计时器
                if (this.lastFrequencyLevel === 0 && this.textFrequencyLevel > 0) {
                    this.lastTextTime = now;
                }
                
                if (now - this.lastTextTime > interval) {
                    this.addText();
                    this.lastTextTime = now;
                }
                
                this.lastFrequencyLevel = this.textFrequencyLevel;
            }
        }
        
        // 创建飘屏文字管理器
        const textManager = new FloatingTextManager();
        
        // 动画循环
        function animate() {
            ctx.fillStyle = 'rgba(10, 5, 30, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
			// 清除画布但不绘制半透明背景
			ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < fireworks.length; i++) {
                fireworks[i].update();
                fireworks[i].draw();
            }
            
            textManager.update();
            requestAnimationFrame(animate);
        }
        
        // 启动动画
        function startAnimation() {
            animate();
            setTimeout(() => {
                for (let i = 0; i < 1; i++) {
                    setTimeout(() => {
                        textManager.addText();
                    }, i * 10000);
                }
            }, 10000);
        }
        
        // 控制面板事件
        const fireworkFrequency = document.getElementById('fireworkFrequency');
        const textFrequency = document.getElementById('textFrequency');
        const textSpeed = document.getElementById('textSpeed');
        const musicVolume = document.getElementById('musicVolume');
        const soundVolume = document.getElementById('soundVolume');
        const panelButton = document.getElementById('panelButton');
        const tvButton = document.getElementById('tvButton');
        const controlPanel = document.getElementById('controlPanel');
        const tvBox = document.getElementById('tvBox');
        
        fireworkFrequency.addEventListener('input', function() {
            fireworkInterval = parseInt(this.value);
        });
        
        // 文字频率控制 (0-5级)
        textFrequency.addEventListener('input', function() {
            const newLevel = parseInt(this.value);
            
            // 当从0变为非0时，清除所有文字
            if (textManager.textFrequencyLevel === 0 && newLevel > 0) {
                textManager.clearAllTexts();
                
                // 显示通知
                textNotification.classList.remove('hidden');
                setTimeout(() => {
                    textNotification.classList.add('hidden');
                }, 2000);
            }
            
            textManager.textFrequencyLevel = newLevel;
        });
        
        // 文字速度控制 (0-5级)
        textSpeed.addEventListener('input', function() {
            const newLevel = parseInt(this.value);
            
            // 当速度改变时，清除所有文字
            if (textManager.speedLevel !== newLevel) {
                textManager.clearAllTexts();
                
                // 显示通知
                textNotification.classList.remove('hidden');
                setTimeout(() => {
                    textNotification.classList.add('hidden');
                }, 2000);
            }
            
            textManager.speedLevel = newLevel;
        });
        
        musicVolume.addEventListener('input', function() {
            backgroundMusic.volume = this.value / 100;
        });
        
        soundVolume.addEventListener('input', function() {
            fireworkSound.volume = this.value / 100;
        });
        
        let panelVisible = false;
        panelButton.addEventListener('click', function() {
            tvBox.classList.add('hidden');
            panelVisible = !panelVisible;
            controlPanel.classList.toggle('hidden', !panelVisible);
            this.innerHTML = panelVisible ? 
                '<i class="fas fa-times"></i> 关闭面板' : 
                '<i class="fas fa-sliders-h"></i> 控制面板';
        });
        
        let tvVisible = false;
        tvButton.addEventListener('click', function() {
            controlPanel.classList.add('hidden');
            panelVisible = false;
            panelButton.innerHTML = '<i class="fas fa-sliders-h"></i> 控制面板';
            tvVisible = !tvVisible;
            tvBox.classList.toggle('hidden', !tvVisible);
            this.innerHTML = tvVisible ? 
                '<i class="fas fa-times"></i> 关闭电视' : 
                '<i class="fas fa-tv"></i> 小电视';
        });
        
        // 小电视图片轮播
        function startImageCarousel() {
            const tvImages = document.querySelectorAll('.tv-image');
            let currentImageIndex = 0;
            
            function changeTvImage() {
                tvImages[currentImageIndex].classList.remove('active');
                currentImageIndex = (currentImageIndex + 1) % tvImages.length;
                tvImages[currentImageIndex].classList.add('active');
            }
            
            setInterval(changeTvImage, 4000);
        }
        
        // 更新时间
        function updateTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // 模拟天气数据
        function updateWeather() {
            const weatherTypes = ["晴", "多云", "小雨", "阴天", "阵雨"];
            const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const temp = Math.floor(Math.random() * 15) + 20;
            document.getElementById('weather').textContent = `${weather} ${temp}°C`;
        }
        
        
		function setupTripleClick() {
		    let clickCount = 0;
		    let lastClickTime = 0;
		    const tripleClickThreshold = 300; // 300ms内三次点击
		    
		    document.addEventListener('click', (e) => {
		        // 添加按钮容器到排除列表
		        if (e.target.closest('.control-panel, .tv-box, .top-controls, .button-container')) {
		            return;
		        }
		        
		        const now = Date.now();
		        
		        if (now - lastClickTime > tripleClickThreshold) {
		            clickCount = 1;
		        } else {
		            clickCount++;
		        }
		        
		        lastClickTime = now;
		        
		        if (clickCount === 3) {
		            // 在切换前检测状态
		            const wasHidden = buttonContainer.classList.contains('hidden');
		            
		            // 切换按钮容器显示状态
		            buttonContainer.classList.toggle('hidden');
		            
		            // 如果按钮从隐藏变为显示，5秒后自动隐藏
		            if (wasHidden) {
		                // 清除之前的定时器
		                if (buttonContainer.hideTimeout) {
		                    clearTimeout(buttonContainer.hideTimeout);
		                }
		                
		                buttonContainer.hideTimeout = setTimeout(() => {
		                    buttonContainer.classList.add('hidden');
		                }, 5000);
		            } else {
		                // 按钮被隐藏，清除自动隐藏定时器
		                if (buttonContainer.hideTimeout) {
		                    clearTimeout(buttonContainer.hideTimeout);
		                }
		            }
		            
		            // 重置点击计数
		            clickCount = 0;
		        }
		    });
		    
		    // 阻止按钮点击冒泡
		    buttonContainer.addEventListener('click', (e) => {
		        e.stopPropagation();
		    });
		}
				  // 文件上传处理
        function setupFileUploads() {
            const applyUploadsButton = document.getElementById('applyUploadsButton');
            const bgMusicInput = document.getElementById('backgroundMusicUpload');
            const soundInput = document.getElementById('fireworkSoundUpload');
            const imageInput = document.getElementById('imageUpload');
            const textInput = document.getElementById('textUpload');
            
            const musicStatusEl = document.getElementById('musicUploadStatus');
            const soundStatusEl = document.getElementById('soundUploadStatus');
            const imageStatusEl = document.getElementById('imageUploadStatus');
            const textStatusEl = document.getElementById('textUploadStatus');
            
            // 应用所有上传
            applyUploadsButton.addEventListener('click', function() {
                // 应用背景音乐
                if (bgMusicInput.files.length > 0) {
                    const file = bgMusicInput.files[0];
                    if (file.type.startsWith('audio/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const objectURL = URL.createObjectURL(file);
                            backgroundMusic.src = objectURL;
                            backgroundMusic.load();
                            
                            // 存储到localStorage
                            localStorage.setItem('customBackgroundMusic', objectURL);
                            
                            musicStatusEl.textContent = `已应用: ${file.name}`;
                            updateResourceStatus(musicStatus, 'local');
                            
                            // 尝试播放新音乐
                            backgroundMusic.play().catch(e => {
                                console.log('需要用户交互才能播放音频');
                            });
                        };
                        reader.readAsDataURL(file);
                    } else {
                        musicStatusEl.textContent = '请选择音频文件';
                    }
                }
                
                // 应用音效
                if (soundInput.files.length > 0) {
                    const file = soundInput.files[0];
                    if (file.type.startsWith('audio/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const objectURL = URL.createObjectURL(file);
                            fireworkSound.src = objectURL;
                            fireworkSound.load();
                            
                            // 存储到localStorage
                            localStorage.setItem('customFireworkSound', objectURL);
                            
                            soundStatusEl.textContent = `已应用: ${file.name}`;
                            updateResourceStatus(soundStatus, 'local');
                        };
                        reader.readAsDataURL(file);
                    } else {
                        soundStatusEl.textContent = '请选择音频文件';
                    }
                }
                
                // 应用图片
                if (imageInput.files.length > 0) {
                    const files = Array.from(imageInput.files);
                    const validImages = files.filter(file => file.type.startsWith('image/'));
                    const maxImages = Math.min(validImages.length, 4);
                    
                    for (let i = 0; i < maxImages; i++) {
                        const file = validImages[i];
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const dataURL = e.target.result;
                            // 存储到localStorage
                            localStorage.setItem(`customImage${i}`, dataURL);
                            
                            // 设置到电视图片
                            const tvImages = document.querySelectorAll('.tv-image');
                            tvImages[i].style.backgroundImage = `url('${dataURL}')`;
                        };
                        reader.readAsDataURL(file);
                    }
                    
                    imageStatusEl.textContent = `已应用 ${maxImages} 张图片`;
                    updateResourceStatus(imageStatus, 'local');
                }
                
                // 应用文字
                if (textInput.files.length > 0) {
                    const file = textInput.files[0];
                    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            warmTexts = e.target.result.split('\n').filter(line => line.trim() !== '');
                            
                            // 存储到localStorage
                            localStorage.setItem('customWarmTexts', JSON.stringify(warmTexts));
                            
                            textStatusEl.textContent = `已应用: ${file.name}`;
                            updateResourceStatus(textStatus, 'local');
                            
                            // 清除现有文字并重新开始
                            textManager.clearAllTexts();
                            textManager.lastTextTime = 0;
                        };
                        reader.readAsText(file);
                    } else {
                        textStatusEl.textContent = '请选择文本文件(.txt)';
                    }
                }
                
                // 显示成功通知
                textNotification.textContent = "资源已成功应用并保存";
                textNotification.classList.remove('hidden');
                setTimeout(() => {
                    textNotification.classList.add('hidden');
                }, 2000);
            });
        }
// 添加全局变量管理漩涡效果状态
let vortexActive = false;
let vortexAnimationId = null;
let vortexVars = null;

// 封装漩涡效果初始化函数
function initVortexEffect() {
    const canvas = document.getElementById('vortexCanvas');
    if (!canvas) return;
    
    // 创建效果所需变量
    vortexVars = {
        canvas: canvas,
        ctx: canvas.getContext('2d'),
        frameNo: 0,
        camX: 0,
        camY: 0,
        camZ: -14,
        pitch: 0,
        yaw: 0,
        cx: canvas.width/2,
        cy: canvas.height/2,
        bounding: 10,
        scale: 500,
        floor: 26.5,
        points: [],
        initParticles: 700,
        initV: .01,
        distributionRadius: 800,
        vortexHeight: 25
    };
    
    // 调整canvas大小
    function resizeVortexCanvas() {
        vortexVars.canvas.width = document.body.clientWidth;
        vortexVars.canvas.height = document.body.clientHeight;
        vortexVars.cx = vortexVars.canvas.width/2;
        vortexVars.cy = vortexVars.canvas.height/2;
    }
    resizeVortexCanvas();
    window.addEventListener('resize', resizeVortexCanvas);
    
    // 添加粒子效果所需函数 
    function project3D(x,y,z,vars) {
        var p,d;
	x-=vars.camX;
	y-=vars.camY-8;
	z-=vars.camZ;
	p=Math.atan2(x,z);
	d=Math.sqrt(x*x+z*z);
	x=Math.sin(p-vars.yaw)*d;
	z=Math.cos(p-vars.yaw)*d;
	p=Math.atan2(y,z);
	d=Math.sqrt(y*y+z*z);
	y=Math.sin(p-vars.pitch)*d;
	z=Math.cos(p-vars.pitch)*d;
	var rx1=-1000;
	var ry1=1;
	var rx2=1000;
	var ry2=1;
	var rx3=0;
	var ry3=0;
	var rx4=x;
	var ry4=z;
	var uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
	var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
	var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
	if(!z)z=0.000000001;
	if(ua>0&&ua<1&&ub>0&&ub<1){
		return {
			x:vars.cx+(rx1+ua*(rx2-rx1))*vars.scale,
			y:vars.cy+y/z*vars.scale,
			d:(x*x+y*y+z*z)
		};
	}else{
		return { d:-1 };
	}
    }
    
    function elevation(x,y,z) {
      var dist = Math.sqrt(x*x+y*y+z*z);
	if(dist && z/dist>=-1 && z/dist <=1) return Math.acos(z / dist);
	return 0.00000001;
    }
    
    function rgb(col) {
        	col += 0.000001;
	var r = parseInt((0.5+Math.sin(col)*0.5)*16);
	var g = parseInt((0.5+Math.cos(col)*0.5)*16);
	var b = parseInt((0.5-Math.sin(col)*0.5)*16);
	return "#"+r.toString(16)+g.toString(16)+b.toString(16);
    }
    
function interpolateColors(RGB1,RGB2,degree){
	
	var w2=degree;
	var w1=1-w2;
	return [w1*RGB1[0]+w2*RGB2[0],w1*RGB1[1]+w2*RGB2[1],w1*RGB1[2]+w2*RGB2[2]];
}
 
 
function rgbArray(col){
 
	col += 0.000001;
	var r = parseInt((0.5+Math.sin(col)*0.5)*256);
	var g = parseInt((0.5+Math.cos(col)*0.5)*256);
	var b = parseInt((0.5-Math.sin(col)*0.5)*256);
	return [r, g, b];
}
 
 
function colorString(arr){
 
	var r = parseInt(arr[0]);
	var g = parseInt(arr[1]);
	var b = parseInt(arr[2]);
	return "#"+("0" + r.toString(16) ).slice (-2)+("0" + g.toString(16) ).slice (-2)+("0" + b.toString(16) ).slice (-2);
}
 
 
function process(vars){
 
 
	if(vars.points.length<vars.initParticles) for(var i=0;i<5;++i) spawnParticle(vars);
	var p,d,t;
	
	p = Math.atan2(vars.camX, vars.camZ);
	d = Math.sqrt(vars.camX * vars.camX + vars.camZ * vars.camZ);
	d -= Math.sin(vars.frameNo / 80) / 25;
	t = Math.cos(vars.frameNo / 300) / 165;
	vars.camX = Math.sin(p + t) * d;
	vars.camZ = Math.cos(p + t) * d;
	vars.camY = -Math.sin(vars.frameNo / 220) * 15;
	vars.yaw = Math.PI + p + t;
	vars.pitch = elevation(vars.camX, vars.camZ, vars.camY) - Math.PI / 2;
	
	var t;
	for(var i=0;i<vars.points.length;++i){
		
		x=vars.points[i].x;
		y=vars.points[i].y;
		z=vars.points[i].z;
		d=Math.sqrt(x*x+z*z)/1.0075;
		t=.1/(1+d*d/5);
		p=Math.atan2(x,z)+t;
		vars.points[i].x=Math.sin(p)*d;
		vars.points[i].z=Math.cos(p)*d;
		vars.points[i].y+=vars.points[i].vy*t*((Math.sqrt(vars.distributionRadius)-d)*2);
		if(vars.points[i].y>vars.vortexHeight/2 || d<.25){
			vars.points.splice(i,1);
			spawnParticle(vars);
		}
	}
}
 
function drawFloor(vars){
	
	var x,y,z,d,point,a;
	for (var i = -25; i <= 25; i += 1) {
		for (var j = -25; j <= 25; j += 1) {
			x = i*2;
			z = j*2;
			y = vars.floor;
			d = Math.sqrt(x * x + z * z);
			point = project3D(x, y-d*d/85, z, vars);
			if (point.d != -1) {
				size = 1 + 15000 / (1 + point.d);
				a = 0.15 - Math.pow(d / 50, 4) * 0.15;
				if (a > 0) {
					vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(d/26-vars.frameNo/40),[0,128,32],.5+Math.sin(d/6-vars.frameNo/8)/2));
					vars.ctx.globalAlpha = a;
					vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
				}
			}
		}
	}		
	vars.ctx.fillStyle = "#82f";
	for (var i = -25; i <= 25; i += 1) {
		for (var j = -25; j <= 25; j += 1) {
			x = i*2;
			z = j*2;
			y = -vars.floor;
			d = Math.sqrt(x * x + z * z);
			point = project3D(x, y+d*d/85, z, vars);
			if (point.d != -1) {
				size = 1 + 15000 / (1 + point.d);
				a = 0.15 - Math.pow(d / 50, 4) * 0.15;
				if (a > 0) {
					vars.ctx.fillStyle = colorString(interpolateColors(rgbArray(-d/26-vars.frameNo/40),[32,0,128],.5+Math.sin(-d/6-vars.frameNo/8)/2));
					vars.ctx.globalAlpha = a;
					vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
				}
			}
		}
	}		
}
 
function sortFunction(a,b){
	return b.dist-a.dist;
}
 
function draw(vars){
 
	vars.ctx.globalAlpha=.15;
	vars.ctx.fillStyle="#000";
	vars.ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	drawFloor(vars);
	
	var point,x,y,z,a;
	for(var i=0;i<vars.points.length;++i){
		x=vars.points[i].x;
		y=vars.points[i].y;
		z=vars.points[i].z;
		point=project3D(x,y,z,vars);
		if(point.d != -1){
			vars.points[i].dist=point.d;
			size=1+vars.points[i].radius/(1+point.d);
			d=Math.abs(vars.points[i].y);
			a = .8 - Math.pow(d / (vars.vortexHeight/2), 1000) * .8;
			vars.ctx.globalAlpha=a>=0&&a<=1?a:0;
			vars.ctx.fillStyle=rgb(vars.points[i].color);
			if(point.x>-1&&point.x<vars.canvas.width&&point.y>-1&&point.y<vars.canvas.height)vars.ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
		}
	}
	vars.points.sort(sortFunction);
}
 
 
function spawnParticle(vars){
 
	var p,ls;
	pt={};
	p=Math.PI*2*Math.random();
	ls=Math.sqrt(Math.random()*vars.distributionRadius);
	pt.x=Math.sin(p)*ls;
	pt.y=-vars.vortexHeight/2;
	pt.vy=vars.initV/20+Math.random()*vars.initV;
	pt.z=Math.cos(p)*ls;
	pt.radius=200+800*Math.random();
	pt.color=pt.radius/1000+vars.frameNo/250;
	vars.points.push(pt);	
}
 
    // 启动动画循环
    function vortexFrame() {
        process(vortexVars);
        draw(vortexVars);
        vortexAnimationId = requestAnimationFrame(vortexFrame);
    }
    vortexAnimationId = requestAnimationFrame(vortexFrame);
}

// 销毁漩涡效果
function destroyVortexEffect() {
    if (vortexAnimationId) {
        cancelAnimationFrame(vortexAnimationId);
        vortexAnimationId = null;
    }
    
    const canvas = document.getElementById('vortexCanvas');
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    vortexVars = null;
    vortexActive = false;
}


// 风暴漩涡按钮事件
document.getElementById('beijingButton').addEventListener('click', function() {
    const canvas = document.getElementById('vortexCanvas');
    
    if (vortexActive) {
        // 关闭效果
        destroyVortexEffect();
        this.innerHTML = '<i class="fas fa-landmark"></i> 风暴漩涡';
        showNotification('漩涡效果已关闭');
    } else {
        // 显示效果
        canvas.style.display = 'block';
        
        if (!vortexVars) {
            initVortexEffect();
        }
        
        vortexActive = true;
        this.innerHTML = '<i class="fas fa-landmark"></i> 关闭漩涡';
        showNotification('风暴漩涡效果已开启');
    }
});
       
// 图片查看器功能
function showPictureViewer() {
    // 创建图片查看器模态框
    const modal = document.createElement('div');
    modal.id = 'pictureModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
    `;
    
    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 1001;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    // 创建标题
    const title = document.createElement('h2');
    title.textContent = '美好回忆相册';
    title.style.cssText = `
        color: white;
        margin-bottom: 30px;
        font-size: 28px;
        text-shadow: 0 0 10px rgba(255, 105, 180, 0.8);
        text-align: center;
    `;
    
    // 创建图片容器
    const gallery = document.createElement('div');
    gallery.id = 'pictureGallery';
    gallery.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
        max-width: 1200px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    // 创建加载指示器
    const loader = document.createElement('div');
    loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载图片中...';
    loader.style.cssText = `
        color: white;
        font-size: 18px;
        text-align: center;
        margin: 40px 0;
    `;
    
    gallery.appendChild(loader);
    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(gallery);
    document.body.appendChild(modal);
    
    // 加载图片
    loadPictures();
    
    // 添加ESC键关闭功能
    modal.onkeydown = (e) => {
        if (e.key === 'Escape') document.body.removeChild(modal);
    };
    modal.focus();
    modal.setAttribute('tabindex', '0');
}

// 加载图片函数
async function loadPictures() {
    const gallery = document.getElementById('pictureGallery');
    
    try {
        // 尝试从 /pictures 路径加载图片
        const response = await fetch('/pictures');
        if (!response.ok) throw new Error('无法访问图片目录');
        
        // 这里需要根据实际服务器响应处理图片列表
        // 假设返回的是图片文件名数组
        const pictureFiles = ['image1.jpg', 'image2.jpg', 'image3.jpg']; // 示例文件名
        
        gallery.innerHTML = ''; // 清除加载指示器
        
        if (pictureFiles.length === 0) {
            gallery.innerHTML = `
                <div style="color: white; text-align: center; grid-column: 1 / -1;">
                    <i class="fas fa-folder-open" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <p>相册空空如也</p>
                    <p>快去添加一些美好回忆吧！</p>
                </div>
            `;
            return;
        }
        
        pictureFiles.forEach(filename => {
            const imgCard = document.createElement('div');
            imgCard.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                overflow: hidden;
                transition: transform 0.3s ease;
                cursor: pointer;
            `;
            imgCard.onmouseover = () => imgCard.style.transform = 'scale(1.05)';
            imgCard.onmouseout = () => imgCard.style.transform = 'scale(1)';
            
            const img = document.createElement('img');
            img.src = `/pictures/${filename}`;
            img.style.cssText = `
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
            `;
            img.onerror = () => {
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiIGZvbnQtc2l6ZT0iMTQiPumcgOimgeaxguWBmuWIsOS4gOS4quWbvueJhzwvdGV4dD48L3N2Zz4=';
            };
            
            const fileName = document.createElement('div');
            fileName.textContent = filename;
            fileName.style.cssText = `
                padding: 10px;
                color: white;
                text-align: center;
                font-size: 12px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
            
            imgCard.appendChild(img);
            imgCard.appendChild(fileName);
            gallery.appendChild(imgCard);
        });
        
    } catch (error) {
        gallery.innerHTML = `
            <div style="color: #ff6b6b; text-align: center; grid-column: 1 / -1;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                <p>无法加载图片</p>
                <p>${error.message}</p>
                <p style="font-size: 12px; margin-top: 10px;">请确保图片存放在 /pictures 目录下</p>
            </div>
        `;
    }
}
        
        
        
        
        
        // 初始化应用
        function init() {
            calculateDaysTogether();
            setInterval(updateTime, 1000);
            setInterval(updateWeather, 30000);
            setInterval(calculateDaysTogether, 60000);
            
            initResources().then(() => {
                startAnimation();
                startImageCarousel();
                updateWeather();
                setupTripleClick();
                setupFileUploads();
            });
            
				// 获取新按钮元素
						// 获取新按钮元素
			const xinjiangButton = document.getElementById('xinjiangButton');
			const chongqingButton = document.getElementById('chongqingButton');
			const shanghaiButton = document.getElementById('shanghaiButton');
			const foodButton = document.getElementById('foodButton');
			const tianjinButton = document.getElementById('tianjinButton'); // 添加天津按钮引用
			if (tianjinButton) {
			    tianjinButton.addEventListener('click', function() {
			        showPictureViewer();
			        showNotification('正在加载美好回忆...');
			    });
			}			
				
				
				
				// 获取所有省份按钮并添加点击事件
			    const provinces = [
			        'beijing', 'tianjin', 'hebei', 'shanxi', 'neimenggu', 
			        'liaoning', 'jilin', 'heilongjiang', 'shanghai', 'jiangsu',
			        'zhejiang', 'anhui', 'fujian', 'jiangxi', 'shandong',
			        'henan', 'hubei', 'hunan', 'guangdong', 'guangxi',
			        'hainan', 'chongqing', 'sichuan', 'guizhou', 'yunnan',
			        'xizang', 'shaanxi', 'gansu', 'qinghai', 'ningxia',
			        'xinjiang', 'taiwan', 'xianggang', 'aomen'
			    ];
			    
			    provinces.forEach(province => {
			        const button = document.getElementById(`${province}Button`);
			        if (button) {
			            button.addEventListener('click', function() {
			                // 获取省份中文名（从按钮文本中提取）
			                const provinceName = this.textContent.trim();
			                //showNotification(`小燕子：欢迎来到${provinceName}！`);
			                
			                // 触发烟花效果
			                triggerSpecialFireworks(provinceName);
			            });
			        }
			    });
				
				// 新增函数：显示通知
				function showNotification(message) {
				    textNotification.textContent = message;
				    textNotification.classList.remove('hidden');
				    setTimeout(() => {
				        textNotification.classList.add('hidden');
				    }, 2000);
				}
				
			// 创建漩涡canvas（初始隐藏）
    const vortexCanvas = document.createElement('canvas');
    vortexCanvas.id = 'vortexCanvas';
    vortexCanvas.style.position = 'absolute';
    vortexCanvas.style.top = '0';
    vortexCanvas.style.left = '0';
    vortexCanvas.style.width = '100%';
    vortexCanvas.style.height = '100%';
    vortexCanvas.style.zIndex = '0';
    vortexCanvas.style.display = 'none';
    document.querySelector('.container').appendChild(vortexCanvas);
    
				
				
				
            
		// 新增函数：触发特殊烟花效果
			function triggerSpecialFireworks(province) {
			    // 这里可以添加特定省份的特殊效果
			    for(let i = 0; i < 1; i++) {
			        setTimeout(() => {
			           // const firework = new Firework();
			            //firework.targetY = Math.random() * canvas.height * 0.3 + 50;
			            //fireworks.push(firework);
					
			            
			            
			        }, i * 20000);
			        
			    } 
			}       
        }
 
        
        
        window.addEventListener('orientationchange', resizeCanvas);
        init();
