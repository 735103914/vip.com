// jQuery 的入口函数, DOM 结构加载完毕就会执行
// 第二个作用: 保护变量私有化
$(function () {

    // 1. 使用 validate 插件进行表单验证操作
    $('#login').validate({
      // 规则配置
      rules: {
        username: {
          required: true,
          minlength: 5,
          maxlength: 12
        },
        password: {
          required: true,
          minlength: 6,
          maxlength: 12
        }
      },
      // 提示信息配置
      messages: {
        username: {
          required: '请填写用户名信息',
          minlength: '最少 5 个字符',
          maxlength: '最多 10 个字符'
        }
      },
      // 表单提交事件
      submitHandler (form) {
        // 2. 进行表单提交
        // 2-1. 拿到用户填写的内容
        const info = $(form).serialize()
  
        // 2-2. 发送请求到后端, 准备接受结果
        $.post('./server/login.php', info, null, 'json').then(res => {
          // res 就是后端给我的结果
          console.log(res)
  
          // 3. 登录成功以后的操作
          if (res.code === 0) {
            // 登录失败
            $('.login_error').removeClass('hide')
          } else if (res.code === 1) {
            // 3-2. 登录成功, 跳转页面, 存储 cookie
            // 为了在首页还需要使用
            setCookie('nickname', res.nickname)
            // 跳转页面
            window.location.href = './index.html'
          }
        })
      }
    })
  })