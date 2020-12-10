<?php


  // 接受一级分类
  $one = $_GET['cat_one'];
  $two = $_GET['cat_two'];

  // 查询数据库, 找到有多少种分类就可以了
  $link = mysqli_connect('localhost', 'root', 'root', 'bk2004');
  // 把数据库里面的数据按照 cat_one_id 这个字段进行分类
  // 每一类数据值拿出第一条
  $sql = "SELECT `cat_three_id` FROM `goods` WHERE `cat_one_id`='$one' AND `cat_two_id`='$two' GROUP BY `cat_three_id`";
  $res = mysqli_query($link, $sql);
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);

  // 返回结果给前端
  echo json_encode(array(
    "message" => "获取三级分类列表成功",
    "code" => 1,
    "list" => $data
  ));

?>
