let mv = new Vue({
    el: '#app',
    data: {
        formData: {
            title: '', //标题
            richText: '', //富文本
            text: '', //文本
            pictures: [] //图片数组
        }
    },
    computed: {
        fontCount() { //计算字的数量
            let _formData = this.formData;
            _formData.text = this.pharaSplice(_formData.richText);
            return _formData.title.length + _formData.text.length;
        },
        category() {
            let category = decodeURI(getUrlParam('category'));
            return category;
        }
    },
    methods: {
        pharaSplice(contents) { //只保留文字
            let str = contents
                .replace(/\s+/, '') //将多个空字符换成一个空格
                .replace(/<br\s*?\/?>/, '') //将所有换行符替换成一个字符(不用\n是因为可能会被后面换掉)
                .replace(/(<\/p>)/, '') //为所有段落添加一个字符(或两个字符，自己定)将点放在前面避免影响后面的替换
                .replace(/<\/.+?>\s*<[^\/]>/g, '') //去掉所有尾-首相连的HTML标签(包括中间的空字符)
                .replace(/<.+?>/g, '') //去掉剩下的HTML标签
                .replace(/&.+?;/g, ''); //转换所有实体为一个字符
            return str;
        },
        judgeForm() { //验证表单
            if (this.formData.title === '') {
                showWarnToast('请输入标题');
                return false;
            }
            if (this.formData.text === '' && this.formData.pictures.length === 0) {
                showWarnToast('请输入内容');
                return false;
            }
            return true;
        },
        sumbit() {
            let array_pic = document.getElementsByTagName('img');
            for (let i = 0; i < array_pic.length; i++) { //取出图片的base64
                this.formData.pictures.push(array_pic[i].src);
            }
            if(this.judgeForm()) { //判断表单
                loadingTost('show', '加载中');
                setTimeout(() => {
                    loadingTost('hide');
                    Toast('发布成功');
                }, 1000)
            }
            console.log(this.formData);
        }
    },
    mounted() {
        
    }
})
$(document).ready(function() {
    let textarea = document.getElementById('textarea');
    makeExpandingArea(textarea); //使textArea能够自适应
    $('#summernote').summernote({ //加载富文本编辑器
        height: null, // set editor height
        minHeight: null, // set minimum height of editor
        maxHeight: null, // set maximum height of editor
        focus: false, // set focus to editable area after initializin
        placeholder: '请输入内容',
        lang: 'zh-CN', // default: 'en-US'
        dialogsFade: true,
        callbacks: {
            onChange: function(contents) { //监听输入
                mv.formData.richText = contents;
            }
        }
    });
});
