<template>
	<view v-show="!!updates" class="section">
		<view>
			<event-section-header name="Updates" />
			<event-cell
			v-for="item in updates" 
			:key="item._id" 
			:avatar="item.user.avatar" 
			:name="item.user.username"
			:update="item.comment"
			:show-tool-bar="true"
			@onEdit="editUpdate(item._id, item.comment)"
			@onDelete="deleteUpdate(item._id)" 
			/>
		</view>
	</view>
</template>

<script>
	
	import EventSectionHeader from './event-section-header.vue'
	import EventCell from './event-cell.vue'
	
	import Network from 'common/Network.js'
	
	export default {
		props: {
			updates: {
				type: Array,
				default: null
			} 
		},
		methods: {
			editUpdate(updateId, content) {
				uni.navigateTo({
					url: `../update/update?id=${updateId}&content=${content}`
				})
			},
			async deleteUpdate(updateId) {
				const [, { confirm }] = await uni.showModal({
					title: "Notice",
					content: `Confirm delete this update?`,
					cancelText: "Dismiss",
					confirmText: "Confirm"
				})
				if (!confirm) return
				
				uni.showLoading({
					title: "deleting...",
					mask: true
				})
				const network = new Network(`/v1/updates/${updateId}`, "delete", {})
				const [, { statusCode, data: response } = {}] = await network.request()
				uni.hideLoading()
				const message = statusCode === 200 
					? "delete succeed." 
					: (response.message || "delete failed.")
				uni.showToast({
					title: message,
					icon: "none",
					mask: true						
				})
				if (statusCode === 200) {
					uni.$emit('deleteUpdate')
				}
			}
		},
		components: {
			EventSectionHeader,
			EventCell
		}
	}
</script>

<style lang="scss" scoped>
	.section {
		padding: 30upx;
	}
</style>
