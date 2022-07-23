<template>
	<view v-show="!!text" class="text">
		<text>{{ text }}</text>
	</view>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: ""
			}
		}
	}
</script>

<style lang="scss" scoped>
	.text {
		padding: 30upx;
		font-size: 28upx;
		text-align: center;
		color: $uni-text-color-grey;
	}
</style>
