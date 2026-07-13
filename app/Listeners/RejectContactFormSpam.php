<?php

namespace App\Listeners;

use Statamic\Events\FormSubmitted;

class RejectContactFormSpam
{
    // ponytail: phrase/URL heuristics only; upgrade path is Akismet or stricter Turnstile mode
    private const MIN_SUBMIT_SECONDS = 3;

    private const SPAM_PHRASES = [
        'jackpot',
        'keyword availability',
        'guaranteed traffic',
        'seo services',
        'search terms that matter',
    ];

    public function handle(FormSubmitted $event): ?bool
    {
        if ($event->submission->form()->handle() !== 'contact_me') {
            return null;
        }

        $data = $event->submission->data()->all();
        $message = (string) ($data['form_message'] ?? '');

        if ($this->isTooFast()) {
            return false;
        }

        if ($this->urlCount($message) >= 2) {
            return false;
        }

        if ($this->containsSpamPhrase($message)) {
            return false;
        }

        return null;
    }

    private function isTooFast(): bool
    {
        $startedAt = request()->input('_form_started_at');

        if (! is_numeric($startedAt)) {
            return true;
        }

        return (microtime(true) * 1000) - ((float) $startedAt * 1000) < self::MIN_SUBMIT_SECONDS * 1000;
    }

    private function urlCount(string $message): int
    {
        return preg_match_all('/https?:\/\//i', $message);
    }

    private function containsSpamPhrase(string $message): bool
    {
        $normalized = strtolower($message);

        foreach (self::SPAM_PHRASES as $phrase) {
            if (str_contains($normalized, $phrase)) {
                return true;
            }
        }

        return false;
    }
}

if (PHP_SAPI === 'cli' && basename(__FILE__) === basename($_SERVER['argv'][0] ?? '')) {
    $listener = new RejectContactFormSpam();
    $urlCount = (new \ReflectionMethod($listener, 'urlCount'))->invoke($listener, 'see https://a.com and http://b.com');
    assert($urlCount === 2, 'urlCount should detect two URLs');
    echo "RejectContactFormSpam self-check ok\n";
}
