<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diary_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('entry_date');
            $table->text('content');
            $table->timestamps();
            // Add composite unique key
            $table->unique(['user_id', 'entry_date'], 'user_entry_date_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diary_entries');
    }
};