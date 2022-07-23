import Vue from 'vue'
import Vuex from 'vuex'
import UserStorage from '../common/UserStorage.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
		user: UserStorage.fetch()
	},
    mutations: {
		saveUser(state, user) {
			state.user = user
			UserStorage.save(user)
		},
		removeUser(state) {
			state.user = null
			UserStorage.remove()
		}
	},
    actions: { }
})
export default store