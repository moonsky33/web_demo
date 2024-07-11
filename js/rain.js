// 定义 CSS 样式
const cssStyles = `
    body {
        margin: 0;
        overflow: hidden;
    }
    .raindrop {
        position: absolute;
        top: 1px; /* 使雨滴从上方开始 */
        width: 2px;
        height: 20px;
        background: #00aaff;
        opacity: 0.5;
        transform: rotate(180deg); /* 旋转雨滴 */
        animation: fall linear infinite;
    }
    @keyframes fall {
        to {
            transform: translate(-30vw, 100vh) rotate(-20deg); /* 从右向左斜下 */
        }
    }
`;

// 创建 style 元素并添加 CSS 样式
const style = document.createElement('style');
style.textContent = cssStyles;
document.head.appendChild(style);

// 定义全局变量
let rainInterval;
let currentRaindrops = 0;
const maxRaindrops = 100; // 最大雨滴数量

// 等待DOM加载完成后执行
document.addEventListener("DOMContentLoaded", function() {
    const rainContainer = document.createElement('div');
    rainContainer.id = 'rain-container';
    document.body.appendChild(rainContainer);

    function createRaindrop() {
        if (currentRaindrops < maxRaindrops) {
            const raindrop = document.createElement('div');
            raindrop.classList.add('raindrop');

            // 随机设置雨滴的位置和动画时长
            raindrop.style.left = Math.random() * 100 + 'vw';
            raindrop.style.animationDuration = 0.5 + Math.random() * 0.5 + 's';

            rainContainer.appendChild(raindrop);
            currentRaindrops++;

            // 在动画结束后移除雨滴
            raindrop.addEventListener('animationend', function() {
                rainContainer.removeChild(raindrop);
                currentRaindrops--;
            });
        }
    }

    // 初始化定时器，启动下雨效果
    rainInterval = setInterval(createRaindrop, 100);

    // 将 toggleRain 暴露为全局变量
    window.toggleRain = function() {
        if (rainInterval) {
            clearInterval(rainInterval);
            rainInterval = null;
            // 停止所有正在运行的动画
            const raindrops = document.querySelectorAll('.raindrop');
            raindrops.forEach(raindrop => {
                // raindrop.style.animationPlayState = 'paused';//雨滴停止
                raindrop.remove();//雨滴全部移除
            });
        } else {
            const raindrops = document.querySelectorAll('.raindrop');
            raindrops.forEach(raindrop => {
                raindrop.style.animationPlayState = 'running';
            });
            rainInterval = setInterval(createRaindrop, 100);
        }
    };
});
