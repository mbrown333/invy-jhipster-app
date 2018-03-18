package com.mbrowndev.pantryapp.service;

import java.util.List;
import java.util.Optional;

import com.mbrowndev.pantryapp.domain.Category;

public interface CategoryService {
	
	Category save(Category category);
	
	void delete(Long id);
	
	List<Category> getAllForCurrentUser();
	
	Optional<Category> getCategory(Long id);
}
