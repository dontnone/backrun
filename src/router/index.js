import React from 'react'
import { Router, Route } from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
const history = createHashHistory()


import Home from '../pages/login/Home'
import AddSearch from '../pages/home/addSearch'
import Index from '../pages/home/Index'
import User from '../pages/user/Index'
import UserAdd from '../pages/user/adduser'
import Charts from '../pages/home/charts'


const RouteConfig = ()=> (
	<Router history={history}>
		<div>
			<Route exact path="/" component={Home}/>
			<Route path="/addsearch" component={AddSearch}/>
			<Route path="/home" component={Index}/>
			<Route path="/user" component={User}/>
			<Route path="/add" component={UserAdd}/>
			<Route path="/chart" component={Charts}/>
		</div>
	</Router>
)

export default RouteConfig