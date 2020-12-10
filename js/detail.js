// jQuery 的入口函数
$(function () {

  // 0. 提前准备一个变量拿出来商品信息
  let info = null

  // 1. 拿到 cookie 中的 goods_id 属性
  const id = getCookie('goods_id')

  // 2. 根据 id 信息去请求商品数据
  getGoodsInfo()
  async function getGoodsInfo() {
    const goodsInfo = await $.get('./server/getGoodsInfo.php', { goods_id: id }, null, 'json')

    // 3. 进行页面的渲染
    bindHtml(goodsInfo.info)

    // 给提前准备好的变量进行赋值
    info = goodsInfo.info
  }

  function bindHtml(info) {
    // console.log(info)
    // console.log(info.goods_big_logo)
    // 1. 渲染左边放大镜位置
    $('.enlargeBox').html(`
    <div class="show">
      <img src="${info.goods_big_logo}">
      // <div class="mask" background-color: rgba(0,0,0,.5);
      // position: absolute;
      // left: 100px;
      // top:100px;></div>
      // </div>
     <div class="list">
     <p class="active">
        <img src="${info.goods_small_logo}" show="${info.goods_small_logo}" enlarge="${info.goods_big_logo}">
     </p>
    
   </div>
   <div class="enlarge" style="background-image: url(${info.goods_big_logo});"></div>
    
        
      `)
    new Enlarge('#box1')
      

    // 2. 商品详细信息渲染
    $('.goodsInfo').html(`
        <p class="desc">${info.goods_name}</p>
        <div class="btn-group size">
          <button type="button" class="btn btn-default">S</button>
          <button type="button" class="btn btn-default">M</button>
          <button type="button" class="btn btn-default">L</button>
          <button type="button" class="btn btn-default">XL</button>
        </div>
        <p class="price">
          ￥ <span class="text-danger">${info.goods_price}</span>
        </p>
        <div class="num">
          <button class="subNum">-</button>
          <input type="text" value="1" class="cartNum">
          <button class="addNum">+</button>
        </div>
        <div>
          <button class="btn btn-success addCart">加入购物车</button>
          <button class="btn btn-warning continue"><a href="./list.html">继续去购物</a></button>
        </div>
      `)

    // 3. 商品参数渲染
    $('.goodsDesc').html(info.goods_introduce)
  }

  // 4. 加入购物车的操作
  $('.goodsInfo').on('click', '.addCart', function () {
    const cart = JSON.parse(window.localStorage.getItem('cart')) || []
    const flag = cart.some(item => item.goods_id === id)
    // 如果没有, 那么我就 push 进去
    if (flag) {
      const cart_goods = cart.filter(item => item.goods_id === id)[0]
      cart_goods.cart_number = cart_goods.cart_number - 0 + ($('.cartNum').val() - 0)
    } else {
      info.cart_number = 1
      // 表示没有
      cart.push(info)
    }

    // 4-5. 添加完毕还要存储到 localStorage 里面
    window.localStorage.setItem('cart', JSON.stringify(cart))
  })

  // 5. ++ -- 的事件
  $('.goodsInfo')
    .on('click', '.subNum', function () {
    let num = $('.cartNum').val() - 0
    if (num === 1) return
    $('.cartNum').val(num - 1)
    })
    .on('click', '.addNum', function () {
    let num = $('.cartNum').val() - 0
    $('.cartNum').val(num + 1)
    })
})

// 放大镜逻辑
1.// 书写一个构造函数
// const p1=new Enlarge('#box1')
// console.log(p1)
function Enlarge(ele) {
  this.ele = document.querySelector(ele)
  // console.log(ele)
  // 获取元素
  this.show = this.ele.querySelector('.show')
  this.mask = this.ele.querySelector('.mask')
  this.list = this.ele.querySelector('.list')
  this.enlarge = this.ele.querySelector('.enlarge');//console.log(this.enlarge)
  // console.log(enlarge)
  this.show_width = this.show.clientWidth
  this.show_height = this.show.clientHeight
  this.enlarge_width = parseInt(window.getComputedStyle(this.enlarge).width)
  this.enlarge_height = parseInt(window.getComputedStyle(this.enlarge).height)
  this.bg_width = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[0])
  this.bg_height = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[1])
  this.init()
  //console.log(this.enlarge_height)
}
2.// 方法
Enlarge.prototype.init = function () {
  this.setScale()
  this.overOut()
  this.move()
  this.change()
}
3.//  调整比例
Enlarge.prototype.setScale = function () {
  this.mask_width = this.show_width * this.enlarge_width / this.bg_width
  this.mask_height = this.show_height * this.enlarge_height / this.bg_height
  this.mask.style.width = this.mask_width + 'px'
  this.mask.style.height = this.mask_height + 'px'
  // console.log(height)
  //console.log(this.enlarge_height)
  //console.log(this.enlarge)
}
// 4.移入移出
Enlarge.prototype.overOut = function () {
  this.show.addEventListener('mouseover', () => {
    this.mask.style.display = 'block'
    this.enlarge.style.display = 'block'
  })
  this.show.addEventListener('mouseout', () => {
    this.mask.style.display = 'none'
    this.enlarge.style.display = 'none'
  })
}


// 5.鼠标移动
Enlarge.prototype.move = function () {
  this.show.addEventListener('mousemove', e => {
    e = e || window.event
    let x = e.offsetX - this.mask_width / 2;//console.log(this.mask_width)
    let y = e.offsetY - this.mask_height / 2
    if (x <= 0) x = 0
    if (y <= 0) y = 0
    if (x >= this.show_width - this.mask_width) x = this.show_width - this.mask_width
    if (y >= this.show_height - this.mask_height) y = this.show_height - this.mask_height
    this.mask.style.left = x + 'px'
    this.mask.style.top = y + 'px'
    let bg_x = this.enlarge_width * x / this.mask_width;//console.log(bg_x)
    let bg_y = this.enlarge_height * y / this.mask_height;//console.log(bg_y)
    this.enlarge.style.backgroundPosition = `-${bg_x}px -${bg_y}px`
    console.log(this.enlarge.style.backgroundPosition)
  })
}
// 6. 
Enlarge.prototype.change = function () {
  this.list.addEventListener('click', e => {
    e = e || window.event
    const target = e.target || e.srcElement
    if (target.nodeName === 'IMG') {
      const show_url = target.getAttribute('show')
      const enlarge_url = target.getAttribute('enlarge')
      this.show.firstElementChild.src = show_url
      this.enlarge.style.backgroundImage = `url(${enlarge_url})`
      for (let i = 0; i < this.list.children.length; i++) {
        this.list.children[i].classList.remove('active')
      }
      target.parentElement.classList.add('active')
    }
  })
}
