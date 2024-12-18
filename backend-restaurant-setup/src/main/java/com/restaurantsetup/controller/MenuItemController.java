package com.restaurantsetup.controller;

import com.restaurantsetup.dto.MenuItemRequest;
import com.restaurantsetup.dto.MenuItemResponse;
import com.restaurantsetup.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menuItems")
@PreAuthorize("hasRole('ROLE_MANAGER')")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @GetMapping("")
    public ResponseEntity<List<MenuItemResponse>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemResponse> getMenuItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(id));
    }

    @GetMapping("/categories/{category}")
    public ResponseEntity<List<MenuItemResponse>> getMenuItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(menuItemService.getMenuItemsByCategory(category));
    }

    @PostMapping("/create")
    public ResponseEntity<MenuItemResponse> createMenuItem(@RequestBody MenuItemRequest menuItemRequest) {
        System.out.println("menuitem: " + menuItemRequest.name() + menuItemRequest.price());
        return new ResponseEntity<>(menuItemService.createMenuItem(menuItemRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItemResponse> editMenuItem(@PathVariable Long id,
            @RequestBody MenuItemRequest menuItemRequest) {
        return new ResponseEntity<>(menuItemService.updateMenuItem(id, menuItemRequest), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok("MenuItem with ID " + id + "has been successfully deleted!");
    }
}
