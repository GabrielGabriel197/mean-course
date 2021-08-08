import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../posts.model";
import { PostsService } from "../posts.service";

@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  isLoading = false;
  private PostsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.PostsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) =>{
      this.isLoading = false;
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.PostsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
}
