<template>
	<view>
		<view class="input-wrapper">
			<input 
			class="text-field" 
			type="text" 
			:value="username" 
			@input="handleUsernameInput" 
			@blur="handleUsernameInput" 
			placeholder="Please enter your username." 
			/>
		</view>
		<view class="input-wrapper">
			<input 
			class="text-field" 
			type="text" 
			password 
			:value="password" 
			@input="handlePasswordInput" 
			@blur="handlePasswordInput" 
			placeholder="Please enter your password." 
			/>
		</view>
		<button 
		class="login" 
		:disabled="!username.length || !password.length" 
		hover-class="none" 
		type="primary" 
		open-type="getUserInfo" 
		@getuserinfo="login"
		>
			Login
		</button>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	import Network from 'common/Network.js'
	import {
		User
	} from 'common/UserStorage.js'

	export default {
		data() {
			return {
				username: "",
				password: "",
			}
		},
		methods: {
			handleUsernameInput: function(e) {
				this.username = e.target.value
			},
			handlePasswordInput: function(e) {
				this.password = e.target.value
			},
			async login({ detail: { userInfo } }) {
				// 用户取消授权
				if (!userInfo) return;
				// 开始登录
				uni.showLoading({
					title: "login...",
					mask: true
				})
				// 登录结果
				const network = new Network("/v1/users/login", "post", {
					username: this.username,
					password: this.password
				})
				const [, { statusCode, data: response } = {}] = await network.request()
				uni.hideLoading()
				if (statusCode === 200) {
					this.saveUser(response.data)
					uni.navigateBack()
				} else {
					uni.showToast({
						title: response.message || "login failed.",
						icon: "none",
						mask: true
					})
				}
			},
			...mapMutations(["saveUser"])
		}
	}
</script>

<style lang="scss" scoped>
	.input-wrapper {
		height: 100upx;
		padding: 0 30upx;
		margin: 30upx 30upx 0 30upx;
		background-color: $uni-bg-color-grey;
		border-radius: 12upx;
		.text-field {
			height: 100%;
		}
	}

	.login {
		margin: 30upx;
		font-size: 30upx;
	}
</style>
