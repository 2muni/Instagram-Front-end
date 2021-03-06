<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Snapshot extends Model
{
    protected $fillable = [
        'body', 'uri', 'user_id'
    ];

    public function comments()
    {
        return $this->hasMany('App\Snapshot_Comment');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
