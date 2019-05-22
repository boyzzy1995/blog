<template>
    <view class="container">
        <view class="page-body">
            <!--导航栏左侧-->
            <scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
                <view class="nav-left-item" @click="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'active':''"
                    v-for="(item,index) in categoryList">
                    {{item.NAME}}
                </view>
            </scroll-view>
            <!--导航栏右侧-->
            <scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'"
                scroll-with-animation>
                <view class="nav-right-item" :id="index===0?'first':''" v-for="(item,index) in subCategoryList" :key="index"
                    @click="toDetail(item.NAME)">
                    <view>{{item.NAME}}</view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                categoryList: [], //分类数组
                subCategoryList: [], //子分类
                height: 0,
                categoryActive: 0, //当前选中的分类
                scrollTop: 0,
                scrollHeight: 0
            }
        },
        methods: {
            loadInfo() { //加载分类信息
                let data = require('../../../static/category.json');
                uni.showLoading({
                    title: '加载中'
                })
                setTimeout(() => { //模拟http请求
                    uni.hideLoading();
                    this.categoryList = data.data.categoryList;
                    this.getCategory();
                }, 100)
            },
            scroll(e) { //滚动
                this.scrollHeight = e.detail.scrollHeight;
            },
            categoryClickMain(categroy, index) { //选中主分类
                this.categoryActive = index;
                this.subCategoryList = categroy.subCategoryList;
                this.scrollTop = -this.scrollHeight * index;
            },
            getCategory() { //获得子分类
                this.subCategoryList = this.categoryList[0].subCategoryList;
            },
            toDetail(subCategoryName) { //选中子分类
                let categoryName = this.categoryList[this.categoryActive].NAME; //主分类名称
                uni.navigateTo({
                    url: '/pages/blogging/blogging?category=' + categoryName + '-' + subCategoryName
                })
            }
        },
        onLoad: function() {
            this.loadInfo();
            this.height = uni.getSystemInfoSync().windowHeight;
        }
    }
</script>

<style>
    .page-body {
        display: flex;
    }

    .nav {
        display: flex;
        width: 100%;
    }

    .nav-left {
        width: 40%;
    }

    .nav-left-item {
        height: 80upx;
        border-right: solid 1px #E0E0E0;
        border-bottom: solid 1px #E0E0E0;
        font-size: 24upx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F5F5F5;
    }

    .nav-right {
        width: 70%;
        background: #fff;
    }

    .nav-right-item {
        width: 100%;
        height: 80upx;
        float: left;
        text-align: left;
        display: flex;
        align-items: center;
        padding: 0 30upx;
        font-size: 24upx;
    }

    .nav-right-item image {
        width: 100upx;
        height: 100upx;
    }

    .active {
        /* color: #007AFF; */
        background: #fff;
        border-right: 0;
    }
</style>
