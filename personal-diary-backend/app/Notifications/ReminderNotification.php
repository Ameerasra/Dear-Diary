<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;

class ReminderNotification extends Notification
{
    use Queueable;

    protected $reminder;

    public function __construct($reminder)
    {
        $this->reminder = $reminder;
    }

    public function via($notifiable)
    {
        return ['database']; // Store notifications in the database
    }

    public function toDatabase($notifiable)
    {
        return new DatabaseMessage([
            'message' => "Reminder: {$this->reminder->title} is due at {$this->reminder->reminder_at}",
            'reminder_id' => $this->reminder->id,
            'reminder_at' => $this->reminder->reminder_at,
        ]);
    }
}