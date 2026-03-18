package com.mpi.smartwallet.repository;

import com.mpi.smartwallet.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}