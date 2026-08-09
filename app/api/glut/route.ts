import { NextRequest, NextResponse } from "next/server";

export interface GlutForecast {
  crop: string;
  region: string;
  glutRiskLevel: "Critical Glut Risk" | "Moderate Oversupply" | "Balanced Supply" | "Deficit (High Price)";
  projectedPriceCrashPercent: number; // e.g. -45%
  currentMandiPrice: number;
  predictedPriceIn14Days: number;
  arrivalSurgePercent: number; // e.g. +140%
  peakArrivalDate: string;
  recommendedActions: {
    coldStorage: {
      facilityName: string;
      location: string;
      distanceKm: number;
      availableTons: number;
      costPerMonthPerQuintal: number;
      shelfLifeDays: number;
    };
    interStateArbitrage: {
      destinationMandi: string;
      state: string;
      distanceKm: number;
      destinationPrice: number;
      netProfitAfterLongHaul: number;
    };
    foodProcessorConnect: {
      companyName: string;
      buyerType: string;
      contractPricePerKg: number;
      minAcceptanceTons: number;
      location: string;
    };
  };
}

const GLUT_DATABASE: Record<string, GlutForecast> = {
  Tomato: {
    crop: "Tomato",
    region: "Nashik & Northern Maharashtra Belt",
    glutRiskLevel: "Critical Glut Risk",
    projectedPriceCrashPercent: 42,
    currentMandiPrice: 2800,
    predictedPriceIn14Days: 1600,
    arrivalSurgePercent: 145,
    peakArrivalDate: "Feb 20 - Feb 26, 2024",
    recommendedActions: {
      coldStorage: {
        facilityName: "Nashik District Central Agri Cold Storage",
        location: "Ambad MIDC, Nashik",
        distanceKm: 18,
        availableTons: 450,
        costPerMonthPerQuintal: 85,
        shelfLifeDays: 28
      },
      interStateArbitrage: {
        destinationMandi: "Azadpur APMC, Delhi",
        state: "Delhi NCR",
        distanceKm: 1020,
        destinationPrice: 3800,
        netProfitAfterLongHaul: 2950
      },
      foodProcessorConnect: {
        companyName: "Sahyadri Agro Processing Farms Ltd.",
        buyerType: "Tomato Ketchup & Puree Pulping",
        contractPricePerKg: 19,
        minAcceptanceTons: 2,
        location: "Mohadi, Dindori"
      }
    }
  },
  Onion: {
    crop: "Onion",
    region: "Lasalgaon - Pimpalgaon Hub",
    glutRiskLevel: "Moderate Oversupply",
    projectedPriceCrashPercent: 18,
    currentMandiPrice: 3000,
    predictedPriceIn14Days: 2450,
    arrivalSurgePercent: 65,
    peakArrivalDate: "Mar 05 - Mar 12, 2024",
    recommendedActions: {
      coldStorage: {
        facilityName: "Lasalgaon Solar Onion Chawl Storage",
        location: "Lasalgaon Mandi Yard",
        distanceKm: 8,
        availableTons: 1200,
        costPerMonthPerQuintal: 45,
        shelfLifeDays: 120
      },
      interStateArbitrage: {
        destinationMandi: "Koyambedu APMC, Chennai",
        state: "Tamil Nadu",
        distanceKm: 1150,
        destinationPrice: 3600,
        netProfitAfterLongHaul: 2850
      },
      foodProcessorConnect: {
        companyName: "Jain Farm Fresh Foods",
        buyerType: "Onion Dehydration & Flakes",
        contractPricePerKg: 22,
        minAcceptanceTons: 5,
        location: "Jalgaon"
      }
    }
  },
  Chilli: {
    crop: "Chilli",
    region: "Nandurbar / Sinnar Green Belt",
    glutRiskLevel: "Balanced Supply",
    projectedPriceCrashPercent: 5,
    currentMandiPrice: 5100,
    predictedPriceIn14Days: 5250,
    arrivalSurgePercent: 10,
    peakArrivalDate: "Stable arrivals",
    recommendedActions: {
      coldStorage: {
        facilityName: "Sinnar Agro Cold Chain",
        location: "Sinnar Industrial Zone",
        distanceKm: 24,
        availableTons: 180,
        costPerMonthPerQuintal: 95,
        shelfLifeDays: 45
      },
      interStateArbitrage: {
        destinationMandi: "Vashi APMC, Mumbai",
        state: "Maharashtra",
        distanceKm: 140,
        destinationPrice: 5800,
        netProfitAfterLongHaul: 5350
      },
      foodProcessorConnect: {
        companyName: "Everest Spices Grinding Unit",
        buyerType: "Dry Spice Processing",
        contractPricePerKg: 48,
        minAcceptanceTons: 1,
        location: "Mumbai Port"
      }
    }
  }
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get("crop") || "Tomato";
    const forecast = GLUT_DATABASE[crop] || GLUT_DATABASE.Tomato;

    return NextResponse.json({
      crop,
      forecast,
      updatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Glut prediction API error:", err);
    return NextResponse.json({ error: "Failed to compute glut forecast" }, { status: 500 });
  }
}
