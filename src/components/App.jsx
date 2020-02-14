import React, { Component } from "react"
import { Grid, Statistic, Card, Row, Col, Layout, Menu, Icon, Button } from 'antd';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import Particles from 'react-particles-js'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			numDots: 1,
			money: 1000,
			total: 0,
			selected: 'MSFT',
			selectedKey: 1,
			investments: [{
				key: 1,
				name: 'MSFT',
				value: 1,
				quantity: 1,
				percentGain: 1,
			},
			{
				key: 2,
				name: 'AMZN',
				value: 1,
				quantity: 1,
				percentGain: 1,
			},
			{
				key: 3,
				name: 'AAPL',
				value: 1,
				quantity: 1,
				percentGain: 1,
			},
			{
				key: 4,
				name: 'TROW',
				value: 1,
				quantity: 1,
				percentGain: 1,
			}],
			days: 0,
			history: [],
			graphPoints: []
		}        
	}

	componentDidMount() {
		const proxyurl = "https://cors-anywhere.herokuapp.com/";
		this.state.investments.map((company) => {
			fetch(proxyurl + "https://financialmodelingprep.com/api/v3/historical-price-full/" + company.name + "?from=2010-03-12&to=2019-03-12")
			.then(res => res.json())
			.then(data => {
				this.setState(prevState => ({
					history: [...prevState.history, data]
				}))
			})
			.catch(console.log)})
		this.startLoop()

	}

	getChart(key) {
		if(this && this.state && this.state.history && this.state.history.find((element) => element.symbol === key) && this.state.history.find((element) => element.symbol === key).historical)
		{
			let temp = []
			let i = 0;
			for (i = 0; i < this.state.history.find((element) => element.symbol === key).historical.length; i++) {
				if(i < this.state.days)
					temp.push({x: i, y: this.state.history.find((element) => element.symbol === key).historical[i].close})
		  	}
			return temp
		}
		else
			return []
	}

	getHistory(key) {
		return this.state.history.find((element) => element.symbol === key).historical[this.state.days].close
	}

	getGains(key) {
		return this.state.history.find((element) => element.symbol === key).historical[this.state.days].changePercent
	}

	startLoop() {
		setInterval(() => {
			this.setState({days: this.state.days + 1});
			this.setState(prevState => ({
				investments: prevState.investments.map(
					obj => Object.assign(obj, { value: this.getHistory(obj.name) })
				)
			}));
			this.setState(prevState => ({
				investments: prevState.investments.map(
					obj => Object.assign(obj, { percentGain: this.getGains(obj.name) })
				)
			}));

			if (Math.random() > 0.5) {
				this.setState({money: this.state.money - Math.floor(Math.random() * 10)});
			}


			this.setState({total: this.state.money});
			this.state.investments.map((company) => {this.setState({total: this.state.total + company.quantity * company.value})})
			this.setState({numDots: Math.log (this.state.total)});
		}
			, 2500)
	}

	renderExtras() 
	{
		if(this.state.investments.find((element) => element.name === this.state.selected) != undefined)
		{
			let element = this.state.investments.find((element) => element.name === this.state.selected)
			return (<div>						
				<p>Value: {element.value}</p>
				<p>% Gain: {element.percentGain}</p>
				<p>Quantity: {element.quantity}</p>
			</div>)
		}

	}

	renderStockMenuItem(investment) {
		return (
			<Menu.Item key={investment.key} onClick={() => {
				this.setState({selected: investment.name})	
				this.setState({selectedKey: investment.key})	
				console.log('Selected', investment.name)	
			}}>
				<span> {investment.name} </span>
				<span style={{float: 'right'}} className={investment.percentGain > 0 ? 'gain' : 'loss'}> 
					${(investment.value * investment.quantity).toFixed(2)}&nbsp;                  
					<Icon type={investment.percentGain > 0 ? 'up-square' : 'down-square'}></Icon>
				</span>
			</Menu.Item>
			)
	}

	buyStock()
	{
		console.log('Attempting to buy', this.state.selectedKey)
		if(this.state.investments.find((element) => element.key === this.state.selectedKey) != undefined)
		{
			console.log('First check passed')
			let element = this.state.investments.find((element) => element.key === this.state.selectedKey)
			if(this.state.money > element.value)
			{
				console.log('Going to buy', this.state.selectedKey)
				let temp = this.state.investments
				temp[this.state.selectedKey - 1].quantity += 1
				this.setState({
					investments: temp
				  })
				this.setState({money: this.state.money - element.value})
			}
		}
	}

	sellStock()
	{
		console.log('Attempting to sell', this.state.selectedKey)
		if(this.state.investments.find((element) => element.key === this.state.selectedKey) != undefined)
		{
			console.log('First check passed')
			let element = this.state.investments.find((element) => element.key === this.state.selectedKey)
			if(element.quantity >= 1)
			{
				console.log('Going to sell', this.state.selectedKey)
				let temp = this.state.investments
				temp[this.state.selectedKey - 1].quantity -= 1
				this.setState({
					investments: temp
				  })
				this.setState({money: this.state.money + element.value})
			}
		}
	}

