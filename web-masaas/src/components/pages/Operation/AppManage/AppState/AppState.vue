<template>
	<div class="appStatus">
		<div class="terraceInfo-item">
			<h1>应用的运行状态统计</h1>
			<p class="item">
				<label for="">接入的租户数:</label>
				<span>123</span>
			</p>
			<p class="item">
				<label for="">定义的模块数:</label>
				<span>456</span>
			</p>
			<p class="item">
				<label for="">资源数:</label>
				<span>789</span>
			</p>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name:'AppState'
}
</script>

<style lang="scss" scoped>
	.appStatus{
		width:80%;
		padding:50px;
		margin:0 auto;
		.terraceInfo-item{
			text-align:center;
			h1{
				line-height:50px;
			}
			.item{
				line-height:50px;
				font-size:20px;
			}
		}
	}
</style>
