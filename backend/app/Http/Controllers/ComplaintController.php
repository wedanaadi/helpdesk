<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
      if($request->foto) {
        $dataImage = $request->foto;
        $destinationPath = 'images/pegawai';
        $profileImage = '--' . "=" . $dataImage->getClientOriginalName();
        $dataImage->move($destinationPath, $profileImage);
      }
      return $request->foto;
    }
}
