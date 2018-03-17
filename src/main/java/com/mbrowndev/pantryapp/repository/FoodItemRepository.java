package com.mbrowndev.pantryapp.repository;

import com.mbrowndev.pantryapp.domain.Category;
import com.mbrowndev.pantryapp.domain.FoodItem;
import com.mbrowndev.pantryapp.domain.User;

import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data JPA repository for the FoodItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    @Query("select food_item from FoodItem food_item where food_item.user.login = ?#{principal.username} order by food_item.expiration asc")
    List<FoodItem> findByUserIsCurrentUser();

    @Query("select food_item from FoodItem food_item where food_item.user.login = ?#{principal.username} and food_item.category = :category order by food_item.expiration asc")
    List<FoodItem> findByUserIsCurrentUserAndCategory(@Param("category") Category category);
    
    @Query("select food_item from FoodItem food_item where food_item.user.login = ?#{principal.username} and food_item.expiration <= :expiration order by food_item.expiration asc")
    List<FoodItem> findByUserIsCurrentUserAndExpirationLessThanDate(@Param("expiration") ZonedDateTime expiration);
    
    @Query("select food_item from FoodItem food_item where food_item.user.login = ?#{principal.username} and food_item.category = :category and food_item.expiration <= :expiration order by food_item.expiration asc")
    List<FoodItem> findByUserIsCurrentUserAndCategoryAndExpirationLessThanDate(@Param("category") Category category, @Param("expiration") ZonedDateTime expiration);
}
