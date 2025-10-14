<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DiaryEntry;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DiaryEntryController extends Controller
{
    // Get all diary entry dates for the logged-in user
    public function index()
    {
        $entries = DiaryEntry::where('user_id', Auth::id())
                    ->select('entry_date')
                    ->get();
        return response()->json($entries);
    }

    // Get a specific diary entry by date
    public function show(Request $request)
    {
        $request->validate([
            'entry_date' => 'required|date',
        ]);

        $entry = DiaryEntry::where('user_id', Auth::id())
                   ->where('entry_date', $request->entry_date)
                   ->first();

        if (!$entry) {
            return response()->json(['message' => 'No entry found for this date'], 404);
        }

        return response()->json($entry);
    }

    // Create or update a diary entry
    public function store(Request $request)
    {
        $request->validate([
            'entry_date' => 'required|date',
            'content' => 'required|string',
        ]);

        $entry = DiaryEntry::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'entry_date' => $request->entry_date,
            ],
            [
                'content' => $request->content,
            ]
        );

        return response()->json([
            'message' => 'Diary entry saved successfully',
            'entry' => $entry,
        ], 201);
    }

    // Delete a diary entry
    public function destroy(Request $request)
    {
        $request->validate([
            'entry_date' => 'required|date',
        ]);

        $entry = DiaryEntry::where('user_id', Auth::id())
                   ->where('entry_date', $request->entry_date)
                   ->first();

        if (!$entry) {
            return response()->json(['message' => 'No entry found for this date'], 404);
        }

        $entry->delete();

        return response()->json(['message' => 'Diary entry deleted successfully']);
    }

    // Check if an entry exists for a date
    public function check(Request $request)
    {
        $request->validate([
            'entry_date' => 'required|date',
        ]);

        $exists = DiaryEntry::where('user_id', Auth::id())
                   ->where('entry_date', $request->entry_date)
                   ->exists();

        return response()->json(['exists' => $exists]);
    }
}