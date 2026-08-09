import { NextRequest, NextResponse } from "next/server";

export interface MachineryItem {
  id: string;
  name: string;
  category: "Tractor & Rotavator" | "Drone Sprayer" | "Combine Harvester" | "Laser Land Leveler" | "Solar Water Pump";
  ownerName: string;
  ownerVillage: string;
  ownerPhone: string;
  distanceKm: number;
  rateType: "per_hour" | "per_acre";
  rateAmount: number; // in INR
  rating: number;
  completedBookings: number;
  availableFrom: string;
  specs: string;
  driverIncluded: boolean;
  image: string;
}

const MACHINERY_LISTINGS: MachineryItem[] = [
  {
    id: "m-1",
    name: "Mahindra 575 DI (45 HP) + 7ft Rotavator",
    category: "Tractor & Rotavator",
    ownerName: "Pandurang Kulkarni",
    ownerVillage: "Dindori",
    ownerPhone: "+91 98223 90112",
    distanceKm: 4.2,
    rateType: "per_hour",
    rateAmount: 650,
    rating: 4.9,
    completedBookings: 84,
    availableFrom: "Available Today",
    specs: "45 HP Dual Clutch, Heavy Duty Rotavator & MB Plough attachment",
    driverIncluded: true,
    image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=600&auto=format&fit=crop"
  },
  {
    id: "m-2",
    name: "Agri-Hexacopter 16L Precision Drone Sprayer",
    category: "Drone Sprayer",
    ownerName: "Chetan Deshmukh (Certified Pilot)",
    ownerVillage: "Ozar Airport Belt",
    ownerPhone: "+91 97631 88400",
    distanceKm: 6.8,
    rateType: "per_acre",
    rateAmount: 450,
    rating: 5.0,
    completedBookings: 142,
    availableFrom: "Slots Open Tomorrow Morning",
    specs: "Covers 1 acre in 7 mins with ultra-low volume electrostatic nozzles (saves 90% water)",
    driverIncluded: true,
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop"
  },
  {
    id: "m-3",
    name: "John Deere Multi-Crop Combine Harvester",
    category: "Combine Harvester",
    ownerName: "Bhausaheb Thorat",
    ownerVillage: "Pimpalgaon",
    ownerPhone: "+91 94231 66720",
    distanceKm: 9.5,
    rateType: "per_acre",
    rateAmount: 1800,
    rating: 4.8,
    completedBookings: 56,
    availableFrom: "Available from Feb 18",
    specs: "Wheat, Soybean, and Gram harvesting with zero grain-shatter loss",
    driverIncluded: true,
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop"
  },
  {
    id: "m-4",
    name: "Automatic Laser Land Leveler + Transmitter",
    category: "Laser Land Leveler",
    ownerName: "Anil Gite",
    ownerVillage: "Niphad",
    ownerPhone: "+91 98902 44310",
    distanceKm: 12.0,
    rateType: "per_hour",
    rateAmount: 800,
    rating: 4.9,
    completedBookings: 47,
    availableFrom: "Available Today",
    specs: "Creates 100% precision flat field gradient, saves 30% irrigation water",
    driverIncluded: true,
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop"
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let items = [...MACHINERY_LISTINGS];
    if (category && category !== "All") {
      items = items.filter(m => m.category === category);
    }

    return NextResponse.json({
      machinery: items,
      totalListings: items.length,
      updatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Machinery API error:", err);
    return NextResponse.json({ error: "Failed to fetch machinery listings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { machineryId, farmerName, farmerPhone, bookingDate, unitsRequested, totalEstimatedCost } = body;

    const bookingReceipt = {
      bookingId: `EQUIP-${Date.now().toString().slice(-6)}`,
      machineryId,
      farmerName,
      farmerPhone,
      bookingDate,
      unitsRequested,
      totalEstimatedCost,
      status: "Confirmed (Owner Dispatched)",
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: "Farm machinery booked successfully! Equipment operator has been notified.",
      receipt: bookingReceipt
    });
  } catch (err: any) {
    console.error("Machinery booking error:", err);
    return NextResponse.json({ error: "Failed to book machinery" }, { status: 500 });
  }
}
