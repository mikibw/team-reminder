<template>
	<view>
		<textarea 
		class="text-area"
		placeholder="Please enter your update."
		maxlength="-1"
		:value="content"
		@input="handleInput"
		@blur="handleInput" 
		/>
		
		<button 
		class="confirm-button"
		:disabled="!content.length"
		hover-class="none"
		type="primary"
		@click="confirm">
			Upload
		</button>
	</view>
</template>

<script>
	
	import Network from 'common/Network.js'
	
	export default {
		data() {
			return {
				id: "",
				content: "",
				date: ""
			}
		},
		methods: {
			handleInput(e) {
				this.content = e.target.value;
			},
			async confirm() {
				const content = this.content.trim()
				if (content.length === 0) {
					uni.showToast({
						title: "Please input your update.",
						icon: "none",
						mask: true						
					})
					return
				}
				uni.showLoading({
					title: "uploading...", 
					mask: true
				})
				let network = null
				if (this.id) {
					network = new Network(`/v1/updates/${this.id}`, "put", {
						comment: this.content
					})
				} else {
					network = new Network("/v1/updates", "post", {
						comment: this.content,
						date: this.date
					})
				}
				const [, { statusCode, data: response } = {}] = await network.request()
				uni.hideLoading()
				if (statusCode === 200) {
					uni.navigateBack()
					uni.$emit(this.id ? 'changeUpdate': 'addUpdate')
				} else {
					uni.showToast({
						title: response.message || "upload failed.",
						icon: "none",
						mask: true
					})
				}
			}
		},
		onLoad(option) {
			this.id = option.id || ""
			this.content = option.content || ""
			this.date = option.date || ""
		}
	}
</script>

<style lang="scss" scoped>
	.text-area {
		width: 100%;
		height: 300upx;
		padding: 16upx;
		font-size: 28upx;
		caret-color: $uni-color-primary;
		background-color: $uni-bg-color-grey;
	}
	.confirm-button {
		margin: 30upx;
		font-size: 30upx;
	}
</style>
