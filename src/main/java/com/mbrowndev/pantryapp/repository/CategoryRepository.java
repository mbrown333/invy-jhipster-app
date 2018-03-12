package com.mbrowndev.pantryapp.repository;

import com.mbrowndev.pantryapp.domain.Category;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("select category from Category category where category.user.login = ?#{principal.username}")
    List<Category> findByUserIsCurrentUser();

}
