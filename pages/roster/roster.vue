<template>
	<view>
		<uni-grid v-if="!!user" :column="2" :showBorder="false" :highlight="false">
			<uni-grid-item v-for="(tag, index) in tags" :tag="tag" :key="index">
				<view class="cell" :style="{ backgroundColor: colors[index % colors.length] }" @click="showOptions(tag)">
					<text class="tag-name">{{ tag.name }}</text>
					<view  v-if="tag.roster" class="roster">
						<image class="avatar" :src="tag.roster.avatar" mode="" />
						<text class="username">{{ tag.roster.username }}</text>
					</view>
					<image class="click" src="../../static/icon_click.png">
				</view>
			</uni-grid-item>
		</uni-grid>
		<button v-else class="login" hover-class="none" type="primary" @click="login">Login to check rosters</button>
		
		<text-placeholder v-show="!!user && (tags === null || tags.length === 0)" text="no data"/>
		
		<modal 
		v-if="showChangePopUp" 
		title="change tag name"
		cancel-text="cancel"
		confirm-text="confirm"
		@cancel="showChangePopUp = false" 
		@confirm="showChangePopUp = false; changeTagName();"> 
			<input placeholder="Enter tag name" v-model="tagName" />
		</modal>
		
		<modal 
		v-if="showCreatePopUp" 
		title="create new tag"
		cancel-text="cancel"
		confirm-text="confirm"
		@cancel="showCreatePopUp = false" 
		@confirm="showCreatePopUp = false; createTag();"> 
			<input placeholder="Enter tag name" v-model="tagName" />
		</modal>
		<button class="plus" hover-class="none" type="primary" @click="showCreatePopUp = true" />
		
		<!-- <uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog mode="input" message="成功消息"></uni-popup-dialog>
		</uni-popup> -->
	</view>
</template>

<script>
	
	import TextPlaceholder from '../../single/text-placeholder.vue'
	
	import Network from 'common/Network.js'
	import { mapState } from 'vuex'
	
	export default {
		data() {
			return {
				tags: null,
				selectedTag: null,
				colors: ['#d4237a', '#1296db', '#56afcc', '#af2fad', '#01afaa'],
				showCreatePopUp: false,
				showChangePopUp: false,
				tagName: ''
			}
		},
		methods: {
			async fetchTags() {
				if (!this.user) return
				uni.showLoading({
					title: "loading...",
					mask: true
				})
				const network = new Network(`/v1/projects/tags`, "get", {})
				const [, { statusCode, data: response } = {}] = await network.request()
				this.tags = statusCode === 200 ? response.data : null
				uni.hideLoading()
			},
			async showOptions(tag) {
				this.selectedTag = tag
				const [, resp = null] = await uni.showActionSheet({
					itemList: ['rename', 'assign roster', 'delete']
				});
				if (!resp) return
				switch (resp.tapIndex) {
				case 0: 
					this.showChangePopUp = true
					break
				case 1: 
					const id = this.selectedTag?.roster?._id || ""
					uni.navigateTo({ url: `../users/users?defaultRosterId=${id}` })
					break
				case 2: 
					this.deleteTag() 
					break
				default: break
				}
			},
			async createTag() {
				if (!this.tagName) return
				const network = new Network(`/v1/tags`, "post", { name: this.tagName })
				const [, { statusCode, data: response } = {}] = await network.request()
				uni.hideLoading()
				const message = statusCode === 200 
					? "add tag succeed." 
					: (response.message || "add tag failed.")
				uni.showToast({
					title: message,
					icon: "none",
					mask: true						
				})
				if (statusCode === 200) this.fetchTags()
			},
			async changeTagName() {
				if (!this.tagName) return
				const network = new Network(`/v1/tags/${this.selectedTag._id}/name`, "put", { name: this.tagName })
				const [, { statusCode, data: response } = {}] = await network.request()
				uni.hideLoading()
				const message = statusCode === 200 
					? "change tag name succeed." 
					: (response.message || "change tag name failed.")
				uni.showToast({
					title: message,
					icon: "none",
					mask: true						
				})
				if (statusCode === 200) this.fetchTags()
			},
			async changeTagRoster(rosterId) {				
				if (!rosterId) return
				const network = new Network(`/v1/tags/${this.selectedTag._id}/roster`, "put", { rosterId })
				const [, { statusCode, data: response } = {}] = await network.request()
				uni.hideLoading()
				const message = statusCode === 200 
					? "change roster succeed." 
					: (response.message || "change roster failed.")
				uni.showToast({
					title: message,
					icon: "none",
					mask: true						
				})
				if (statusCode === 200) this.fetchTags()
			},
			async deleteTag() {
				const [, { confirm }] = await uni.showModal({
					title: "Notice",
					content: `Confirm delete ${this.selectedTag.name}?`,
					cancelText: "Dismiss",
					confirmText: "Confirm"
				})
				if (!confirm) return
				const network = new Network(`/v1/tags/${this.selectedTag._id}`, "delete", {})
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
				if (statusCode === 200) this.fetchTags()
			},
			login() {
				uni.navigateTo({ url: "../login/login" })
			}
		},
		mounted() {
			uni.$on('changeRoster', (rosterId) => {
				this.changeTagRoster(rosterId);
			});
			this.fetchTags()
		},
		watch: {
			user() { this.fetchTags() }
		},
		computed: {
			...mapState({ user: state => state.user })
		},
		components: {
			TextPlaceholder
		}
	}
</script>

<style lang="scss" scoped>
	
	.cell {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 16upx;
		margin: 16upx;
		.tag-name {
			color: white;
			margin-top: 32upx;
			font-size: 40upx;
			font-weight: bold;
		}
		.roster {
			margin-top: 32upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			.avatar {
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				background-color: $uni-bg-color-grey;
			}
			.username {
				margin-left: 16upx;
				color: white;
				font-size: 30upx;
			}
		}
		.click {
			margin-top: 28upx;
			width: 40upx;
			height: 40upx;
		}
	}
	
	.login {
		font-size: 30upx;
		margin: 120upx 30upx 0 30upx;
	}
	
	.plus {
		position: fixed;
		right: 30upx;
		bottom: 30upx;
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		background-image: url(../../static/add_plus.png);
		background-repeat: no-repeat;
		background-position: center center;
	}
</style>
