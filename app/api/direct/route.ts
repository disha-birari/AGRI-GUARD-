import { NextRequest, NextResponse } from "next/server";

export interface DirectHarvestBatch {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerVillage: string;
  farmerDistrict: string;
  farmerPhone: string;
  crop: string;
  variety: string;
  harvestSchedule: string; // e.g. "Tomorrow, 6:00 AM"
  hoursFromHarvest: number; // e.g. 8 (hours to kitchen delivery)
  availableKg: number;
  minOrderKg: number;
  farmerPricePerKg: number; // e.g. 24
  mandiDistressPricePerKg: number; // e.g. 9
  supermarketPricePerKg: number; // e.g. 45
  bioCertification: "100% Organic" | "Low-Residue Bio-Input" | "Natural Farming (SPNF)";
  pesticideFreeDays: number; // Days since last natural spray
  rating: number;
  reviewsCount: number;
  image: string;
  societyGroupDiscountPercent: number; // e.g. 10% off for orders > 50kg
}

const LIVE_HARVEST_BATCHES: DirectHarvestBatch[] = [
  {
    id: "batch-101",
    farmerId: "f-1",
    farmerName: "Ramesh Tukaram Kumar",
    farmerVillage: "Dindori",
    farmerDistrict: "Nashik",
    farmerPhone: "+91 98231 44520",
    crop: "Vine-Ripened Tomatoes",
    variety: "Abhinav F1 (Juicy & Thick Skin)",
    harvestSchedule: "Tomorrow, 5:30 AM",
    hoursFromHarvest: 6,
    availableKg: 850,
    minOrderKg: 5,
    farmerPricePerKg: 24,
    mandiDistressPricePerKg: 9,
    supermarketPricePerKg: 46,
    bioCertification: "100% Organic",
    pesticideFreeDays: 45,
    rating: 4.9,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop",
    societyGroupDiscountPercent: 12
  },
  {
    id: "batch-102",
    farmerId: "f-2",
    farmerName: "Sunita Dnyaneshwar Patil",
    farmerVillage: "Pimpalgaon",
    farmerDistrict: "Nashik",
    farmerPhone: "+91 97654 21098",
    crop: "Fresh Red Lasalgaon Onions",
    variety: "Gavran Summer Red",
    harvestSchedule: "Harvested Today",
    hoursFromHarvest: 12,
    availableKg: 1600,
    minOrderKg: 10,
    farmerPricePerKg: 28,
    mandiDistressPricePerKg: 14,
    supermarketPricePerKg: 52,
    bioCertification: "Natural Farming (SPNF)",
    pesticideFreeDays: 60,
    rating: 4.8,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop",
    societyGroupDiscountPercent: 10
  },
  {
    id: "batch-103",
    farmerId: "f-3",
    farmerName: "Balasaheb Shinde",
    farmerVillage: "Ozar",
    farmerDistrict: "Nashik",
    farmerPhone: "+91 94222 78100",
    crop: "Crisp Green Capsicum / Bell Pepper",
    variety: "Indra F1 Hybrid",
    harvestSchedule: "Tomorrow, 7:00 AM",
    hoursFromHarvest: 8,
    availableKg: 400,
    minOrderKg: 3,
    farmerPricePerKg: 42,
    mandiDistressPricePerKg: 20,
    supermarketPricePerKg: 85,
    bioCertification: "Low-Residue Bio-Input",
    pesticideFreeDays: 30,
    rating: 4.9,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop",
    societyGroupDiscountPercent: 15
  },
  {
    id: "batch-104",
    farmerId: "f-4",
    farmerName: "Anandrao Jadhav",
    farmerVillage: "Niphad",
    farmerDistrict: "Nashik",
    farmerPhone: "+91 98811 32904",
    crop: "Tender Seedless Green Grapes",
    variety: "Thompson Seedless (Export Grade)",
    harvestSchedule: "Harvesting in 2 Days",
    hoursFromHarvest: 14,
    availableKg: 1200,
    minOrderKg: 4,
    farmerPricePerKg: 65,
    mandiDistressPricePerKg: 32,
    supermarketPricePerKg: 130,
    bioCertification: "100% Organic",
    pesticideFreeDays: 50,
    rating: 5.0,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop",
    societyGroupDiscountPercent: 10
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filterCrop = searchParams.get("crop");
    const isOrganicOnly = searchParams.get("organic") === "true";

    let filtered = [...LIVE_HARVEST_BATCHES];

    if (filterCrop && filterCrop !== "All") {
      filtered = filtered.filter(b => b.crop.toLowerCase().includes(filterCrop.toLowerCase()));
    }
    if (isOrganicOnly) {
      filtered = filtered.filter(b => b.bioCertification === "100% Organic" || b.bioCertification === "Natural Farming (SPNF)");
    }

    return NextResponse.json({
      batches: filtered,
      totalBatches: filtered.length,
      platformImpact: {
        totalFarmersSupported: 148,
        avgFarmerEarningsBoostPercent: 168,
        avgConsumerSavingsPercent: 38,
        totalFoodMilesSavedKm: 42000,
      },
      updatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Direct marketplace API error:", err);
    return NextResponse.json({ error: "Failed to fetch harvest batches" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { batchId, customerName, customerPhone, customerAddress, orderKg, isSocietyGroupOrder } = body;

    if (!batchId || !orderKg || orderKg <= 0) {
      return NextResponse.json({ error: "Invalid order parameters" }, { status: 400 });
    }

    const batch = LIVE_HARVEST_BATCHES.find(b => b.id === batchId) || LIVE_HARVEST_BATCHES[0];
    const unitPrice = isSocietyGroupOrder 
      ? batch.farmerPricePerKg * (1 - batch.societyGroupDiscountPercent / 100)
      : batch.farmerPricePerKg;

    const subtotal = Math.round(unitPrice * orderKg);
    const ecoLogisticsFee = Math.round(subtotal * 0.08); // 8% EV transport & eco-crate fee
    const totalAmount = subtotal + ecoLogisticsFee;
    const supermarketEquivalent = Math.round(batch.supermarketPricePerKg * orderKg);
    const consumerSavings = Math.max(0, supermarketEquivalent - totalAmount);
    const farmerEarned = Math.round(unitPrice * orderKg);
    const mandiDistressEquivalent = Math.round(batch.mandiDistressPricePerKg * orderKg);
    const farmerExtraProfit = Math.max(0, farmerEarned - mandiDistressEquivalent);

    const orderReceipt = {
      orderId: `AG-DIRECT-${Date.now().toString().slice(-6)}`,
      batchId: batch.id,
      crop: batch.crop,
      variety: batch.variety,
      farmerName: batch.farmerName,
      farmerPhone: batch.farmerPhone,
      customerName,
      customerPhone,
      customerAddress,
      orderKg,
      unitPrice,
      subtotal,
      ecoLogisticsFee,
      totalAmount,
      supermarketEquivalent,
      consumerSavings,
      farmerEarned,
      farmerExtraProfit,
      harvestSchedule: batch.harvestSchedule,
      expectedDelivery: "Same day within 8 hours of harvest",
      status: "Harvest Confirmed & Escrow Locked",
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: "Pre-order successfully confirmed! Fresh harvest will be dispatched straight from the farm.",
      receipt: orderReceipt
    });
  } catch (err: any) {
    console.error("Direct order placement error:", err);
    return NextResponse.json({ error: "Failed to place direct pre-order" }, { status: 500 });
  }
}
