// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
  // 初始化地图
  initMap()

  // 初始化导航栏
  initNavbar()

  // 初始化滚动动画
  initScrollAnimations()

  // 初始化统计数字动画
  initStatsAnimation()
})

// 全局变量保存地图和标记点
let globalMap = null
let whuMarker = null
let userMarker = null
let userLine = null

// 初始化地图
function initMap() {
  // 检查地图容器是否存在
  const mapContainer = document.getElementById('map')
  if (!mapContainer) return

  try {
    // 创建百度地图实例
    const map = new BMap.Map('map')
    globalMap = map // 保存全局

    // 设置地图中心点和缩放级别（武汉大学资环院坐标）
    const point = new BMap.Point(114.364952, 30.536139)
    map.centerAndZoom(point, 16)

    // 设置地图样式
    map.setMapStyle({
      style: 'midnight', // 使用夜间样式，更适合作为背景
    })

    // 禁用地图控件
    map.disableScrollWheelZoom()
    map.disableDoubleClickZoom()
    map.disableKeyboard()

    // 添加武汉大学标记
    whuMarker = new BMap.Marker(point)
    map.addOverlay(whuMarker)
    // 跳动动画
    whuMarker.setAnimation && whuMarker.setAnimation(BMAP_ANIMATION_BOUNCE)
    // 波浪动画Label
    const waveLabel = new BMap.Label('<div class="whu-wave"></div>', {
      position: point,
      offset: new BMap.Size(-20, -20),
    })
    waveLabel.setStyle({
      border: 'none',
      background: 'none',
      padding: '0',
      zIndex: 1,
    })
    map.addOverlay(waveLabel)

    // 创建信息窗口
    const infoWindow = new BMap.InfoWindow(
      '<div style="padding: 10px;"><b>武汉大学</b><br>资源与环境科学学院</div>',
      {
        width: 200,
        height: 80,
        title: 'GIS专业研究生',
      }
    )

    // 点击标记显示信息窗口
    whuMarker.addEventListener('click', function () {
      map.openInfoWindow(infoWindow, point)
    })

    // 添加一些装饰性的GIS元素
    addGISDecorations(map)
  } catch (error) {
    console.log('百度地图初始化失败:', error)
    // 如果地图加载失败，显示一个占位符
    mapContainer.innerHTML =
      '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 1.2rem;"><i class="fas fa-map-marked-alt" style="margin-right: 10px;"></i>百度地图加载中...</div>'
  }
}

// 添加GIS装饰元素
function addGISDecorations(map) {
  // 添加一些装饰性的圆形区域
  const centerPoint = new BMap.Point(114.364952, 30.536139)

  // 创建圆形覆盖物
  const circle1 = new BMap.Circle(centerPoint, 500, {
    fillColor: 'rgba(255, 215, 0, 0.1)',
    strokeColor: 'rgba(255, 215, 0, 0.3)',
    strokeWeight: 2,
    fillOpacity: 0.3,
  })

  const circle2 = new BMap.Circle(centerPoint, 1000, {
    fillColor: 'rgba(44, 90, 160, 0.05)',
    strokeColor: 'rgba(44, 90, 160, 0.2)',
    strokeWeight: 1,
    fillOpacity: 0.2,
  })

  map.addOverlay(circle1)
  map.addOverlay(circle2)
}

// 初始化导航栏
function initNavbar() {
  const hamburger = document.querySelector('.hamburger')
  const navMenu = document.querySelector('.nav-menu')

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active')
      navMenu.classList.toggle('active')
    })

    // 点击导航链接时关闭移动菜单
    document.querySelectorAll('.nav-menu a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active')
        navMenu.classList.remove('active')
      })
    })
  }

  // 滚动时改变导航栏样式
  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar')
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)'
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)'
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)'
      navbar.style.boxShadow = 'none'
    }
  })

  // 平滑滚动到锚点
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    })
  })
}

// 初始化滚动动画
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up')
      }
    })
  }, observerOptions)

  // 观察需要动画的元素
  const animatedElements = document.querySelectorAll(
    '.research-card, .project-card, .contact-item, .about-text, .about-visual'
  )
  animatedElements.forEach((el) => {
    observer.observe(el)
  })
}

// 初始化统计数字动画
function initStatsAnimation() {
  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumbers()
          statsObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 }
  )

  const statsSection = document.querySelector('.hero-stats')
  if (statsSection) {
    statsObserver.observe(statsSection)
  }
}

// 数字动画函数
function animateNumbers() {
  const statNumbers = document.querySelectorAll('.stat-number')

  statNumbers.forEach((stat) => {
    const target = parseInt(stat.textContent)
    const duration = 2000 // 2秒
    const increment = target / (duration / 16) // 60fps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      stat.textContent = Math.floor(current) + '+'
    }, 16)
  })
}

