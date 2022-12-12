<?php

namespace App\Providers;

use App\Models\PersonalAccessToken;
use App\Pagination\CustomPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\LengthAwarePaginator as LengthAwarePaginatorContract;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   *
   * @return void
   */
  public function register()
  {
    $this->app->alias(CustomPaginator::class, LengthAwarePaginator::class); // Eloquent uses the class instead of the contract 🤔
    $this->app->alias(CustomPaginator::class, LengthAwarePaginatorContract::class);
  }

  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public function boot()
  {
    Sanctum::usePersonalAccessTokenModel(
      PersonalAccessToken::class
    );
  }
}
