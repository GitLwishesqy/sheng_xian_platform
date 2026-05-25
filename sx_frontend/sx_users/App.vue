<script>
export default {
    onLaunch: function() {
        console.log('App Launch')
        // 检查登录状态
        const token = uni.getStorageSync('token')
        if (token) {
            console.log('已登录')
        }
    },
    onShow: function() {
        console.log('App Show')
    },
    onHide: function() {
        console.log('App Hide')
    }
}
</script>

<style lang="scss">
/* 全局样式 */
page {
    background-color: #f5f5f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 28rpx;
    color: #333333;
}

/* 通用按钮 */
.btn-primary {
    background-color: #07c160;
    color: #ffffff;
    border: none;
    border-radius: 8rpx;
    padding: 16rpx 32rpx;
    font-size: 30rpx;
    text-align: center;
}

.btn-primary:active {
    opacity: 0.8;
}

/* 安全区域 */
.safe-area-bottom {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}

/* 一行省略 */
.text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 两行省略 */
.text-ellipsis-2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

/* Flex 快捷类 */
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-wrap { flex-wrap: wrap; }
.flex-1 { flex: 1; }
</style>
