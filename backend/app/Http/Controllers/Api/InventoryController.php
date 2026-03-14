<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventoryItemRequest;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(): JsonResponse
    {
        $items = InventoryItem::with('movements')
            ->where('clinic_id', auth()->user()->clinic_id ?? 1)
            ->paginate(20);
        return response()->json($items);
    }

    public function show(InventoryItem $inventoryItem): JsonResponse
    {
        $inventoryItem->load('movements');
        return response()->json($inventoryItem);
    }

    public function store(StoreInventoryItemRequest $request): JsonResponse
    {
        $item = InventoryItem::create(array_merge(
            $request->validated(),
            ['clinic_id' => auth()->user()->clinic_id ?? 1]
        ));

        return response()->json($item, 201);
    }

    public function update(Request $request, InventoryItem $inventoryItem): JsonResponse
    {
        $inventoryItem->update($request->validated());
        return response()->json($inventoryItem);
    }

    public function addMovement(Request $request, InventoryItem $inventoryItem): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:entry,exit,adjustment',
            'quantity' => 'required|integer',
            'reason' => 'required|string',
            'reference_number' => 'nullable|string',
        ]);

        InventoryMovement::create(array_merge(
            $validated,
            [
                'inventory_item_id' => $inventoryItem->id,
                'clinic_id' => auth()->user()->clinic_id ?? 1,
                'user_id' => auth()->id()
            ]
        ));

        if ($validated['type'] === 'entry') {
            $inventoryItem->increment('quantity', $validated['quantity']);
        } else {
            $inventoryItem->decrement('quantity', $validated['quantity']);
        }

        return response()->json(['message' => 'Movement recorded']);
    }

    public function getLowStock(): JsonResponse
    {
        $items = InventoryItem::where('clinic_id', auth()->user()->clinic_id ?? 1)
            ->where('active', true)
            ->whereColumn('quantity', '<=', 'minimum_stock')
            ->get();
        return response()->json($items);
    }
}
