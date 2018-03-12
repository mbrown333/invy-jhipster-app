package com.mbrowndev.pantryapp.repository;

import com.mbrowndev.pantryapp.domain.Category;
import com.mbrowndev.pantryapp.domain.FoodItem;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the FoodItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    @Query("select food_item from FoodItem food_item where food_item.user.login = ?#{principal.username}")
    List<FoodItem> findByUserIsCurrentUser();

    List<FoodItem> findByCategory(Category category);
}
