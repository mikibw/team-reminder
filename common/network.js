import UserStorage, { User } from "./UserStorage.js"
import store from "../store"

const domain = "https://www.mckky.xyz"
// const domain = "http://localhost:3000"

class Network {
	
	constructor(path, method, parameters) {
	    this.url = domain.concat(path)
		this.method = method
		this.parameters = parameters
		this.headers = { "Content-Type": "application/json" }
		const user = UserStorage.fetch()
		if (user) this.headers.Authorization = "Bearer " + user.token
	}
	
	request() {
		return uni.request({
			url: this.url,
			method: this.method,
			data: this.parameters,
			header: this.headers
		}).then(resp => {
			const [, { statusCode } = {}] = resp
			if (statusCode === 401) store.commit('removeUser')
			return resp
		})
	}
}

export default Network