import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../ngrx/auth/auth.state';
import { CategoriesState } from '../../../ngrx/categories/categories.state';
import { Subscription } from 'rxjs';
import * as CategoriesActions from '../../../ngrx/categories/categories.actions';
import { Categories, CategoriesByUid } from '../../../models/categories.model';
import { LoadingComponent } from '../../loading/loading.component';
import { GeneralInfoComponent } from '../library/components/general-info/general-info.component';
import { ProfileInfoComponent } from '../library/components/profile-info/profile-info.component';
import { QuizDetailComponent } from '../quiz/components/quiz-detail/quiz-detail.component';
import { Quiz } from '../../../models/quiz.model';
import { NgIf } from '@angular/common';
import { getAllCategories } from '../../../ngrx/categories/categories.actions';
import { Question } from '../../../models/question.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    MaterialModule,
    SharedModule,
    LoadingComponent,
    GeneralInfoComponent,
    ProfileInfoComponent,
    QuizDetailComponent,
    NgIf,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  categoryId!: string;
  quizzes!: Quiz[];
  category!: CategoriesByUid;
  questions!: Question[];

  showAnswer: boolean = false;

  isGettingCategorySuccess$ = this.store.select(
    'categories',
    'isGetCategorySuccessful',
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<{
      categories: CategoriesState;
    }>,
  ) {
    this.categoryId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.store.dispatch(
      CategoriesActions.getCategoryById({ uid: this.categoryId }),
    );
    this.subscription.push(
      this.store.select('categories', 'category').subscribe((data) => {
        // this.quiz = data.quizzes as Quiz[];
        // this.category = data as CategoriesByUid;
        // console.log(this.category);
        if (Array.isArray(data) && data.length > 0) {
          const category = data[0];
          this.category = category as CategoriesByUid;
          this.quizzes = category.quizzes as Quiz[];
          this.questions = category.questions as Question[];
          console.log(this.quizzes);
        } else {
          console.log('No category data available');
        }
      }),
    );
  }

  toggleAnswer() {
    this.showAnswer = !this.showAnswer;
  }

  activeQuiz(index: number): void {
    if (this.quizzes && this.quizzes[index]) {
      this.questions = this.quizzes[index].questions || [];
      console.log(this.questions); // Check if questions are populated
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  protected readonly getAllCategories = getAllCategories;
}
