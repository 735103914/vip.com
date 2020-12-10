//  1.搜索引擎
 // 获取ul
 const ul=document.querySelector('.search-ul')
 // 1.给文本框绑定input事件
 const inp=document.querySelector('input')
 inp.addEventListener('input',function(){
     const value=this.value.trim()
     if(!value) return
     const script=document.createElement('script')
     const url=`https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=32813,1455,33042,33058,33098,33101,32962,22158&wd=${value}&req=2&csor=6&pwd=${value}&cb=bindHtml&_=1605861539583`
     script.src=url
     document.body.appendChild(script)
     script.remove()
 })
 // 全局准备一个jsonp的处理函数
 function bindHtml(res){
     // console.log(res)
     if(!res.g){
         ul.classList.remove('active')
         return
     }
     let str=''
     for(let i=0;i<res.g.length;i++){
         str+=`
         <li>${res.g[i].q}</li>
         `
         ul.innerHTML=str
         ul.classList.add('active')
     }
 }
// 2.轮播图
// 获取元素
const box=document.querySelector('.box')
const imgBox=document.querySelector('.imgBox')
const pointBox=document.querySelector('.pointBox')
console.log(pointBox)
const leftRightbox=document.querySelector('.leftRight')
let count=0
let index=0
let flag=true
let timer=0
const banner_width=box.clientWidth
setPoint()
copyEle()
autoPlay()
moveEnd()
overOut()
leftRight()
pointEvent()
// 1.创建焦点
function setPoint(){
    const pointNum=imgBox.children.length
    const frg=document.createDocumentFragment()
    for(let i=0;i<pointNum;i++){
        const li=document.createElement('li')
        
        li.setAttribute('index_page',i)
        console.log(li)
        if(i===0) {
           li.classList.add('active')
        }
        frg.appendChild(li)
    }
    pointBox.appendChild(frg)
    pointBox.style.width=pointNum*30+'px'
}
// 2.复制元素
function copyEle(){
    const first=imgBox.firstElementChild.cloneNode(true)
    const last=imgBox.lastElementChild.cloneNode(true)
    imgBox.appendChild(first)
    imgBox.insertBefore(last,imgBox.firstElementChild)
    imgBox.style.width=imgBox.children.length*100+'%'
    imgBox.style.left=-banner_width+'px'

}
// 3.自动播放
function autoPlay(){
    timer=setInterval(()=>{
        index++
        move(imgBox,{left:-index*banner_width},moveEnd)
    },2000)
}
// 4.运动结束
function moveEnd(){
    if(index===imgBox.children.length-1){
        index=1
        imgBox.style.left=-banner_width+'px'

    }
    if(index===0){
        index=imgBox.children.length-2
        imgBox.style.left=-banner_width+'px'
    }
    for(let i=0;i<pointBox.children.length;i++){
        pointBox.children[i].classList.remove('active')
    }
    pointBox.children[index-1].classList.add('active')
    flag=true
}
// 5.移入移出
function overOut(){
    box.addEventListener('mouseover',()=>{clearInterval(timer)})
    box.addEventListener('mouseout',()=>{autoPlay()})
}
// 6.左右切换
function leftRight(){
    leftRightbox.addEventListener('click',e=>{
        e=e||window.event
        const target=e.target||e.srcElement
        if(target.className==='left'){
            if(!flag)return
            index--
            move(imgBox,{left:-index*banner_width},moveEnd)
            flag=false
        }
        if(target.className==='right'){
            if(!flag)return
            index++
            move(imgBox,{left:-index*banner_width},moveEnd)
            flag=false
        }
    })
}
// 7.焦点切换
function pointEvent(){
    pointBox.addEventListener('click',e=>{
        e=e||window.event
        const target=e.target||e.srcElement
        if(target.nodeName==='LI'){
            if(!flag)return
            const index_page=target.getAttribute('index_page')-0
            index=index_page+1
            move(imgBox,{left:-index*banner_width},moveEnd)
            flag=false
            
        }
    })
}

// 显示名字
// jQuery 的入口函数
$(function () {

    // 1. 根据 cookie 中的信息
    // 判断用户信息面板中显示哪一个内容
    const nickname = getCookie('nickname')
    // console.log(getCookie('nickname'))
    // 2. 根据 nickname 信息进行判断
    if (nickname) {
      // 表示存在, 不是 undefined
      $('.off').addClass('hide')
      $('.on').removeClass('hide').text(`欢迎您: ${nickname}`)

  
      // 才制作购物车联动
      setCartNum()
    } else {
      // 表示不存在, 是 undefined
      $('.off').removeClass('hide')
      $('.on').addClass('hide')
    }
  
    // 3. 拿到购物车里面有多少数据
    // 填充到指定位置
    function setCartNum() {
      // 拿到 localStorage 里面的那个数组
      const cart = JSON.parse(window.localStorage.getItem('cart')) || []
      // 3-2. 判断 cart 是一个 [], 那么就用 0 填充到指定位置
      if (!cart.length) {
        $('.cartNum').html('0')
        return
      }
  
      // 3-3. 能来到这里, 表示购物车里面有数据
      // 需要把每一条数据的 cartNum 叠加咋一起
      let count = 0
      cart.forEach(item => count += item.cart_number - 0)
      $('.cartNum').html(count)
    }
  })