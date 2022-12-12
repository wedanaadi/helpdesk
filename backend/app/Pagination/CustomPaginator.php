<?php

namespace App\Pagination;

use Illuminate\Pagination\LengthAwarePaginator;

class CustomPaginator extends LengthAwarePaginator
{
  /**
   * toArray
   *
   * @return void
   */
  public function toArray()
  {
    return [
      'data' => $this->items->toArray(),
      'pagination' => [
        'total'       => $this->total(),
        'count'       => $this->count(),
        'perPage'     => $this->perPage(),
        'currentPage' => $this->currentPage(),
        'totalPages'  => $this->lastPage(),
        'next_page_url' => $this->nextPageUrl(),
        'prev_page_url' => $this->previousPageUrl(),
        'from' => $this->firstItem(),
        'to' => $this->lastItem(),
      ],
    ];
  }
}
