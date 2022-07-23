<template>
	<view class="section">
		<view class="mark" />
		<text class="title">{{ name }}</text>
	</view>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				default: ""
			}
		}
	}
</script>

<style lang="scss" scoped>

	.section {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 70upx;
	
		.mark {
			width: 16upx;
			height: 44upx;
			margin-right: 30upx;
			background-color: $uni-color-primary;
		}
		
		.title {
			font-size: 26upx;
		}
	}
	
</style>
