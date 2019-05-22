<template>
    <view class="z-container">
        <!--文章的头部和内容-->
        <view class="uni-padding-wrap">
            <view class="z-content-title">Python3列表解析之任意迭代、表达式、条件和潜逃循环等特性详解</view>
            <view class="z-user-panel">
                <view class="z-user-top-panel">
                    <image src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png" class="z-user-avtar"></image>
                    <view class="z-user-name">诸葛孔明</view>
                    <button class="mini-btn z-btn-notice" size="mini">+ 关注</button>
                </view>
                <view class="z-user-bottom-panel">
                    <view class="small-font-size">阅读数2377</view>
                    <view class="small-font-size">2019-5-20 20:52</view>
                </view>
            </view>
            <uParse :content="article" @preview="preview" @navigate="navigate" class="z-panel" />
        </view>
        <view class="gray-line"></view>
        <!--评论内容-->
        <view class="uni-padding-wrap">
            <!-- 评论区 start -->
            <view class="uni-comment">
                <view class="z-comment-title">评论</view>
                <view class="uni-comment-list" v-for="(item, index) in commentList" :key="index">
                    <view class="uni-comment-face">
                        <image :src="item.avatar" mode="widthFix"></image>
                    </view>
                    <view class="uni-comment-body">
                        <view class="uni-comment-top">
                            <text>{{item.userName}}</text>
                        </view>
                        <view class="uni-comment-content">{{item.content}}</view>
                        <view class="uni-comment-date">
                            <text>{{item.dateTime}}</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 评论区 end -->
        </view>
        <!--评论和点赞-->
        <view class="z-bottom">
            <view class="z-count-view">评论<br>{{commentCount}}</view>
            <view class="z-label" @click="CommentBoxStateChange">想对他说点什么...</view>
            <view class="z-like-view" @click="tapLike">
                <image :src="likeSrc" class="z-like-icon"></image>
                <span class="z-count-like">{{likeCount}}</span>
            </view>
        </view>
        <!--隐藏的评论输入框-->
        <view class="mask" v-show="isShowCommentBox" @click="CommentBoxStateChange"></view>
        <view class="comment-box" v-show="isShowCommentBox">
            <textarea class="z-textarea" :focus="isShowCommentBox" v-model="comment"></textarea>
            <view class="z-sumbit-box">
                <button class="mini-btn z-btn" size="mini" @click="sumbitComment">发布</button>
            </view>
        </view>
    </view>
    </view>
</template>

<script>
    //本示例引用组件uParse forked from ：mpvue-wxparse

    import uParse from '../../../components/uParse/src/wxParse.vue'
    
    /**
     * 模拟的写好的文章
     */
    var htmlString =
        `<p>很多资讯页面，服务端返回的数据都是 markdown 字符串或 html 字符串，使用本模板可直接解析 html 为符合 uni-app 规范的富文本界面。下文为示例：</p>
    <p>HBuilderX堪称markdown书写编辑的最佳工具，本文简单介绍HBuilderX里markdown的使用技巧。更多详情请在HBuilderX里点菜单帮助-markdown语法帮助。</p>
    <p>markdown的标题是行首以#号开头，空格分割的，不同级别的标题，在HX里着色也不同。如下：</p>
    <h1>标题1</h1>
    <h2>标题2</h2>
    <h3>标题3</h3>
    <h4>标题4</h4>
    <h5>标题5</h5>
    <p>HBuilderX标题编辑技巧：</p>
    <ol>
    <li>Emmet快速输入：敲h2+Tab即可生成二级标题【同HTML里的emmet写法，不止标题，HX里所有可对应tag的markdown语法均支持emmet写法】。仅行首生效</li>
    <li>智能双击：双击#号可选中整个标题段落</li>
    <li>智能回车：行尾回车或行中Ctrl+Enter强制换行后会自动在下一行补#</li>
    <li>回车后再次按Tab可递进一层标题，再按Tab切换列表符</li>
    <li>在# 后回车，可上插一个空标题行【同word】，任意位置按Ctrl+Shift+Enter也可以</li>
    </ol>
    <ul>
    <li>折叠：点标题前的-号可折叠该标题段落，快捷键是Alt+-（展开折叠是Alt+=）</li>
    <li>折叠：多层折叠时折叠或展开子节点，快捷键是Alt+Shift+-或=</li>
    </ul>
    <p><strong>加粗</strong> 【快捷键：Ctrl+B，支持多光标；Emmet：b后敲Tab】</p>
    <p><em>倾斜</em>【Emmet：i后敲Tab；前后包围：选中文字按Ctrl+\是在选区两侧添加光标，可以继续输入_】</p>
    <p><del>删除线</del>【前后包围：选中文字按Ctrl+\是在选区两侧添加光标，可以继续输入~~，会在2侧同时输入】</p>
    <blockquote>
    <p>引用</p>
    </blockquote>
    <p><a href="https://dcloud.io">超链接</a></p>
    <p><img src="https://img-cdn-qiniu.dcloud.net.cn/newpage/images/logo4.png" alt="logo"></p>
    <p>=======================</p>
    <pre><code class="language-javascript">    var a = document; //代码</code></pre>`

    export default {
        components: {
            uParse
        },
        data() {
            return {
                article: htmlString,
                isShowCommentBox: false, //显示评论框的标志位
                commentList: [], //评论列表
                likeSrc: '../../../static/index/detail/like.png', //点赞的图片路径
                likeCount: 5, //点赞数量
                isBeenTap: false, //是否被点过赞的标志位
                comment: '' //评论
            }
        },
        onLoad() {
            this.loadInfo();
        },
        computed: {
            commentCount() { //计算评论数量
                return this.commentList.length;
            }
        },
        methods: {
            loadInfo() { //加载数据
                let data = require('../../../static/detail.json');
                uni.showLoading({
                    title: '加载中'
                })
                setTimeout(() => { //模拟http请求
                    uni.hideLoading();
                    this.commentList = data.data.commentList;
                }, 1000)
            },
            preview(src, e) { //查看文章的图片
                // do something
                console.log("src: " + src);
            },
            navigate(href, e) { //文章中的超链接
                // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
                console.log("href: " + href);
                uni.showModal({
                    content: "点击链接为：" + href,
                    showCancel: false
                })
            },
            CommentBoxStateChange() { //改变是否显示评论的状态
                this.isShowCommentBox = !this.isShowCommentBox;
            },
            tapLike() { //点赞
                if (this.isBeenTap) {
                    this.likeSrc = '../../../static/index/detail/like.png';
                    this.likeCount--;
                } else {
                    this.likeSrc = '../../../static/index/detail/like-tap.png';
                    this.likeCount++;
                }
                this.isBeenTap = !this.isBeenTap;
                // #ifdef APP-PLUS
                plus.ios.invoke(null, "AudioServicesPlaySystemSound", 1520); //ios的震动
                // #endif
            },
            sumbitComment() {
                if (this.comment === '') {
                    uni.showToast({
                        title: '请填写评论',
                        icon: 'none'
                    })
                } else {
                    uni.showToast({
                        title: '评论成功',
                        success: () => {
                            this.isShowCommentBox = false;
                        }
                    })
                }
            }
        },
        onNavigationBarButtonTap(e) { //分享和收藏按钮
            if (e.index === 0) {
                uni.share({
                    provider: "weixin",
                    scene: "WXSceneSession",
                    type: 1,
                    summary: "我正在使用HBuilderX开发APP，赶紧跟我一起来体验！",
                    success: function(res) {
                        console.log("success:" + JSON.stringify(res));
                    },
                    fail: function(err) {
                        console.log("fail:" + JSON.stringify(err));
                    }
                });
            } else {
                uni.showToast({
                    title: '收藏成功'
                })
            }
        }
    }