render() {
	return (
		<Layout>
			<Layout>
				<Layout style={{ padding: '24px 24px 24px' }}>
					<Content
						style={{
						background: "#fff",
						padding: 24,
						margin: 0,
						height: window.screen.availHeight * .885
						}}
					>
						<span style={{fontWeight: 800, fontSize: 14}}> Day: {this.state.days} </span>
						<span>
							<Particles
								params={{
								polygon: {
								draw: {
								enable: true,
								stroke: {
								color: "#000000",
								}
								}
								},
								particles: {
								number: {
								value: this.state.numDots
								},
								color: {
								value: "#000000"
								},
								line_linked: {
								shadow: {
								enable: true,
								color: "#000000",
								blur:1
								}
								},
								size: {
								value: 10
								}
								},
								interactivity: {
								events: {
								onhover: {
								enable: true,
								mode: "repulse"
								}
								}
								}
								}} />
						</span>
					</Content>
				</Layout>
				<Sider width={400} style={{ background: '#fff' }}>
					<div style={{ background: '#ECECEC', padding: '0px 0px 10px 0px' }}>
						<Card title="Capital" bordered={false} style={{ margins: 0 }}>
					<p><span style={{float: 'left'}}>Free capital</span><span style={{float: 'right'}}> ${this.state.money.toFixed(2)} </span></p><br/>
					<p><span style={{float: 'left'}}>Total assets</span><span style={{float: 'right'}}> ${this.state.total.toFixed(2)} </span></p>
						</Card>
					</div>
					<Menu
						mode="inline"
						defaultOpenKeys={['stockmenu', 'statsmenu']}
						defaultSelectedKeys={['1']}
						style={{ height: '100%', borderRight: 0}}
					>						
						<SubMenu
							key="stockmenu"
							title={
							<span>
								<Icon type="bank" />
								Investments
							</span>
							}
						>
							{this.state.investments.map(investment => this.renderStockMenuItem(investment))}

						</SubMenu>
						<SubMenu
							key="statsmenu"
							title={
							<span>
								<Icon type="area-chart" />
								Tracking and Charts
							</span>
							}
						>
							<Menu.Item key="5">Chart</Menu.Item>
								<XYPlot
								width={320}
								height={260}>
								<HorizontalGridLines />
								<LineSeries
									data={this.getChart(this.state.selected)}/>
								<XAxis />
								<YAxis />
								</XYPlot>

							<Card size="small" title={this.state.selected} style={{ width: 400 }}>
								{this.renderExtras()}
							</Card>
								<Button style={{ background: '#1890ff', color: 'white', left: 100, width: 100 }} onClick={() => this.buyStock()}>
									Buy
								</Button>  
								<Button style={{ background: '#1890ff', color: 'white', left: 100, width: 100 }} onClick={() => this.sellStock()}>
									Sell
								</Button>  
						</SubMenu>
					</Menu>
				</Sider>    
			</Layout>
		</Layout>
		)
	}

}

export default App
