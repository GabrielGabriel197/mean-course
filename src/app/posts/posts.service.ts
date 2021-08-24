import { Injectable } from "@angular/core";
import { Post } from "./posts.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(
      map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
      };
    }))
    .subscribe(transformedPostData => {
      console.log(transformedPostData);
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
      return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>('http://localhost:3000/api/posts/' + postId);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);


    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }

  updatePost(postId: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    this.http
    .put('http://localhost:3000/api/posts/' + postId, postData)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }
}
