import  Taro,{Component}  from  '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
import  { AtTabs,AtTabsPane } from 'taro-ui'
import './food.less'
import Cata from './cata'
import FoodList from './FoodList'

class  Food  extends  Component{
	constructor(){
		super(...arguments);
		this.state={
			current: 0,
			tabList:[{title:"点菜"},{title:"评价"},{title:"商家"}],
			foodList:[],
			currentList:[]
		};
	}
	changeTab(value){
		this.setState({
			current: value
		})
	}
	changeCata(selectCata){ //切换分类
		if(this.state.foodList.some(item=>item.pid==selectCata.id)){ // 不需加载数据
			console.log('不需加载数据')
			this.setState({
				currentList : this.state.foodList.filter(item=>item.pid==selectCata.id)
			})
		}else{// 需要加载数据
			console.log('需要加载数据')
			this.setState({
				foodList: this.state.foodList.concat(this.getData(selectCata))
			},()=>{
				console.log(this.state.foodList)
				this.setState({ //setState一次用到currentList数据的FoodList组件就会重新渲染一次
					currentList : this.state.foodList.filter(item=>item.pid==selectCata.id)
				})
			})
		}
	}
	getData(selectCata){
		let count=Math.round(Math.random()*7);
		return Array.from(Array(Math.round(Math.random()*20)),(v,k)=>({
				price:Math.round(Math.random()*20),
				sole:Math.round(Math.random()*50),
				img:count,
				pid:selectCata.id,
				id:selectCata.id+"_"+k,title:"分类"+selectCata.id+"菜品"+(k+1)
			})
		)
  }
  componentDidMount(){
    console.log(AtTabs,Input)
  }
	render(){
		let {current,tabList} = this.state ;
	   return  (<View>
			<AtTabs current={current} onClick={this.changeTab.bind(this)} tabList={tabList}>
				<AtTabsPane>
					<View className="food_body">
						<Cata onChangeCata={this.changeCata.bind(this)} />
						<FoodList currentList={this.state.currentList} />
					</View>
				</AtTabsPane>
				<AtTabsPane>评价</AtTabsPane>
				<AtTabsPane>商家</AtTabsPane>
			</AtTabs>
		</View>)
	}
}
export default Food;
