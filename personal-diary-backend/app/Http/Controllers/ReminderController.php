<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reminder;
use App\Notifications\ReminderNotification;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReminderController extends Controller
{
    // Get all reminders for the logged-in user
    public function index()
    {
        $reminders = Reminder::where('user_id', Auth::id())->get();
        return response()->json($reminders);
    }

    // Create a new reminder
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'reminder_at' => 'required|date|after:now',
        ]);

        $reminder = Reminder::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'reminder_at' => $request->reminder_at,
            'notified' => false,
        ]);

        // Send notification (stored in database)
        Auth::user()->notify(new ReminderNotification($reminder));

        return response()->json([
            'message' => 'Reminder created successfully',
            'reminder' => $reminder,
        ], 201);
    }

    // Update a reminder
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'reminder_at' => 'required|date|after:now',
        ]);

        $reminder = Reminder::where('user_id', Auth::id())->findOrFail($id);
        $reminder->update([
            'title' => $request->title,
            'reminder_at' => $request->reminder_at,
            'notified' => false,
        ]);

        // Send updated notification
        Auth::user()->notify(new ReminderNotification($reminder));

        return response()->json([
            'message' => 'Reminder updated successfully',
            'reminder' => $reminder,
        ]);
    }

    // Delete a reminder
    public function destroy($id)
    {
        $reminder = Reminder::where('user_id', Auth::id())->findOrFail($id);
        $reminder->delete();

        return response()->json(['message' => 'Reminder deleted successfully']);
    }

    // Get unread notifications
    public function notifications()
    {
        $notifications = Auth::user()->unreadNotifications()->get()->map(function ($notification) {
            return [
                'id' => $notification->id,
                'message' => $notification->data['message'],
                'reminder_id' => $notification->data['reminder_id'],
                'reminder_at' => $notification->data['reminder_at'],
                'created_at' => $notification->created_at,
            ];
        });

        return response()->json($notifications);
    }

    // Mark notification as read
    public function markNotificationRead($notificationId)
    {
        $notification = Auth::user()->notifications()->findOrFail($notificationId);
        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }
}