-- ===================================================
-- 生鲜平台 — 数据库初始化脚本
-- 创建日期: 2026-05-19
-- ===================================================

-- 1. 创建数据库
DROP DATABASE IF EXISTS `sheng_xian`;
CREATE DATABASE `sheng_xian`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;
USE `sheng_xian`;

-- ===================================================
-- 2. 用户与地址模块
-- ===================================================

CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `openid` VARCHAR(64) COMMENT '微信openid',
    `unionid` VARCHAR(64) COMMENT '微信unionid（多端互通）',
    `nickname` VARCHAR(64) COMMENT '昵称',
    `avatar` VARCHAR(512) COMMENT '头像URL',
    `phone` VARCHAR(20) COMMENT '手机号',
    `gender` TINYINT DEFAULT 0 COMMENT '性别 0未知 1男 2女',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0禁用 1正常',
    `last_login_time` DATETIME COMMENT '最后登录时间',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除 0未删 1已删',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_openid` (`openid`),
    KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE `user_address` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `receiver_name` VARCHAR(32) NOT NULL COMMENT '收货人姓名',
    `receiver_phone` VARCHAR(20) NOT NULL COMMENT '收货人电话',
    `province` VARCHAR(32) NOT NULL COMMENT '省',
    `city` VARCHAR(32) NOT NULL COMMENT '市',
    `district` VARCHAR(32) NOT NULL COMMENT '区',
    `detail_address` VARCHAR(255) NOT NULL COMMENT '详细地址',
    `lat` DECIMAL(10,6) COMMENT '纬度',
    `lng` DECIMAL(10,6) COMMENT '经度',
    `is_default` TINYINT DEFAULT 0 COMMENT '是否默认 0否 1是',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收货地址表';

CREATE TABLE `pickup_point` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL COMMENT '自提点名称',
    `address` VARCHAR(255) NOT NULL COMMENT '详细地址',
    `lat` DECIMAL(10,6) COMMENT '纬度',
    `lng` DECIMAL(10,6) COMMENT '经度',
    `phone` VARCHAR(20) COMMENT '联系电话',
    `business_hours` VARCHAR(64) COMMENT '营业时间',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0停用 1启用',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='自提点表';

-- ===================================================
-- 3. 商品模块
-- ===================================================

