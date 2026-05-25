package com.sx;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan({
        "com.sx.user.mapper",
        "com.sx.product.mapper",
        "com.sx.order.mapper",
        "com.sx.cart.mapper",
        "com.sx.payment.mapper",
        "com.sx.marketing.mapper",
        "com.sx.system.mapper"
})
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
