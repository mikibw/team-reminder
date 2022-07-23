<template>
	<view class="layout">
		<view class="base-info">
			<image class="avatar" :src="avatar"></image>
			<text class="name">
				{{ name }}
			</text>
		</view>
		<text class="update-text" v-show="!!update" selectable><text class="update-prefix">
			Said：</text>{{ update }}
		</text>
		<view class="tool-bar" v-if="showToolBar">
			<text @click="$emit('onEdit')">Edit</text>
			<text @click="$emit('onDelete')">Delete</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			avatar: {
				type: String,
				default: ""
			},
			name: {
				type: String,
				default: ""
			},
			update: {
				type: String,
				default: ""
			},
			showToolBar: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.layout {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 16upx 0;
		.base-info {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			.avatar {
				width: 60upx;
				height: 60upx;
				border-radius: 30upx;
				background-color: $uni-bg-color-grey;
			}
			.name {
				font-size: 24upx;
				margin-left: 16upx;
			}
		}
		.update-text {
			margin-top: 16upx;
			font-size: 26upx;
			color: $uni-text-color;
			.update-prefix {
				color: $uni-color-primary;
			}
		}
		.tool-bar {
			margin-top: 16upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			text {
				color: $uni-color-primary;
				font-size: 24upx;
			}
			text:nth-child(1) {
				margin-right: 16upx;
			}
		}
	}
	
</style>