CREATE TABLE `category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL COMMENT '分类名称',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父分类ID，0为顶级',
    `icon` VARCHAR(512) COMMENT '分类图标',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0隐藏 1显示',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

CREATE TABLE `product` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `category_id` BIGINT NOT NULL COMMENT '分类ID',
    `name` VARCHAR(128) NOT NULL COMMENT '商品名称',
    `subtitle` VARCHAR(256) COMMENT '副标题/卖点',
    `cover_image` VARCHAR(512) COMMENT '封面图',
    `images` JSON COMMENT '商品图片列表',
    `detail` LONGTEXT COMMENT '商品详情(富文本)',
    `unit` VARCHAR(16) NOT NULL DEFAULT '份' COMMENT '计量单位',
    `price` DECIMAL(10,2) NOT NULL COMMENT '售价',
    `original_price` DECIMAL(10,2) COMMENT '原价/划线价',
    `cost_price` DECIMAL(10,2) COMMENT '成本价',
    `stock` INT DEFAULT 0 COMMENT '库存',
    `sales` INT DEFAULT 0 COMMENT '销量',
    `weight` DECIMAL(10,2) COMMENT '重量(克)',
    `shelf_life` INT COMMENT '保质期(天)',
    `storage_condition` VARCHAR(64) COMMENT '存储条件(冷藏/冷冻/常温)',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0下架 1上架',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_status_sort` (`status`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

CREATE TABLE `product_sku` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL COMMENT '商品ID',
    `spec_name` VARCHAR(64) COMMENT '规格名称(如"重量")',
    `spec_value` VARCHAR(64) COMMENT '规格值(如"500g")',
    `price` DECIMAL(10,2) NOT NULL COMMENT 'SKU价格',
    `stock` INT DEFAULT 0 COMMENT 'SKU库存',
    `sku_code` VARCHAR(64) COMMENT '商家自定义编码',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品SKU表';

CREATE TABLE `product_review` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `order_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `rating` TINYINT NOT NULL COMMENT '评分 1-5',
    `content` VARCHAR(512) COMMENT '评价内容',
    `images` JSON COMMENT '评价图片',
    `reply` VARCHAR(512) COMMENT '商家回复',
    `reply_time` DATETIME COMMENT '回复时间',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_product_id` (`product_id`),
    KEY `idx_user_order` (`user_id`, `order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价表';

-- ===================================================
-- 4. 购物车模块
-- ===================================================

CREATE TABLE `cart_item` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `product_id` BIGINT NOT NULL COMMENT '商品ID',
    `sku_id` BIGINT COMMENT 'SKU ID(可为空)',
    `quantity` INT NOT NULL DEFAULT 1 COMMENT '数量',
    `selected` TINYINT DEFAULT 1 COMMENT '是否选中 0否 1是',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_product_sku` (`user_id`, `product_id`, `sku_id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- ===================================================
-- 5. 订单模块
-- ===================================================

CREATE TABLE `order` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `delivery_type` TINYINT NOT NULL COMMENT '配送方式 1配送到家 2到店自提',
    `address_id` BIGINT COMMENT '收货地址ID(配送到家时必填)',
    `pickup_point_id` BIGINT COMMENT '自提点ID(到店自提时必填)',
    `address_snapshot` JSON COMMENT '收货地址快照(JSON)',
    `total_amount` DECIMAL(10,2) NOT NULL COMMENT '商品总价',
    `delivery_fee` DECIMAL(10,2) DEFAULT 0.00 COMMENT '配送费',
    `discount_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
    `pay_amount` DECIMAL(10,2) NOT NULL COMMENT '实付金额',
    `order_status` TINYINT NOT NULL DEFAULT 1 COMMENT '1待付款 2待发货/待备货 3已发货/待取货 4已签收/已取货 5已完成 6已取消 7退款中 8已退款',
    `payment_status` TINYINT DEFAULT 0 COMMENT '支付状态 0未支付 1已支付 2已退款',
    `payment_method` TINYINT COMMENT '支付方式 1微信支付 2支付宝',
    `payment_time` DATETIME COMMENT '支付时间',
    `delivery_time` DATETIME COMMENT '发货时间/备货完成时间',
    `receive_time` DATETIME COMMENT '签收时间/取货时间',
    `complete_time` DATETIME COMMENT '订单完成时间(自动确认收货)',
    `cancel_time` DATETIME COMMENT '取消时间',
    `remark` VARCHAR(512) COMMENT '用户备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_order_no` (`order_no`),
    KEY `idx_user_id_status` (`user_id`, `order_status`),
    KEY `idx_status_time` (`order_status`, `create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

CREATE TABLE `order_item` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL COMMENT '订单ID',
    `product_id` BIGINT NOT NULL COMMENT '商品ID',
    `sku_id` BIGINT COMMENT 'SKU ID',
    `product_name` VARCHAR(128) NOT NULL COMMENT '商品名称(快照)',
    `product_image` VARCHAR(512) COMMENT '商品图片(快照)',
    `spec_info` VARCHAR(128) COMMENT '规格信息(快照)',
    `price` DECIMAL(10,2) NOT NULL COMMENT '下单时单价',
    `quantity` INT NOT NULL COMMENT '数量',
    `total_amount` DECIMAL(10,2) NOT NULL COMMENT '小计',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

CREATE TABLE `order_status_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `from_status` TINYINT COMMENT '变更前状态',
    `to_status` TINYINT NOT NULL COMMENT '变更后状态',
    `operator` VARCHAR(64) COMMENT '操作人',
    `remark` VARCHAR(256) COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单状态日志表';

-- ===================================================
-- 6. 支付模块
-- ===================================================

CREATE TABLE `payment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `payment_no` VARCHAR(64) NOT NULL COMMENT '支付流水号',
    `transaction_id` VARCHAR(64) COMMENT '第三方交易号(微信/支付宝)',
    `amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    `method` TINYINT NOT NULL COMMENT '支付方式 1微信 2支付宝',
    `status` TINYINT DEFAULT 0 COMMENT '0待支付 1支付成功 2支付失败',
    `pay_time` DATETIME COMMENT '支付完成时间',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_payment_no` (`payment_no`),
    KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录表';

CREATE TABLE `order_refund` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL,
    `refund_no` VARCHAR(64) NOT NULL COMMENT '退款单号',
    `amount` DECIMAL(10,2) NOT NULL COMMENT '退款金额',
    `reason` VARCHAR(512) COMMENT '退款原因',
    `status` TINYINT DEFAULT 1 COMMENT '1待处理 2已同意 3已拒绝 4退款成功',
    `handle_time` DATETIME COMMENT '处理时间',
    `handle_remark` VARCHAR(512) COMMENT '处理备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='退款记录表';

-- ===================================================
-- 7. 营销模块
-- ===================================================

CREATE TABLE `banner` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(64) COMMENT '标题',
    `image` VARCHAR(512) NOT NULL COMMENT '图片URL',
    `link_type` TINYINT DEFAULT 0 COMMENT '链接类型 0无 1商品 2分类 3自定义URL',
    `link_value` VARCHAR(256) COMMENT '链接值(商品ID/分类ID/URL)',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0禁用 1启用',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

CREATE TABLE `coupon` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL COMMENT '优惠券名称',
    `type` TINYINT NOT NULL COMMENT '类型 1满减券 2折扣券 3现金券',
    `discount_value` DECIMAL(10,2) NOT NULL COMMENT '优惠值(满减金额/折扣率/现金金额)',
    `min_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '使用门槛(最低消费金额)',
    `total_count` INT NOT NULL COMMENT '发放总量',
    `received_count` INT DEFAULT 0 COMMENT '已领取数量',
    `per_user_limit` INT DEFAULT 1 COMMENT '每人限领',
    `start_time` DATETIME NOT NULL COMMENT '有效期开始',
    `end_time` DATETIME NOT NULL COMMENT '有效期结束',
    `status` TINYINT DEFAULT 1 COMMENT '状态 0禁用 1启用',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券表';

CREATE TABLE `user_coupon` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `coupon_id` BIGINT NOT NULL,
    `status` TINYINT DEFAULT 1 COMMENT '1未使用 2已使用 3已过期',
    `order_id` BIGINT COMMENT '使用的订单ID',
    `used_time` DATETIME COMMENT '使用时间',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_status` (`user_id`, `status`),
    KEY `idx_coupon_id` (`coupon_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';

-- ===================================================
-- 8. 系统管理模块 (RBAC)
-- ===================================================

CREATE TABLE `sys_user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(64) NOT NULL COMMENT '用户名',
    `password` VARCHAR(128) NOT NULL COMMENT '密码(BCrypt)',
    `nickname` VARCHAR(64) COMMENT '姓名',
    `avatar` VARCHAR(512) COMMENT '头像',
    `phone` VARCHAR(20) COMMENT '手机号',
    `status` TINYINT DEFAULT 1 COMMENT '0禁用 1正常',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='后台用户表';

CREATE TABLE `sys_role` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL COMMENT '角色名称',
    `code` VARCHAR(32) NOT NULL COMMENT '角色编码',
    `remark` VARCHAR(256) COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

CREATE TABLE `sys_menu` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `parent_id` BIGINT DEFAULT 0,
    `name` VARCHAR(32) NOT NULL COMMENT '菜单名称',
    `type` TINYINT NOT NULL COMMENT '类型 1目录 2菜单 3按钮',
    `path` VARCHAR(128) COMMENT '路由路径',
    `component` VARCHAR(128) COMMENT '前端组件',
    `permission` VARCHAR(64) COMMENT '权限标识(如 product:add)',
    `icon` VARCHAR(64) COMMENT '图标',
    `sort` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '0禁用 1启用',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单权限表';

CREATE TABLE `sys_user_role` (
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

CREATE TABLE `sys_role_menu` (
    `role_id` BIGINT NOT NULL,
    `menu_id` BIGINT NOT NULL,
    PRIMARY KEY (`role_id`, `menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- ===================================================
-- 9. 插入初始化数据
-- ===================================================

-- 默认管理员 (密码: admin123, BCrypt加密)
INSERT INTO `sys_user` (`username`, `password`, `nickname`, `status`) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5Eh', '超级管理员', 1);

-- 默认角色
INSERT INTO `sys_role` (`name`, `code`, `remark`) VALUES
('超级管理员', 'ROLE_ADMIN', '拥有所有权限'),
('运营人员', 'ROLE_OPERATOR', '商品和订单管理权限'),
('客服', 'ROLE_CUSTOMER_SERVICE', '订单查看和用户服务权限');

-- 管理员关联角色
INSERT INTO `sys_user_role` (`user_id`, `role_id`) VALUES (1, 1);

-- 示例分类
INSERT INTO `category` (`name`, `parent_id`, `sort`, `status`) VALUES
('新鲜水果', 0, 1, 1),
('时令蔬菜', 0, 2, 1),
('肉禽蛋品', 0, 3, 1),
('海鲜水产', 0, 4, 1),
('乳品烘焙', 0, 5, 1),
('休闲零食', 0, 6, 1);

-- 示例自提点
INSERT INTO `pickup_point` (`name`, `address`, `phone`, `business_hours`, `status`) VALUES
('阳光花园店', 'XX市XX区阳光花园小区东门', '13800001001', '09:00-21:00', 1),
('万达广场店', 'XX市XX区万达广场B1层', '13800001002', '10:00-22:00', 1);

-- 示例轮播图（image字段填写实际可访问的图片URL）
INSERT INTO `banner` (`title`, `image`, `link_type`, `link_value`, `sort`, `status`) VALUES
('新鲜水果专场', '/static/images/banner/banner1.png', 2, '1', 1, 1),
('时令蔬菜推荐', '/static/images/banner/banner2.png', 2, '2', 2, 1),
('品质肉禽蛋品', '/static/images/banner/banner3.png', 2, '3', 3, 1);
