import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { Observable, Subscription } from 'rxjs';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy{
  model: AddBlogPost;
  categories$?: Observable<Category[]>;
  imageSelectSubscription?: Subscription;
  isImageSelectorVisible: boolean = false;

  constructor(private blogPostService: BlogPostService,
              private categoryService: CategoryService,
              private router: Router,
              private imageService: ImageService
  ) {
    this.model = {
      title: "",
      shortDescription: "",
      urlHandle: "",
      content: "",
      featuredImageUrl: "",
      author: "",
      isVisible: true,
      publishedDate: new Date(),
      categories: []
    }
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
    this.imageSelectSubscription = this.imageService.onSelectImage()
          .subscribe({
            next: (response) => {
              if (this.model){
                this.model.featuredImageUrl = response.url;
                this.isImageSelectorVisible = false;
              }
            }
          });
  }

  ngOnDestroy(): void {
    this.imageSelectSubscription?.unsubscribe();  
  }

  onFormSubmit(): void{
    console.log(this.model);
    this.blogPostService.createBlogPost(this.model)
    .subscribe({
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts/list');
      }
    });
  }

  openImageSelector(): void {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }


}
