package com.restaurantsetup.service;

import com.restaurantsetup.Util.MenuItemStatus;
import com.restaurantsetup.dto.MenuItemRequest;
import com.restaurantsetup.dto.MenuItemResponse;
import com.restaurantsetup.entity.MenuItem;
import com.restaurantsetup.exception.ResourceNotFoundException;
import com.restaurantsetup.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemService {

    @Autowired
    MenuItemRepository menuItemRepository;

    // getMenuItemById
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found with id: " + id));
        return convertToResponseDTO(menuItem);
    }

    // getMenuItemByCategory
    public List<MenuItemResponse> getMenuItemsByCategory(String category) {
        List<MenuItem> menuItems = menuItemRepository.findByCategory(category);
        return menuItems.stream().filter(m -> m.getStatus().equals(MenuItemStatus.AVAILABLE.name()))
                .map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    // getAllMenuItems
    public List<MenuItemResponse> getAllMenuItems() {
        List<MenuItem> all = menuItemRepository.findAll();
        return all.stream().filter(m -> m.getStatus().equals(MenuItemStatus.AVAILABLE.name()))
                .map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    public MenuItemResponse createMenuItem(MenuItemRequest menuItemRequest) {
        if (menuItemRequest.price() == null || menuItemRequest.price() <= 0) {
            throw new IllegalArgumentException("Price must be provided and positive");
        }
        if (menuItemRequest.stock() == null || menuItemRequest.stock() < 0) {
            throw new IllegalArgumentException("Stock must be provided and non-negative");
        }
        MenuItem menuItem = new MenuItem();
        menuItem.setName(menuItemRequest.name());
        menuItem.setDescription(menuItemRequest.description());
        menuItem.setPrice(menuItemRequest.price());
        menuItem.setCategory(menuItemRequest.category());
        menuItem.setStock(menuItemRequest.stock());
        menuItem.setStatus(
                menuItemRequest.stock() <= 0 ? MenuItemStatus.UNAVAILABLE.name() : MenuItemStatus.AVAILABLE.name());
        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return convertToResponseDTO(savedMenuItem);
    }

    // update a MenuItem
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest menuItemRequest) {
        MenuItem existingMenuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with id: " + id));
        if (menuItemRequest.price() == null || menuItemRequest.price() <= 0) {
            throw new IllegalArgumentException("Price must be provided and positive");
        }
        if (menuItemRequest.stock() == null || menuItemRequest.stock() < 0) {
            throw new IllegalArgumentException("Stock must be provided and non-negative");
        }
        existingMenuItem.setName(menuItemRequest.name());
        existingMenuItem.setDescription(menuItemRequest.description());
        existingMenuItem.setPrice(menuItemRequest.price());
        existingMenuItem.setCategory(menuItemRequest.category());
        existingMenuItem.setStock(menuItemRequest.stock());
        existingMenuItem.setStatus(
                menuItemRequest.stock() <= 0 ? MenuItemStatus.UNAVAILABLE.name() : MenuItemStatus.AVAILABLE.name());
        MenuItem updatedMenuItem = menuItemRepository.save(existingMenuItem);
        return convertToResponseDTO(updatedMenuItem);
    }

    // Delete a MenuItem
    public void deleteMenuItem(Long id) {
        MenuItem existingMenuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found with id: " + id));
        menuItemRepository.delete(existingMenuItem);
    }

    // Find menuTtems by status
    public List<MenuItemResponse> getMenuItemsByStatus(String status) {
        List<MenuItem> menuItemsByStatus = menuItemRepository.findMenuItemsByStatus(status);
        return menuItemsByStatus.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    // Conversion method to Response
    private MenuItemResponse convertToResponseDTO(MenuItem menuItem) {
        return new MenuItemResponse(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.getCategory(),
                menuItem.getStock());
    }
}
