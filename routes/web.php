<?php

use Illuminate\Support\Facades\Route;

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);  

// Collection Routes
Route::statamic('work/web-dev', 'web_development', [
    'title' => 'Web Development'
]);

Route::statamic('work/motion', 'motion_design', [
    'title' => 'Motion Design'
]);

Route::statamic('work/data', 'data_projects', [
    'title' => 'Data Projects'
]);

Route::statamic('work/video', 'video_projects', [
    'title' => 'Video Projects'
]);

// Taxonomy Routes
Route::statamic('technologies/{slug}', 'taxonomies.technologies', [
    'title' => 'Technologies'
]);

Route::statamic('software/{slug}', 'taxonomies.software_used', [
    'title' => 'Software'
]);

Route::statamic('tools/{slug}', 'taxonomies.tools_used', [
    'title' => 'Tools'
]);

Route::statamic('roles/{slug}', 'taxonomies.role', [
    'title' => 'Roles'
]);

// Route::statamic('about', 'default', [
//     'title' => 'About',
//     'template' => 'default',
//     'layout' => 'layout'
// ]);

Route::get('/api/logos', [App\Http\Controllers\LogoController::class, 'index']);

Route::get('/about-test', function () {
    return view('default', [
        'test_field' => 'Test value'
    ]);
});

// Custom route to manually load the About page entry
Route::get('/about', function () {
    $entry = \Statamic\Facades\Entry::query()
        ->where('collection', 'pages')
        ->where('slug', 'about')
        ->first();
    
    if (!$entry) {
        return 'Entry not found';
    }
    
    return (new \Statamic\View\View)
        ->template($entry->template() ?? 'default')
        ->layout($entry->layout() ?? 'layout')
        ->with(['title' => $entry->get('title')])
        ->cascadeContent($entry);
});

// Debug route to show raw entry data
Route::get('/about-debug', function () {
    $entry = \Statamic\Facades\Entry::query()
        ->where('collection', 'pages')
        ->where('slug', 'about')
        ->first();
    
    if ($entry) {
        return '<pre>' . json_encode($entry->toAugmentedArray(), JSON_PRETTY_PRINT) . '</pre>';
    }
    return 'Entry not found';
});

// Detailed debug route for entry inspection
Route::get('/about-dump', function () {
    $entry = \Statamic\Facades\Entry::query()
        ->where('collection', 'pages')
        ->where('slug', 'about')
        ->first();
    
    if (!$entry) {
        return 'Entry not found';
    }
    
    // Get all collections to verify where the entry should be
    $collections = \Statamic\Facades\Collection::all()->map(function ($collection) {
        return $collection->handle();
    })->toArray();
    
    // Get all entries in the pages collection
    $pageEntries = \Statamic\Facades\Entry::query()
        ->where('collection', 'pages')
        ->get()
        ->map(function ($entry) {
            return [
                'id' => $entry->id(),
                'slug' => $entry->slug(),
                'uri' => $entry->uri(),
                'url' => $entry->url(),
                'published' => $entry->published(),
            ];
        })
        ->toArray();
    
    return [
        'collections' => $collections,
        'pageEntries' => $pageEntries,
        'entryData' => $entry->data()->toArray(),
        'augmentedData' => $entry->toAugmentedArray(),
    ];
});
