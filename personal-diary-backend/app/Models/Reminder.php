<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'reminder_at', 'notified'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}