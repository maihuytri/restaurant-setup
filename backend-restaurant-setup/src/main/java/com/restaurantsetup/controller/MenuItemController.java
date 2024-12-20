package com.restaurantsetup.controller;

import com.restaurantsetup.dto.APIResponse;
import com.restaurantsetup.dto.MenuItemRequest;
import com.restaurantsetup.dto.MenuItemResponse;
import com.restaurantsetup.dto.OrderResponse;
import com.restaurantsetup.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menuItems")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_CUSTOMER')")
    @GetMapping("")
    public ResponseEntity<List<MenuItemResponse>> getAllMenuItems(@RequestParam(required = false) String category) {
        if (category == null || category.isEmpty() || category.equals("All"))
            return ResponseEntity.ok(menuItemService.getAllMenuItems());
        return ResponseEntity.ok(menuItemService.getMenuItemsByCategory(category));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<MenuItemResponse> getMenuItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(id));
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @GetMapping("/categories/{category}")
    public ResponseEntity<List<MenuItemResponse>> getMenuItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(menuItemService.getMenuItemsByCategory(category));
    }

    @GetMapping("/{status}")
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    public ResponseEntity<List<MenuItemResponse>> getMenuItemsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(menuItemService.getMenuItemsByStatus(status));
    }


    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping("/create")
    public ResponseEntity<APIResponse> createMenuItem(@RequestBody MenuItemRequest menuItemRequest) {
        APIResponse response = new APIResponse();
        try {
            MenuItemResponse menuItemResponse = menuItemService.createMenuItem(menuItemRequest);
            response.setErrorCode(200);
            response.setMessage("MenuItem created successfully");
            response.setData(menuItemResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setErrorCode(500);
            response.setMessage("Failed to create menuItem: " + e.getMessage());
            response.setData(null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse> editMenuItem(@PathVariable Long id, @RequestBody MenuItemRequest menuItemRequest) {
        APIResponse response = new APIResponse();
        try {
            MenuItemResponse menuItemResponse = menuItemService.updateMenuItem(id, menuItemRequest);
            response.setErrorCode(200);
            response.setMessage("MenuItem updated successfully");
            response.setData(menuItemResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setErrorCode(500);
            response.setMessage("Failed to update menuItem: " + e.getMessage());
            response.setData(null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok("MenuItem with ID " + id + "has been successfully deleted!");
    }
}
