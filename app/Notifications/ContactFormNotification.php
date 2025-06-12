<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ContactFormNotification extends Notification
{
    use Queueable;

    protected $submission;

    public function __construct($submission)
    {
        $this->submission = $submission;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Contact Form Submission')
            ->line('You have received a new message from your website.')
            ->line('From: ' . $this->submission['name'])
            ->line('Email: ' . $this->submission['email'])
            ->line('Message: ' . $this->submission['message']);
    }
} 