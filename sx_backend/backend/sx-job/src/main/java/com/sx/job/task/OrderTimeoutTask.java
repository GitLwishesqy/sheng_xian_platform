package com.sx.job.task;

import com.sx.order.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OrderTimeoutTask {

    private static final Logger log = LoggerFactory.getLogger(OrderTimeoutTask.class);

    private final OrderService orderService;

    public OrderTimeoutTask(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * 每分钟扫描一次，取消超过30分钟未支付的订单
     */
    @Scheduled(cron = "0 */1 * * * ?")
    public void cancelTimeoutOrders() {
        try {
            int count = orderService.cancelTimeoutOrders();
            if (count > 0) {
                log.info("超时关单完成，本次取消 {} 笔订单", count);
            }
        } catch (Exception e) {
            log.error("超时关单任务异常", e);
        }
    }
}
