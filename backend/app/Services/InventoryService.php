<?php

namespace App\Services;

use App\Models\InventoryItem;
use App\Models\InventoryMovement;

class InventoryService
{
    public function recordEntry(InventoryItem $item, $quantity, $reason, $reference = null, $userId = null)
    {
        InventoryMovement::create([
            'inventory_item_id' => $item->id,
            'clinic_id' => $item->clinic_id,
            'type' => 'entry',
            'quantity' => $quantity,
            'reason' => $reason,
            'reference_number' => $reference,
            'user_id' => $userId
        ]);

        $item->increment('quantity', $quantity);

        return $item;
    }

    public function recordExit(InventoryItem $item, $quantity, $reason, $reference = null, $userId = null)
    {
        if ($quantity > $item->quantity) {
            throw new \Exception('Insufficient stock');
        }

        InventoryMovement::create([
            'inventory_item_id' => $item->id,
            'clinic_id' => $item->clinic_id,
            'type' => 'exit',
            'quantity' => $quantity,
            'reason' => $reason,
            'reference_number' => $reference,
            'user_id' => $userId
        ]);

        $item->decrement('quantity', $quantity);

        return $item;
    }

    public function getLowStockItems($clinicId)
    {
        return InventoryItem::where('clinic_id', $clinicId)
            ->where('active', true)
            ->whereColumn('quantity', '<=', 'minimum_stock')
            ->get();
    }

    public function getExpiredItems($clinicId)
    {
        return InventoryItem::where('clinic_id', $clinicId)
            ->where('active', true)
            ->where('expiry_date', '<', today())
            ->get();
    }
}
