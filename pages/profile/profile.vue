<template>
	<view>
		<view 
		class="cell login-cell" 
		@click="login">
			<image 
			:src="user.avatar" 
			class="avatar"/>
			<text>
				{{ user ? user.username : "Click to login" }}
			</text>
		</view>
		
		<view 
		class="cell logout-cell" 
		@click="logout" 
		v-if="user">
			<text class="logout-text">
				Logout
			</text>
		</view>
	</view>
</template>

<script>
	
	import { mapState, mapMutations } from 'vuex'
	
	export default {
		computed: {
			...mapState(["user"])
		},
		methods: {
			login() {
				if (this.user) return
				uni.navigateTo({
					url: "../login/login"
				})
			},
		  logout() {
				uni.showModal({
					title: "Notice",
					content: "Confirm logout?",
					cancelText: "Cancel",
					confirmText: "Confirm",
					success: (resp) => {
						if (resp.confirm) this.removeUser()
					}
				})
			},
			...mapMutations(['removeUser'])
		}
	}
</script>

<style lang="scss" scoped>
	
	.cell {
		margin-top: 30upx;
		padding-left: 30upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		background-color: $uni-bg-color-grey;
	}
	
	.login-cell {
		height: 160upx;
	}
	
	.avatar {
		border-radius: 60upx;
		width: 120upx;
		height: 120upx;
		margin-right: 16upx;
		background-color: white;
	}
	
	.logout-cell {
		height: 88upx;
	}
	
	.logout-text {
		color: $uni-color-error;
	}
	
</style>
