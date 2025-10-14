<?php

 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DiaryEntryController;
use App\Http\Controllers\ReminderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
//authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth.jwt')->post('/logout', [AuthController::class, 'logout']);

//don't know yet
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Protected routes
Route::middleware('auth.jwt')->group(function () {
    // Diary entry routes
    Route::get('/diary', [DiaryEntryController::class, 'index']); // List all entry dates
    Route::get('/diary/show', [DiaryEntryController::class, 'show']); // Get entry by date
    Route::post('/diary', [DiaryEntryController::class, 'store']); // Create or update entry
    Route::delete('/diary', [DiaryEntryController::class, 'destroy']); // Delete entry
    Route::get('/diary/check', [DiaryEntryController::class, 'check']); // Check if entry exists

    // Reminder routes
    Route::get('/reminders', [ReminderController::class, 'index']);
    Route::post('/reminders', [ReminderController::class, 'store']);
    Route::put('/reminders/{id}', [ReminderController::class, 'update']);
    Route::delete('/reminders/{id}', [ReminderController::class, 'destroy']);
    Route::get('/notifications', [ReminderController::class, 'notifications']);
    Route::post('/notifications/{id}/read', [ReminderController::class, 'markNotificationRead']);
});