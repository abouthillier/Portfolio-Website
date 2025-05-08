<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class LogoController extends Controller
{
    public function index(): JsonResponse
    {
        $logoPath = storage_path('app/public/assets/logos');
        Log::info('Looking for logos in: ' . $logoPath);
        
        if (!File::exists($logoPath)) {
            Log::error('Logo directory does not exist: ' . $logoPath);
            return response()->json([]);
        }

        $files = File::files($logoPath);
        Log::info('Found ' . count($files) . ' files in logo directory');
        
        $logos = collect($files)
            ->filter(function ($file) {
                $isSvg = strtolower($file->getExtension()) === 'svg';
                Log::info('File: ' . $file->getFilename() . ' is SVG: ' . ($isSvg ? 'yes' : 'no'));
                return $isSvg;
            })
            ->map(function ($file) {
                $path = '/storage/assets/logos/' . $file->getFilename();
                Log::info('Mapped file to path: ' . $path);
                return $path;
            })
            ->values()
            ->toArray();

        Log::info('Returning ' . count($logos) . ' logo paths');
        return response()->json($logos)
            ->header('Content-Type', 'application/json');
    }
} 