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
//
//    @Query("select food_item from FoodItem food_item where food_item.user.login = ?#{principal.username}")
//    List<FoodItem> findByUserIsCurrentUserOrderByExpirationAsc();

    List<FoodItem> findByUserAndCategoryOrderByExpirationAsc(User user, Category category);
    
    List<FoodItem> findByUserAndExpirationLessThanEqualOrderByExpirationAsc(User user, ZonedDateTime expiration);
    
    List<FoodItem> findByUserAndCategoryAndExpirationLessThanEqualOrderByExpirationAsc(User user, Category category, ZonedDateTime expiration);
}
