<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class LogoController extends Controller
{
    private const ALLOWED_EXTENSIONS = ['svg', 'png', 'jpg', 'jpeg', 'webp'];

    public function index(): JsonResponse
    {
        $logos = collect();

        $publicPath = public_path('assets/logos');
        if (File::exists($publicPath)) {
            $logos = $logos->merge($this->getLogosFromDirectory($publicPath, '/assets/logos/'));
        }

        $logos = $logos->unique()->values()->toArray();

        Log::info('Returning ' . count($logos) . ' logo paths');
        return response()->json($logos)
            ->header('Content-Type', 'application/json');
    }

    private function getLogosFromDirectory(string $dirPath, string $urlPrefix): array
    {
        $files = File::files($dirPath);

        return collect($files)
            ->filter(function ($file) {
                return in_array(strtolower($file->getExtension()), self::ALLOWED_EXTENSIONS);
            })
            ->map(fn ($file) => $urlPrefix . $file->getFilename())
            ->toArray();
    }
} 