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

Route::get('/api/logos', [App\Http\Controllers\LogoController::class, 'index']);
