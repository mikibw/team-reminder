<template>
	<view>
		<view class="user-item" v-for="(user, index) in users" :key="index" @click="change(user)">
			<image :src="user.avatar" class="avatar" />
			<text class="username">{{ user.username }}</text>
			<image class="check" v-show="`${user._id}` === defaultRosterId" src="../../static/check.png" />
		</view>
		<button v-show="showRetry" hover-class="none" type="primary" class="retry-button" @click="fetchUsers">Click to retry.</button>
	</view>
</template>

<script>
	import Network from 'common/Network.js'
	
	export default {
		data() {
			return {
				defaultRosterId: "",
				users: [],
				showRetry: false
			}
		},
		methods: {
			async fetchUsers() {
				uni.showLoading({
					title: "loading...", 
					mask: true
				})
				const network = new Network("/v1/projects/users", "get", {})
				const [, {statusCode, data: response} = {}] = await network.request()
				uni.hideLoading()
				if (statusCode === 200) {
					this.users = response.data
					this.showRetry = false
				} else {
					uni.showToast({
						title: "load failed.",
						icon: "none",
						mask: true						
					})
					this.users = []
					this.showRetry = true
				}
			},
			async change(user) {
				if (`${user._id}` === this.defaultRosterId) return
				const [, {confirm}] = await uni.showModal({
					title: "Notice",
					content: `Confirm change roster to ${user.username}?`,
					cancelText: "Cancel",
					confirmText: "Confirm"
				})
				if (!confirm) return
				uni.navigateBack()
				uni.$emit('changeRoster', user._id);
			}
		},
		mounted() {
			this.fetchUsers()
		},
		onLoad(options) {
			this.defaultRosterId = options.defaultRosterId
		}
	}
</script>

<style lang="scss" scoped>
	.user-item:nth-child(odd) {
		background-color: $uni-bg-color-grey;
	}
	.user-item {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding-left: 30upx;
		height: 120upx;
		position: relative;
		.avatar {
			width: 80upx;
			height: 80upx;
			border-radius: 40upx;
			background-color: $uni-bg-color-grey;
		}
		.username {
			margin-left: 16upx;
			font-size: 28upx;
		}
		.check {
			width: 40upx;
			height: 40upx;
			position: absolute;
			right: 30upx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.retry-button {
		position: fixed;
		top: 30%;
		left: 50%;
		width: 80%;
		transform: translateX(-50%);
		font-size: 30upx;
	}
</style>
