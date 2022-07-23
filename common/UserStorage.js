const userKey = "UserKey_v1"

class UserStorage {
	static save(user) {
		uni.setStorageSync(userKey, user)
	}
	static fetch() {
		return uni.getStorageSync(userKey)
	}
	static remove() {
		uni.removeStorageSync(userKey)
	}
}

export default UserStorage