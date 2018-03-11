package com.mbrowndev.pantryapp.cucumber.stepdefs;

import com.mbrowndev.pantryapp.PantryApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = PantryApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
