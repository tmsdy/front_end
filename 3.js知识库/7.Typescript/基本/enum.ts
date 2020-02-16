enum Gender { //这样分门别类看起来更直观，用的蛮多
  Male,
  Female
}
if(Gender.Male){ 

}


enum WEEK{
  MON,
  TUS,
  WDS,
  SAT
}

var m = WEEK.MON;

switch(m){
  case WEEK.MON : console.log('星期一') ;break ;
  case WEEK.TUS : console.log('星期二') ;break ; //检测到下面不会走的
  case WEEK.WDS : console.log('星期三') ;break ;
  case WEEK.SAT : console.log('星期四') ;break ;
}
