package com.mbrowndev.pantryapp.service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import com.mbrowndev.pantryapp.domain.Category;
import com.mbrowndev.pantryapp.domain.FoodItem;

public interface FoodItemService {

	FoodItem save(FoodItem item);
	
	List<FoodItem> getAllForCurrentUser();
	
	List<FoodItem> getByCategoryForCurrentUser(Category category);
	
	Optional<FoodItem> get(Long id);
	
	void delete(Long id);
	
	List<FoodItem> getByExpirationForCurrentUser(ZonedDateTime expiration);
	
	List<FoodItem> getByCategoryAndExpirationForCurrentUser(Category category, ZonedDateTime expiration);
}
