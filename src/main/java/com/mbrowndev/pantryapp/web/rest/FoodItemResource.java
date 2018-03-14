package com.mbrowndev.pantryapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mbrowndev.pantryapp.domain.Category;
import com.mbrowndev.pantryapp.domain.FoodItem;
import com.mbrowndev.pantryapp.domain.User;
import com.mbrowndev.pantryapp.repository.CategoryRepository;
import com.mbrowndev.pantryapp.repository.FoodItemRepository;
import com.mbrowndev.pantryapp.repository.UserRepository;
import com.mbrowndev.pantryapp.security.SecurityUtils;
import com.mbrowndev.pantryapp.web.rest.errors.BadRequestAlertException;
import com.mbrowndev.pantryapp.web.rest.errors.InternalServerErrorException;
import com.mbrowndev.pantryapp.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import javassist.NotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing FoodItem.
 */
@RestController
@RequestMapping("/api")
public class FoodItemResource {

    private final Logger log = LoggerFactory.getLogger(FoodItemResource.class);

    private static final String ENTITY_NAME = "foodItem";

    private final FoodItemRepository foodItemRepository;
    
    private final UserRepository userRepository;
    
    private final CategoryRepository categoryRepository;

    public FoodItemResource(FoodItemRepository foodItemRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.foodItemRepository = foodItemRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * POST  /food-items : Create a new foodItem.
     *
     * @param foodItem the foodItem to create
     * @return the ResponseEntity with status 201 (Created) and with body the new foodItem, or with status 400 (Bad Request) if the foodItem has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/food-items")
    @Timed
    public ResponseEntity<FoodItem> createFoodItem(@Valid @RequestBody FoodItem foodItem) throws URISyntaxException {
        log.debug("REST request to save FoodItem : {}", foodItem);
        if (foodItem.getId() != null) {
            throw new BadRequestAlertException("A new foodItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        final String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new InternalServerErrorException("Current user login not found"));
        final Optional<User> user = userRepository.findOneByLogin(userLogin);
        user.orElseThrow(() -> new InternalServerErrorException("Current user not found"));
        foodItem.setUser(user.get());
        foodItem.setCreated(ZonedDateTime.now());
        FoodItem result = foodItemRepository.save(foodItem);
        return ResponseEntity.created(new URI("/api/food-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /food-items : Updates an existing foodItem.
     *
     * @param foodItem the foodItem to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated foodItem,
     * or with status 400 (Bad Request) if the foodItem is not valid,
     * or with status 500 (Internal Server Error) if the foodItem couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/food-items")
    @Timed
    public ResponseEntity<FoodItem> updateFoodItem(@Valid @RequestBody FoodItem foodItem) throws URISyntaxException {
        log.debug("REST request to update FoodItem : {}", foodItem);
        if (foodItem.getId() == null) {
            return createFoodItem(foodItem);
        }
        FoodItem result = foodItemRepository.save(foodItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, foodItem.getId().toString()))
            .body(result);
    }

    /**
     * GET  /food-items : get all the foodItems.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of foodItems in body
     * @throws NotFoundException 
     */
    @GetMapping("/food-items")
    @Timed
    public List<FoodItem> getAllFoodItems(@RequestParam(value="category", required=false) Optional<Long> categoryId) throws NotFoundException {
        log.debug("REST request to get all FoodItems");
        if (categoryId.isPresent()) {
        		if (!categoryRepository.exists(categoryId.get())) {
        			throw new NotFoundException("Category not found.");
        		}
        		final String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new InternalServerErrorException("Current user login not found"));
            final Optional<User> user = userRepository.findOneByLogin(userLogin);
            user.orElseThrow(() -> new InternalServerErrorException("Current user not found"));
        		final Category category = categoryRepository.findOne(categoryId.get());
        		return foodItemRepository.findByUserAndCategoryOrderByExpirationAsc(user.get(), category);
        } else {
        		return foodItemRepository.findAll();
        }
    }

    /**
     * GET  /food-items/:id : get the "id" foodItem.
     *
     * @param id the id of the foodItem to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the foodItem, or with status 404 (Not Found)
     */
    @GetMapping("/food-items/{id}")
    @Timed
    public ResponseEntity<FoodItem> getFoodItem(@PathVariable Long id) {
        log.debug("REST request to get FoodItem : {}", id);
        FoodItem foodItem = foodItemRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(foodItem));
    }

    /**
     * DELETE  /food-items/:id : delete the "id" foodItem.
     *
     * @param id the id of the foodItem to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/food-items/{id}")
    @Timed
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        log.debug("REST request to delete FoodItem : {}", id);
        foodItemRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
    
    @GetMapping("/food-items/expiring")
    @Timed
    public List<FoodItem> getExpiringFoodItems(
    		@RequestParam(value="expiration", required = true) String expiration,
    		@RequestParam(value="category", required = false) Optional<Long> categoryId) throws NotFoundException {
    		log.debug("REST request to get FoodItems with expiration less than: {}", expiration);
    		
    		final String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new InternalServerErrorException("Current user login not found"));
        final Optional<User> user = userRepository.findOneByLogin(userLogin);
        user.orElseThrow(() -> new InternalServerErrorException("Current user not found"));
        
        DateTimeFormatter dateTimeFormat = DateTimeFormatter.ISO_DATE_TIME;
        ZonedDateTime expirationDate = dateTimeFormat.parse(expiration, ZonedDateTime::from);
    		
        if (categoryId.isPresent()) {
	    		if (!categoryRepository.exists(categoryId.get())) {
	    			throw new NotFoundException("Category not found.");
	    		}
	    		final Category category = categoryRepository.findOne(categoryId.get());
	    		return foodItemRepository.findByUserAndCategoryAndExpirationLessThanEqualOrderByExpirationAsc(user.get(), category, expirationDate);
        } else {
        		return foodItemRepository.findByUserAndExpirationLessThanEqualOrderByExpirationAsc(user.get(), expirationDate);
        }
    }
}
