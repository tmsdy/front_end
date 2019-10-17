/*
1.as映射名字：select count(*) as count from ...
count(*)和count(1)效果一样

2.查询：
查每日的：https://blog.csdn.net/a114469/article/details/80704590
同一条件查多个表：https://zhidao.baidu.com/question/560957519.html
select count(1) as count from error_detail where to_days(now()) - to_days(createTime) <= 1
union
select count(1) as count from api_error where to_days(now()) - to_days(create_time) <= 1
;

*/