</script>

<style>
    @import url("../../../components/uParse/src/wxParse.css");

    .z-container {
        background: #fff;
        padding-bottom: 100upx;
    }
    
    .z-content-title {
        font-size: 40upx;
        line-height: normal;
        padding: 20upx 0;
    }
    
    .z-user-top-panel {
        display: flex;
        align-items: center;
        margin-bottom: 14upx;
    }
    
    .z-user-avtar {
        width: 60upx;
        height: 60upx;
        border-radius: 50%;
    }
    
    .z-user-name {
        margin-left: 20upx;
        font-size: 24upx;
    }
     
    .z-user-bottom-panel {
        display: flex;
        justify-content: space-between;
    }
    .small-font-size {
        font-size: 24upx;
        color: #666;
    }
    .z-comment-title {
        padding-top: 20upx;
        color: #ccc;
    }

    .gray-line {
        background: #eee;
        height: 18upx;
    }

    .z-panel {
        padding-bottom: 18upx;
    }

    .z-bottom {
        position: fixed;
        bottom: 0;
        height: 80upx;
        background: #fff;
        border-top: 1px solid #eee;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .z-count-view {
        height: 60upx;
        text-align: center;
        line-height: 1.4;
        color: #C8C7CC;
        font-size: 12px;
    }

    .z-label {
        width: 500upx;
        height: 60upx;
        border-radius: 5px;
        background: #f5f5f5;
        padding: 0 20upx;
        line-height: 60upx;
        color: #666;
    }

    .z-like-icon {
        width: 45upx;
        height: 45upx;
        margin-top: 10upx;
    }

    .z-count-like {
        float: right;
        line-height: 1.5;
        background: #eee;
        color: red;
        font-size: 10px;
        text-align: center;
        padding: 0px 5px;
        border-radius: 5px;
    }

    .mask {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: .6;
        background: #000000;
        z-index: 99;
    }

    .comment-box {
        position: fixed;
        bottom: 0;
        height: 300upx;
        background: #fff;
        width: 100%;
        border-radius: 10px 10px 0 0;
        border-top: 1px solid #eee;
        z-index: 999;
    }

    .z-textarea {
        width: calc(100% - 60upx);
        padding: 30upx;
        height: 170upx;
    }

    .z-btn {
        background-color: #CD5B45;
        border-radius: 50px;
        float: right;
        color: #fff;
    }
    
    .z-btn-notice {
        margin-right: 0;
        background: #32CD48;
        color: #fff;
        border: 0;
    }
    
    .z-sumbit-box {
        position: absolute;
        bottom: 20upx;
        right: 20upx;
    }

    .uni-comment-body text {
        font-size: 14px;
    }
</style>
