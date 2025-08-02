// 定义全局变量
let rainInterval;
let currentRaindrops = 0;
const maxRaindrops = 80; // 减少最大雨滴数量以提高性能
const raindrops = []; // 存储雨滴元素的数组

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
            const leftPos = Math.random() * 100;
            raindrop.style.left = leftPos + 'vw';
            // 随机生成动画时长，范围1-2秒
            const duration = 1 + Math.random() * 1;
            raindrop.style.animationDuration = duration + 's';

            rainContainer.appendChild(raindrop);
            currentRaindrops++;
            raindrops.push(raindrop);

            // 设置超时移除雨滴，比动画时长稍长
            setTimeout(() => {
                if (rainContainer.contains(raindrop)) {
                    rainContainer.removeChild(raindrop);
                    currentRaindrops--;
                    // 从数组中移除
                    const index = raindrops.indexOf(raindrop);
                    if (index !== -1) {
                        raindrops.splice(index, 1);
                    }
                }
            }, (duration + 0.5) * 1000);

            // 同时监听动画结束事件作为备选
            raindrop.addEventListener('animationend', function() {
                if (rainContainer.contains(raindrop)) {
                    rainContainer.removeChild(raindrop);
                    currentRaindrops--;
                    // 从数组中移除
                    const index = raindrops.indexOf(raindrop);
                    if (index !== -1) {
                        raindrops.splice(index, 1);
                    }
                }
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
            // 移除所有雨滴
            while (raindrops.length > 0) {
                const raindrop = raindrops[0];
                if (rainContainer.contains(raindrop)) {
                    rainContainer.removeChild(raindrop);
                }
                raindrops.shift();
            }
            currentRaindrops = 0;
        } else {
            rainInterval = setInterval(createRaindrop, 150); // 增加间隔时间以降低性能消耗
        }
    };
});
