package com.restaurantsetup.repository;

import com.restaurantsetup.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategory(String category);

    Optional<MenuItem> findMenuItemByName(String name);

    List<MenuItem> findMenuItemsByStatus(String status);

    List<MenuItem> findMenuItemsByCategoryAndStatus(String name, String status);
}
