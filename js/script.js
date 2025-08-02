// 侧边栏和移动端侧边栏手势
// 动态生成侧边栏内容
function generateSidebar() {
    fetch('./data/content.json')
        .then(response => response.json())
        .then(data => {
            const sidebar = document.getElementById('sidebar');
            // 清空现有的侧边栏内容（除了关闭按钮）
            const closeBtn = sidebar.querySelector('.closebtn');
            sidebar.innerHTML = '';
            sidebar.appendChild(closeBtn);

            // 添加侧边栏数据
            data.content.forEach((section, index) => {
                if (section.sidebar && section.sidebar.show) {
                    const collapsible = document.createElement('div');
                    collapsible.className = 'collapsible';
                    collapsible.style.animation = `fadeIn 0.5s ease-out ${0.2 + index * 0.1}s forwards`;
                    collapsible.style.opacity = '0';

                    const header = document.createElement('a');
                    header.href = 'javascript:void(0)';
                    header.className = 'collapsible-header';
                    header.onclick = function() { toggleCollapsible(this); };
                    header.textContent = ' ' + section.title + ' ';

                    const arrow = document.createElement('span');
                    arrow.className = 'arrow';
                    header.appendChild(arrow);

                    const content = document.createElement('div');
                    content.className = 'collapsible-content';

                    section.items.forEach((item, itemIndex) => {
                        const link = document.createElement('a');
                        link.href = item.path;
                        link.className = 'sidebar-link';
                        link.style.animation = `fadeIn 0.3s ease-out ${0.3 + index * 0.1 + itemIndex * 0.05}s forwards`;
                        link.style.opacity = '0';

                        if (section.main.itemDisplay === 'dayTitle' && item.day && item.title) {
                            link.textContent = `Day${item.day} ${item.title}`;
                        } else {
                            link.textContent = item.name;
                        }
                        content.appendChild(link);
                    });

                    collapsible.appendChild(header);
                    collapsible.appendChild(content);
                    sidebar.appendChild(collapsible);
                }
            });
        })
        .catch(error => {
            console.error('加载侧边栏数据失败:', error);
        });
}

// 页面加载完成后生成侧边栏和加载内容数据
document.addEventListener('DOMContentLoaded', function() {
    generateSidebar();
    loadContentData();
});

// 加载内容数据
function loadContentData() {
    // 加载合并后的内容数据
    fetch("./data/content.json")
        .then((response) => response.json())
        .then((data) => {
            const container = document.getElementById("content-container");

            data.content.forEach((section) => {
                if (section.main && section.main.show) {
                    // 创建标题
                    const h1 = document.createElement("h1");
                    h1.textContent = section.title;
                    h1.className = "category-title"; // 添加分类标题样式
                    container.appendChild(h1);

                    // 创建列表容器
                    const ul = document.createElement("ul");

                    // 根据内容类型生成不同的列表项
                    section.items.forEach((item, index) => {
                        const li = document.createElement("li");
                        li.className = "floating";

                        const a = document.createElement("a");
                        a.href = item.path;
                        a.target = "_blank";

                        if (
                            section.main.itemDisplay === "dayTitle" &&
                            item.day &&
                            item.title
                        ) {
                            a.textContent = `Day${item.day} ${item.title}`;
                        } else {
                            a.textContent = item.name;
                        }

                        li.appendChild(a);
                        ul.appendChild(li);
                    });

                    container.appendChild(ul);
                }
            });
        })
        .catch((error) => {
            console.error("加载内容数据失败:", error);
            const container = document.getElementById("content-container");
            container.textContent = "加载内容失败";
        });
}

// 侧边栏和移动端侧边栏手势
let isSidebarOpen = false;

function toggleNav() {
    var sidebar = document.getElementById("sidebar");
    var main = document.getElementById("main");
    var toggleButton = document.querySelector('.togglebtn'); 
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
        toggleButton.style.visibility = "visible";
        document.removeEventListener('click', handleOutsideClick);
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
        toggleButton.style.visibility = "hidden";
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);
    }
}

function openNav() {
    var sidebar = document.getElementById("sidebar");
    var main = document.getElementById("main");
    sidebar.style.width = "250px";
    main.style.marginLeft = "250px";
    isSidebarOpen = true;
    document.addEventListener('click', handleOutsideClick);
}
function closeNav() {
    var sidebar = document.getElementById("sidebar");
    var main = document.getElementById("main");
    var toggleButton = document.querySelector('.togglebtn');
    sidebar.style.width = "0";
    main.style.marginLeft = "0";
    toggleButton.style.visibility = "visible";
    isSidebarOpen = false;
    document.removeEventListener('click', handleOutsideClick);
}

function handleOutsideClick(event) {
    var sidebar = document.getElementById("sidebar");
    if (!sidebar.contains(event.target) && sidebar.style.width === "250px") {
        closeNav();
    }
}

let touchStartX = 0;
let touchEndX = 0;

function checkSwipe() {
    if (touchEndX - touchStartX > 100 && !isSidebarOpen) {
        openNav();
    } else if (touchStartX - touchEndX > 100 && isSidebarOpen) {
        closeNav();
    }
}

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    checkSwipe();
});

function toggleCollapsible(element) {
    var content = element.nextElementSibling;
    var arrow = element.querySelector('.arrow');
    if (content.style.display === "block") {
        content.style.display = "none";
        arrow.classList.remove('down');
    } else {
        content.style.display = "block";
        arrow.classList.add('down');
    }
}
// 雨天控制
let isRaining = true; // 初始状态为下雨

document.addEventListener("DOMContentLoaded", function() {
    const weatherButton = document.getElementById('weatherButton');

    // 检查按钮是否存在
    if (weatherButton) {
        // 设置按钮初始状态为下雨
        weatherButton.textContent = '🌧';

        // 监听天气按钮点击事件
        weatherButton.addEventListener('click', function() {
        toggleRain();
        isRaining = !isRaining;
        
        if (isRaining) {
            weatherButton.textContent = '🌧';
            // 添加下雨动画效果
            weatherButton.classList.add('rainy');
            weatherButton.classList.remove('sunny');
        } else {
            weatherButton.textContent = '☀';
            // 添加晴天动画效果
            weatherButton.classList.add('sunny');
            weatherButton.classList.remove('rainy');
        }
    });
    }
});