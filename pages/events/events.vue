<template>
	<view class="container" @touchstart="touchStart" @touchmove="touchMove">
		<zzx-calendar ref="calendar" class="calendar" @selected-change="dateChanged" :unfold="unfold" />
		<view v-if="!!user">
			<event-detail-section :updates="updates" />
			<text-placeholder :text="prompt"/>
			<button class="plus" v-show="!!updates" hover-class="none" type="primary" @click="addUpdate" />
		</view>
		<button v-else class="login" hover-class="none" type="primary" @click="login">Login to check events</button>
	</view>
</template>

<script>
	import ZzxCalendar from "@/components/zzx-calendar/zzx-calendar.vue"
	import EventDetailSection from '../../single/event-detail-section.vue'
	import TextPlaceholder from '../../single/text-placeholder.vue'
	
	import Network from 'common/Network.js'
	import { mapState } from 'vuex'

	export default {
		data() {
			return {
				startY: 0,
				unfold: false,
				canUnfold: true,
				updates: null,
				prompt: "",
				date: (new Date()).format("yyyy-MM-dd")
			}
		},
		methods: {
			onPageScroll(e) {
				if (e.scrollTop < 5) {
					this.canUnfold = true;
				} else {
					this.canUnfold = false;
				}
			},
			touchStart(e) {
				this.startY = e.touches[0].pageY;
			},
			touchMove(e) {
				let sy = e.touches[0].pageY;
				if (this.startY - sy < 5 && this.canUnfold) {
					this.unfold = true;
				}
				if (this.startY - sy > -5 && this.unfold) {
					this.unfold = false
				}
			},
			dateChanged(value) {
				this.date = value.fullDate
				this.fetchUpdates()
			},
			login() {
				uni.navigateTo({
					url: "../login/login"
				})
			},
			addUpdate() {
				uni.navigateTo({
					url: `../update/update?date=${this.date}`
				})
			},
			async fetchUpdates() {
				if (!this.user) return
				uni.showLoading({
					title: "loading...",
					mask: true
				})
				const network = new Network("/v1/updates", "get", {
					date: this.date
				})
				const [, { statusCode, data: response } = {}] = await network.request()
				uni.hideLoading()
				if (statusCode === 200) {
					this.updates = response.data
					this.prompt = this.updates.length ? "" : "no data"
				} else {
					this.updates = null
					this.prompt = "Load data failed. Please try again."
				}
			}
		},
		mounted() {
			this.fetchUpdates()
			uni.$on('addUpdate', () => {
				this.fetchUpdates()
			})
			uni.$on('changeUpdate', () => {
				this.fetchUpdates()
			})
			uni.$on('deleteUpdate', () => {
				this.fetchUpdates()
			})
			uni.$on('exchange', () => {
				this.fetchUpdates()
			})
		},
		watch: {
			user() { this.fetchUpdates() }
		},
		computed: {
			...mapState({ user: state => state.user })
		},
		components: {
			ZzxCalendar, 
			EventDetailSection,
			TextPlaceholder
		}
	}
</script>

<style lang="scss" scoped>
	
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
