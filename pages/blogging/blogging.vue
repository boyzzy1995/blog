<template>
    <view>
        <web-view :src="webUrl"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                params: {}
            }
        },
        onLoad(params) {
            this.params = params; //参数
        },
        computed: {
            webUrl: function() {
                let http = this.$http.WEBURL; //加载H5的地址
                let category = this.params.category;
                return `${http}h5-blog/pages/blogging/blogging.html?category=${category}`;
            }
        }
    }
</script>

<style>

</style>