// 显示通知
function showNotification(message, type = 'info') {
  // 创建通知元素
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // 添加样式
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `

  // 根据类型设置背景色
  if (type === 'success') {
    notification.style.background = '#4CAF50'
  } else if (type === 'error') {
    notification.style.background = '#f44336'
  } else {
    notification.style.background = '#2196F3'
  }

  // 添加到页面
  document.body.appendChild(notification)

  // 显示动画
  setTimeout(() => {
    notification.style.transform = 'translateX(0)'
  }, 100)

  // 自动隐藏
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)'
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// 添加一些GIS主题的交互效果
function addGISInteractions() {
  // 为GIS元素添加点击效果
  const gisElements = document.querySelectorAll('.element')
  gisElements.forEach((element) => {
    element.addEventListener('click', function () {
      // 添加点击动画
      this.style.transform = 'scale(0.9)'
      setTimeout(() => {
        this.style.transform = 'scale(1.1)'
      }, 150)

      // 显示工具提示
      const tooltip = this.getAttribute('data-tooltip')
      if (tooltip) {
        showNotification(tooltip, 'info')
      }
    })
  })

  // 为项目卡片添加悬停效果
  const projectCards = document.querySelectorAll('.project-card')
  projectCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)'
    })

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)'
    })
  })
}

// 页面加载完成后初始化GIS交互
document.addEventListener('DOMContentLoaded', function () {
  addGISInteractions()
})

// ====== 计算距离功能 ======
function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  const R = 6371000 // 地球半径，单位米
  const toRad = (x) => (x * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calc-distance-btn')
  if (!btn) return
  btn.addEventListener('click', function () {
    const resultDiv = document.getElementById('distance-result')
    resultDiv.textContent = '正在获取您的位置...'
    if (!navigator.geolocation) {
      resultDiv.textContent = '您的浏览器不支持地理定位。'
      return
    }
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const userLat = pos.coords.latitude
        const userLng = pos.coords.longitude
        // 武汉大学资环院坐标
        const markerLat = 30.536139
        const markerLng = 114.364952
        const distance = getDistanceFromLatLon(
          userLat,
          userLng,
          markerLat,
          markerLng
        )
        let show
        if (distance >= 1000) {
          show = (distance / 1000).toFixed(2) + ' 千米'
        } else {
          show = Math.round(distance) + ' 米'
        }
        resultDiv.textContent = '您与标记点的距离约为：' + show

        // ====== 新增：在地图上添加用户标记，并显示两个点 ======
        if (globalMap) {
          // 移除旧的用户标记
          if (userMarker) {
            globalMap.removeOverlay(userMarker)
          }
          // 移除旧的连线
          if (userLine) {
            globalMap.removeOverlay(userLine)
          }
          const userPoint = new BMap.Point(userLng, userLat)
          userMarker = new BMap.Marker(userPoint)
          globalMap.addOverlay(userMarker)
          // 画线
          const whuPoint = new BMap.Point(markerLng, markerLat)
          userLine = new BMap.Polyline([userPoint, whuPoint], {
            strokeColor: 'green',
            strokeWeight: 4,
            strokeOpacity: 0.8,
          })
          globalMap.addOverlay(userLine)
          // 设置视野包含两个点
          const viewBounds = new BMap.Bounds(
            new BMap.Point(
              Math.min(userLng, markerLng),
              Math.min(userLat, markerLat)
            ),
            new BMap.Point(
              Math.max(userLng, markerLng),
              Math.max(userLat, markerLat)
            )
          )
          globalMap.setViewport([userPoint, whuPoint], { zoomFactor: -1 })
        }
        // ====== END ======
      },
      function (err) {
        resultDiv.textContent =
          '无法获取您的位置：' + (err.message || '未知错误')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
})

// 添加键盘快捷键
document.addEventListener('keydown', function (e) {
  // Ctrl/Cmd + K 打开搜索（可以扩展为搜索功能）
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    showNotification('搜索功能开发中...', 'info')
  }

  // ESC 键关闭移动菜单
  if (e.key === 'Escape') {
    const navMenu = document.querySelector('.nav-menu')
    const hamburger = document.querySelector('.hamburger')
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active')
      hamburger.classList.remove('active')
    }
  }
})

// 添加页面加载动画
window.addEventListener('load', function () {
  document.body.style.opacity = '0'
  document.body.style.transition = 'opacity 0.5s ease'

  setTimeout(() => {
    document.body.style.opacity = '1'
  }, 100)
})

// 添加鼠标跟随效果（可选）
function addMouseFollowEffect() {
  const cursor = document.createElement('div')
  cursor.className = 'custom-cursor'
  cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(44, 90, 160, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `
  document.body.appendChild(cursor)

  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX - 10 + 'px'
    cursor.style.top = e.clientY - 10 + 'px'
    cursor.style.display = 'block'
  })

  document.addEventListener('mouseleave', function () {
    cursor.style.display = 'none'
  })
}

// 如果用户喜欢鼠标跟随效果，可以取消注释下面的行
// addMouseFollowEffect();
