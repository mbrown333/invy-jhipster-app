package com.mbrowndev.pantryapp.web.rest;

import com.mbrowndev.pantryapp.PantryApp;

import com.mbrowndev.pantryapp.domain.FoodItem;
import com.mbrowndev.pantryapp.repository.CategoryRepository;
import com.mbrowndev.pantryapp.repository.FoodItemRepository;
import com.mbrowndev.pantryapp.repository.UserRepository;
import com.mbrowndev.pantryapp.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.mbrowndev.pantryapp.web.rest.TestUtil.sameInstant;
import static com.mbrowndev.pantryapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the FoodItemResource REST controller.
 *
 * @see FoodItemResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PantryApp.class)
public class FoodItemResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_EXPIRATION = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_EXPIRATION = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private FoodItemRepository foodItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired CategoryRepository categoryRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFoodItemMockMvc;

    private FoodItem foodItem;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FoodItemResource foodItemResource = new FoodItemResource(foodItemRepository, userRepository, categoryRepository);
        this.restFoodItemMockMvc = MockMvcBuilders.standaloneSetup(foodItemResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FoodItem createEntity(EntityManager em) {
        FoodItem foodItem = new FoodItem()
            .name(DEFAULT_NAME)
            .created(DEFAULT_CREATED)
            .expiration(DEFAULT_EXPIRATION);
        return foodItem;
    }

    @Before
    public void initTest() {
        foodItem = createEntity(em);
    }

    @Test
    @Transactional
    public void createFoodItem() throws Exception {
        int databaseSizeBeforeCreate = foodItemRepository.findAll().size();

        // Create the FoodItem
        restFoodItemMockMvc.perform(post("/api/food-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(foodItem)))
            .andExpect(status().isCreated());

        // Validate the FoodItem in the database
        List<FoodItem> foodItemList = foodItemRepository.findAll();
        assertThat(foodItemList).hasSize(databaseSizeBeforeCreate + 1);
        FoodItem testFoodItem = foodItemList.get(foodItemList.size() - 1);
        assertThat(testFoodItem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFoodItem.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testFoodItem.getExpiration()).isEqualTo(DEFAULT_EXPIRATION);
    }

    @Test
    @Transactional
    public void createFoodItemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = foodItemRepository.findAll().size();

        // Create the FoodItem with an existing ID
        foodItem.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFoodItemMockMvc.perform(post("/api/food-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(foodItem)))
            .andExpect(status().isBadRequest());

        // Validate the FoodItem in the database
        List<FoodItem> foodItemList = foodItemRepository.findAll();
        assertThat(foodItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = foodItemRepository.findAll().size();
        // set the field null
        foodItem.setName(null);

        // Create the FoodItem, which fails.

        restFoodItemMockMvc.perform(post("/api/food-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(foodItem)))
            .andExpect(status().isBadRequest());

        List<FoodItem> foodItemList = foodItemRepository.findAll();
        assertThat(foodItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCreatedIsRequired() throws Exception {
        int databaseSizeBeforeTest = foodItemRepository.findAll().size();
        // set the field null
        foodItem.setCreated(null);

        // Create the FoodItem, which fails.

        restFoodItemMockMvc.perform(post("/api/food-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(foodItem)))
            .andExpect(status().isBadRequest());

        List<FoodItem> foodItemList = foodItemRepository.findAll();
        assertThat(foodItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllFoodItems() throws Exception {
        // Initialize the database
        foodItemRepository.saveAndFlush(foodItem);

        // Get all the foodItemList
        restFoodItemMockMvc.perform(get("/api/food-items?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(foodItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].created").value(hasItem(sameInstant(DEFAULT_CREATED))))
            .andExpect(jsonPath("$.[*].expiration").value(hasItem(sameInstant(DEFAULT_EXPIRATION))));
    }

    @Test
    @Transactional
    public void getFoodItem() throws Exception {
        // Initialize the database
        foodItemRepository.saveAndFlush(foodItem);

        // Get the foodItem
        restFoodItemMockMvc.perform(get("/api/food-items/{id}", foodItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(foodItem.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.created").value(sameInstant(DEFAULT_CREATED)))
            .andExpect(jsonPath("$.expiration").value(sameInstant(DEFAULT_EXPIRATION)));
    }

    @Test
    @Transactional
    public void getNonExistingFoodItem() throws Exception {
        // Get the foodItem
        restFoodItemMockMvc.perform(get("/api/food-items/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFoodItem() throws Exception {
        // Initialize the database
        foodItemRepository.saveAndFlush(foodItem);
        int databaseSizeBeforeUpdate = foodItemRepository.findAll().size();

        // Update the foodItem
        FoodItem updatedFoodItem = foodItemRepository.findOne(foodItem.getId());
        // Disconnect from session so that the updates on updatedFoodItem are not directly saved in db
        em.detach(updatedFoodItem);
        updatedFoodItem
            .name(UPDATED_NAME)
            .created(UPDATED_CREATED)
            .expiration(UPDATED_EXPIRATION);

        restFoodItemMockMvc.perform(put("/api/food-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFoodItem)))
            .andExpect(status().isOk());

        // Validate the FoodItem in the database
        List<FoodItem> foodItemList = foodItemRepository.findAll();
        assertThat(foodItemList).hasSize(databaseSizeBeforeUpdate);
        FoodItem testFoodItem = foodItemList.get(foodItemList.size() - 1);
        assertThat(testFoodItem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFoodItem.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testFoodItem.getExpiration()).isEqualTo(UPDATED_EXPIRATION);
    }

    @Test
    @Transactional
    public void updateNonExistingFoodItem() throws Exception {
        int databaseSizeBeforeUpdate = foodItemRepository.findAll().size();

        // Create the FoodItem

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFoodItemMockMvc.perform(put("/api/food-items")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(foodItem)))
            .andExpect(status().isCreated());

        // Validate the FoodItem in the database
        List<FoodItem> foodItemList = foodItemRepository.findAll();
        assertThat(foodItemList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFoodItem() throws Exception {
        // Initialize the database
        foodItemRepository.saveAndFlush(foodItem);
        int databaseSizeBeforeDelete = foodItemRepository.findAll().size();

        // Get the foodItem
        restFoodItemMockMvc.perform(delete("/api/food-items/{id}", foodItem.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<FoodItem> foodItemList = foodItemRepository.findAll();
        assertThat(foodItemList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FoodItem.class);
        FoodItem foodItem1 = new FoodItem();
        foodItem1.setId(1L);
        FoodItem foodItem2 = new FoodItem();
        foodItem2.setId(foodItem1.getId());
        assertThat(foodItem1).isEqualTo(foodItem2);
        foodItem2.setId(2L);
        assertThat(foodItem1).isNotEqualTo(foodItem2);
        foodItem1.setId(null);
        assertThat(foodItem1).isNotEqualTo(foodItem2);
    }
}
