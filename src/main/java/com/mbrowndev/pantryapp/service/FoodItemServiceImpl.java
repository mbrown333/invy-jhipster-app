package com.mbrowndev.pantryapp.service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mbrowndev.pantryapp.domain.Category;
import com.mbrowndev.pantryapp.domain.FoodItem;
import com.mbrowndev.pantryapp.repository.FoodItemRepository;

@Service
public class FoodItemServiceImpl implements FoodItemService {

	private final FoodItemRepository foodItemRepository;
	
	public FoodItemServiceImpl(FoodItemRepository foodItemRepository) {
		this.foodItemRepository = foodItemRepository;
	}

	@Override
	public FoodItem save(FoodItem item) {
		return foodItemRepository.save(item);
	}

	@Override
	public List<FoodItem> getAllForCurrentUser() {
		return foodItemRepository.findByUserIsCurrentUser();
	}

	@Override
	public List<FoodItem> getByCategoryForCurrentUser(Category category) {
		return foodItemRepository.findByUserIsCurrentUserAndCategory(category);
	}

	@Override
	public Optional<FoodItem> get(Long id) {
		return Optional.ofNullable(foodItemRepository.findOne(id));
	}

	@Override
	public void delete(Long id) {
		foodItemRepository.delete(id);
	}

	@Override
	public List<FoodItem> getByExpirationForCurrentUser(ZonedDateTime expiration) {
		return foodItemRepository.findByUserIsCurrentUserAndExpirationLessThanDate(expiration);
	}

	@Override
	public List<FoodItem> getByCategoryAndExpirationForCurrentUser(Category category, ZonedDateTime expiration) {
		return foodItemRepository.findByUserIsCurrentUserAndCategoryAndExpirationLessThanDate(category, expiration);
	}
}
