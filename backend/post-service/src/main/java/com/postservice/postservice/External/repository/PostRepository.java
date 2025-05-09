package com.postservice.postservice.External.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.postservice.postservice.Domain.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

}
