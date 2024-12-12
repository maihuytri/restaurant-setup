package com.restaurantsetup.service;

import com.restaurantsetup.dto.MenuItemRequest;
import com.restaurantsetup.dto.MenuItemResponse;
import com.restaurantsetup.entity.MenuItem;
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
    public List<MenuItemResponse> getMenuItemByCategory(String category) {
        List<MenuItem> menuItems = menuItemRepository.findByCategory(category);
        return menuItems.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    //getAllMenuItems
    public List<MenuItemResponse> getAllMenuItems() {
        List<MenuItem> all = menuItemRepository.findAll();
        return all.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }
    //create a menuItem
    public MenuItemResponse createMenuItem(MenuItemRequest menuItemRequest) {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(menuItemRequest.name());
        menuItem.setDescription(menuItemRequest.description());
        menuItem.setPrice(menuItemRequest.price());
        menuItem.setCategory(menuItemRequest.category());
        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return convertToResponseDTO(savedMenuItem);
    }

    //update a MenuItem
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest menuItemRequest) {
        MenuItem existingMenuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found with id: " + id));
        existingMenuItem.setName(menuItemRequest.name());
        existingMenuItem.setDescription(menuItemRequest.description());
        existingMenuItem.setPrice(menuItemRequest.price());
        existingMenuItem.setCategory(menuItemRequest.category());
        MenuItem updatedMenuItem = menuItemRepository.save(existingMenuItem);
        return convertToResponseDTO(updatedMenuItem);
    }

    //Delete a MenuItem
    public void deleteMenuItem(Long id) {
        MenuItem existingMenuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found with id: " + id));
        menuItemRepository.deleteById(id);
    }

    // Conversion method to Response
    private MenuItemResponse convertToResponseDTO(MenuItem menuItem) {
        return new MenuItemResponse(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.getCategory()
        );
    }
}
