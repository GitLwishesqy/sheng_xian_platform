package com.sx.user.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.sx.common.result.R;
import com.sx.user.entity.PickupPoint;
import com.sx.user.mapper.PickupPointMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "自提点")
@RestController
@RequestMapping("/api/v1/pickup-point")
public class PickupPointController {

    private final PickupPointMapper pickupPointMapper;

    public PickupPointController(PickupPointMapper pickupPointMapper) {
        this.pickupPointMapper = pickupPointMapper;
    }

    @Operation(summary = "自提点列表")
    @GetMapping("/list")
    public R<List<PickupPoint>> list() {
        List<PickupPoint> list = pickupPointMapper.selectList(
                new LambdaQueryWrapper<PickupPoint>()
                        .eq(PickupPoint::getStatus, 1)
                        .orderByAsc(PickupPoint::getSort));
        return R.ok(list);
    }
}
