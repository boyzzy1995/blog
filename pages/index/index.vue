<template>
    <view class="z-container">
        <view class="uni-tab-bar">
            <!--滚动条的导航栏-->
            <scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
                <view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
                    :id="tab.id" :data-current="index" @click="tapTab">{{tab.name}}</view>
            </scroll-view>
            <!--内容列表-->
            <swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab">
                <swiper-item v-for="(tab,index1) in newsitems" :key="index1">
                    <scroll-view class="list" scroll-y @scrolltolower="loadMore(index1)">
                        <block v-for="(newsitem,index2) in tab.data" :key="index2">
                            <media-list :options="newsitem" @close="close(index1,index2)" @click="goDetail(newsitem)"></media-list>
                        </block>
                        <view class="uni-tab-bar-loading">
                            {{tab.loadingText}}
                        </view>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>
<script>
    import mediaList from '@/components/tab-nvue/mediaList.vue';
    export default {
        components: {
            mediaList
        },
        data() {
            return {
                scrollLeft: 0,
                isClickChange: false,
                tabIndex: 0,
                newsitems: [],
                articleList: [],
                tabBars: []
            }
        },
        onLoad() {
            this.loadInfo();
        },
        methods: {
            loadInfo() { //加载内容
                let data = require('../../static/index.json');
                uni.showLoading({
                    title: '加载中'
                })
                setTimeout(() => { //模拟http请求
                    uni.hideLoading();
                    this.articleList = data.data.articleList;
                    this.tabBars = data.data.tabBarList;
                    this.newsitems = this.randomfn();
                }, 1000)
            },
            goDetail(e) { //到文章详情页
                uni.navigateTo({
                    url: '/pages/index/detail/detail?title=' + e.title
                });
            },
            loadMore(e) { //拉到底部的加载更多
                setTimeout(() => {
                    this.addData(e);
                }, 1000);
            },
            addData(e) {
                let article_length = this.articleList.length;
                if (this.newsitems[e].data.length > 30) { //如果当前数组里的长度大于30则不再添加
                    this.newsitems[e].loadingText = '没有更多了';
                    return;
                }
                for (let i = 1; i <= 10; i++) { //否则继续添加
                    this.newsitems[e].data.push(this.articleList[Math.floor(Math.random() * article_length)]);
                }
            },
            async changeTab(e) { //滚动切换文章列表和tabBar列表
                let index = e.target.current;
                if (this.newsitems[index].data.length === 0) {
                    this.addData(index)
                }
                if (this.isClickChange) {
                    this.tabIndex = index;
                    this.isClickChange = false;
                    return;
                }
                let tabBar = await this.getElSize("tab-bar"),
                    tabBarScrollLeft = tabBar.scrollLeft;
                let width = 0;

                for (let i = 0; i < index; i++) {
                    let result = await this.getElSize(this.tabBars[i].id);
                    width += result.width;
                }
                let winWidth = uni.getSystemInfoSync().windowWidth,
                    nowElement = await this.getElSize(this.tabBars[index].id),
                    nowWidth = nowElement.width;
                if (width + nowWidth - tabBarScrollLeft > winWidth) {
                    this.scrollLeft = width + nowWidth - winWidth;
                }
                if (width < tabBarScrollLeft) {
                    this.scrollLeft = width;
                }
                this.isClickChange = false;
                this.tabIndex = index; //一旦访问data就会出问题
            },
            getElSize(id) { //得到元素的size
                return new Promise((res, rej) => {
                    uni.createSelectorQuery().select("#" + id).fields({
                        size: true,
                        scrollOffset: true
                    }, (data) => {
                        res(data);
                    }).exec();
                })
            },
            async tapTab(e) { //点击tab-bar
                let tabIndex = e.target.dataset.current;
                if (this.newsitems[tabIndex].data.length === 0) {
                    this.addData(tabIndex)
                }
                if (this.tabIndex === tabIndex) {
                    return false;
                } else {
                    let tabBar = await this.getElSize("tab-bar"),
                        tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
                    this.scrollLeft = tabBarScrollLeft;
                    this.isClickChange = true;
                    this.tabIndex = tabIndex;
                }
            },
            randomfn() { //为文章列表添加文章
                let ary = [];
                let article_length = this.articleList.length; //文章列表的长度
                for (let i = 0, length = this.tabBars.length; i < length; i++) {
                    let aryItem = {
                        loadingText: '加载更多...',
                        data: []
                    };
                    if (i < 1) {
                        for (let j = 1; j <= 10; j++) { //循环为'关注'数组里添加文章列表
                            aryItem.data.push(this.articleList[Math.floor(Math.random() * article_length)]);
                        }
                    }
                    ary.push(aryItem);
                }
                return ary;
            }
        }
    }
</script>

<style>
    .z-container {
        height: 100%;
        background: #fff;
    }

    .status_bar {
        height: var(--status-bar-height);
        width: 100%;
        background-color: #F8F8F8;
    }

    .top_view {
        height: var(--status-bar-height);
        width: 100%;
        position: fixed;
        background-color: #F8F8F8;
        top: 0;
        z-index: 999;
    }

    .uni-tab-bar-loading {
        text-align: center;
        font-size: 28upx;
        color: #999;
    }
</style>
