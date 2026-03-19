package com.mpi.smartwallet.controller;

import com.mpi.smartwallet.dto.CategoryDTO;
import com.mpi.smartwallet.entity.Category;
import com.mpi.smartwallet.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping
    public Category createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        return categoryService.createCategory(categoryDTO);
    }
}