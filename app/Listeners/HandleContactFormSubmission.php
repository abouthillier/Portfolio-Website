<?php

namespace App\Listeners;

use App\Notifications\ContactFormNotification;
use Illuminate\Support\Facades\Notification;

class HandleContactFormSubmission
{
    public function handle($event)
    {
        // Send notification to your email
        Notification::route('mail', config('mail.from.address'))
            ->notify(new ContactFormNotification($event->submission));
    }
} 