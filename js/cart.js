// jquery 的入口函数
$(function () {

    // 0. 进行登录判断
    // 如果没有登录, 直接跳转回登录页
    // 通过 cookie
    const nickname = getCookie('nickname')
    if (!nickname) return window.location.href = './login.html'
  
    // 1. 拿到 localStorage 里面的 cart 数据
    const cart = JSON.parse(window.localStorage.getItem('cart')) || []
  
    // 2. 判断 cart 的 length, 决定执行进行哪一个渲染
    if (!cart.length) {
      // 表示购物车没有数据
      // 购物车列表添加 hide 类名, 进行隐藏
      $('.on').addClass('hide')
      $('.off').removeClass('hide')
      return
    }
  
    // 3. 能来到这里表示 cart 里面有数据
    // 就要进行渲染了
    $('.off').addClass('hide')
    $('.on').removeClass('hide')
  
    // 4. 根据 cart 进行页面渲染
    // 写一个方法进行渲染
    bindHtml()
    function bindHtml() {
      // 5. 进行一些数据的准备
      // 5-1. 决定全选按钮是不是选中
      // every()
      const selectAll = cart.every(item => item.is_select === '1')
      // 5-2. 计算选中的商品数量和价格
      let total = 0
      let totalMoney = 0
      cart.forEach(item => {
        if (item.is_select === '1') {
          total += item.cart_number - 0
          totalMoney += item.cart_number * item.goods_price
        }
      })
  
      let str = `
        <div class="panel panel-info">
          <div class="panel-heading">
            <p class="selectAll">
              <span>全选:</span>
              <input type="checkbox" ${ selectAll ? 'checked' : '' }>
              <span class="text">购 物 清 单</span>
            </p>
          </div>
          <div class="panel-body">
            <ul class="goodsList">
      `
  
      cart.forEach(item => {
        str += `
          <li>
            <div class="select">
              <input data-id="${ item.goods_id }" type="checkbox" ${ item.is_select === '0' ? '' : 'checked' }>
            </div>
            <div class="goodsImg">
              <img src="${ item.goods_small_logo }" alt="">
            </div>
            <div class="goodsDesc">
              <p>${ item.goods_name }</p>
            </div>
            <div class="price">
              ￥ <span class="text-danger">${ item.goods_price }</span>
            </div>
            <div class="count">
              <button class="subNum" data-id="${ item.goods_id }">-</button>
              <input type="text" value="${ item.cart_number }">
              <button class="addNum" data-id="${ item.goods_id }">+</button>
            </div>
            <div class="xiaoji">
              ￥ <span class="text-danger">${ (item.goods_price * item.cart_number).toFixed(2) }</span>
            </div>
            <div class="operate">
              <button class="btn btn-danger del" data-id="${ item.goods_id }">删除</button>
            </div>
          </li>
        `
      })
  
      str += `
            </ul>
          </div>
          <div class="panel-footer">
            <div class="row buyInfo">
              <p class="col-sm-4 buyNum">
                购买总数量: <span class="text-danger cartNum">${ total }</span> 件商品
              </p>
              <p class="col-sm-4 buyMoney">
                购买总价格: <span class="text-danger total">${ totalMoney.toFixed(2) }</span> 元
              </p>
              <p class="col-sm-4 operate">
                <button class="btn btn-success" ${ totalMoney === 0 ? 'disabled' : '' }>立即付款</button>
                <button class="btn btn-danger">清空购物车</button>
                <button class="btn btn-primary">继续购物<a href="./detail.html"></a></button>
              </p>
            </div>
          </div>
        </div>
      `
  
      // 添加到指定标签内
      $('.on').html(str)
    }
  
    // 5. 给各个按钮添加点事件
    // 5-1. 每一个选择按钮的点击事件
    $('.on').on('click', '.select > input', function () {
      // 拿到当前标签的状态
      const type = this.checked
      // 拿到当前标签的 id
      const id = $(this).data('id')
      // 去 cart 里面找到 id 对应的数据, 把 is_select 修改一下
      const info = cart.filter(item => item.goods_id == id)[0]
      info.is_select = type ? '1' : '0'
      // 从新渲染页面
      bindHtml()
      // 把最新的 cart 存起来
      window.localStorage.setItem('cart', JSON.stringify(cart))
    })
  
    // 5-2. 数量 ++
    $('.on').on('click', '.addNum', function () {
      // 拿到商品 id
      const id = $(this).data('id')
      // 找到 cart 中的对应商品
      const info = cart.filter(item => item.goods_id == id)[0]
      // 修改信息
      info.cart_number = info.cart_number - 0 + 1
      // 重新渲染页面
      bindHtml()
      // 从新保存起来
      window.localStorage.setItem('cart', JSON.stringify(cart))
    })
  
    // 5-3. 数量 --
    $('.on').on('click', '.subNum', function () {
      // 拿到商品 id
      const id = $(this).data('id')
      // 找到 cart 中的对应商品
      const info = cart.filter(item => item.goods_id == id)[0]
      // 判断 info 内的 cart_number 如果已经是 1 了, 就什么都不做了
      if (info.cart_number === 1) return
      // 修改信息
      info.cart_number = info.cart_number - 0 - 1
      // 重新渲染页面
      bindHtml()
      // 从新保存起来
      window.localStorage.setItem('cart', JSON.stringify(cart))
    })
  
    // 5-4. 删除操作
    $('.on').on('click', '.del', function () {
      // 拿到商品 id
      const id = $(this).data('id')
      // 删除指定数据
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].goods_id == id) {
          cart.splice(i, 1)
          break
        }
      }
  
      // 重新渲染页面
      bindHtml()
      // 从新保存起来
      window.localStorage.setItem('cart', JSON.stringify(cart))
  
      if (!cart.length) return window.location.reload()
    })
  })
  
  
  