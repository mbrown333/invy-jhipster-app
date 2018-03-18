package com.mbrowndev.pantryapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mbrowndev.pantryapp.domain.Category;
import com.mbrowndev.pantryapp.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {
	
	private final CategoryRepository categoryRepository;
	
	public CategoryServiceImpl(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	@Override
	public Category save(Category category) {
		return categoryRepository.save(category);
	}
	
	@Override
	public void delete(Long id) {
		categoryRepository.delete(id);
	}

	@Override
	public List<Category> getAllForCurrentUser() {
		return categoryRepository.findByUserIsCurrentUser();
	}

	@Override
	public Optional<Category> getCategory(Long id) {
		return Optional.ofNullable(categoryRepository.findOne(id));
	}
	
	
}
