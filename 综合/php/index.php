<?php
require_once ('A.php') ;
require_once ('B.php') ;
require_once ('C.php') ;

//$a_app = new a\b\c\Apple() ; //一种写法

use a\b\c\Apple ; //公用写法
use d\e\f\Apple as Bapple ;

$a_app = new Apple() ;
$a_app2 = new Apple() ;
$a_app3 = new Apple() ;

$a_app->get_info() ;

$b_app = new Bapple() ;
$b_app->get_info() ;

$c_app = new \Apple() ; //加\表示顶层命名空间
$c_app->get_info() ;