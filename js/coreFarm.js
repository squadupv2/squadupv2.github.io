let web3
let loginInt
$(document).ready(function() {

	window.addEventListener('load', async function () {
		await ethereum.request( {method: 'eth_requestAccounts'} )
		ethereum.request({ method: 'eth_accounts' }).then(function (result) {
			user.address = result[0]
			console.log("User wallet: " + user.address)
			$('#walletConnet')[0].innerHTML = '0x' + result[0].slice(2, 5) + '...' + result[0].slice(42 - 5)

			web3 = new Web3(window.web3.currentProvider)

			clearInterval(loginInt)
			loginInt = setInterval(async () => {
				ethereum.request({ method: 'eth_accounts' }).then(function (result) {
					if (window.ethereum && user.address !== result[0]) location.reload()
				})
			}, 5000)

			getTokenStats()
		})

		if(user.address != undefined){
            runFarm()
        }else 
			beginLogins()

	})
})

let attempts = 0
async function beginLogins(){
	await ethereum.request({method: 'eth_requestAccounts'})
	await userLoginAttempt()
	setTimeout(() => {
		if(user.address == undefined && attempts < 3){
			setTimeout(() => {
				if(user.address == undefined && attempts < 3){
					attempts++
					beginLogins()
				}
			}, 300)
		}
	}, 300)
}

async function userLoginAttempt(){
	await ethereum.request({method: 'eth_requestAccounts'})
	ethereum.request({ method: 'eth_accounts' }).then(function (result) {
		user.address = result[0]
		console.log("User wallet: " + user.address)
		$('#walletConnet')[0].innerHTML = '0x' + result[0].slice(2, 5) + '...' + result[0].slice(42 - 5)
		
		web3 = new Web3(window.web3.currentProvider)

		clearInterval(loginInt)
		loginInt = setInterval(async () => {
			ethereum.request({ method: 'eth_accounts' }).then(function (result) {
				if (window.ethereum && user.address !== result[0]) location.reload()
			})
		}, 5000)

		getTokenStats()
        runFarm()
	})
}

function runFarm(){
    initFarmContracts()
}

async function getTokenStats(){
    await autoContract(true)
    await (sqdContract = new web3.eth.Contract(sqdABI, sqd))    
    getUserBalance()
}
