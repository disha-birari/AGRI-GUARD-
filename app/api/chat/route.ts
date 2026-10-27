import { NextRequest, NextResponse } from "next/server";

export interface ChatMessage {
  id: string;
  sender: "farmer" | "expert";
  senderName: string;
  text: string;
  timestamp: string;
  crop?: string;
  disease?: string;
}

// Global in-memory message store for real-time synchronization between farmer and expert views
let chatMessages: ChatMessage[] = [
  {
    id: "m1",
    sender: "farmer",
    senderName: "Ramesh Kumar",
    text: "Pranam Doctor. My tomato crop has some dark rings on lower leaves, is it Early Blight?",
    timestamp: "10:14 AM",
    crop: "Tomato",
    disease: "Early Blight"
  },
  {
    id: "m2",
    sender: "expert",
    senderName: "Dr. Priya Sharma",
    text: "Namaste Ramesh ji. Yes, concentric rings on lower leaves usually indicate Early Blight. Make sure you prune the lower leaves touching the soil first.",
    timestamp: "10:16 AM"
  },
  {
    id: "m3",
    sender: "farmer",
    senderName: "Ramesh Kumar",
    text: "Understood, I have pruned them. Should I spray buttermilk or Azoxystrobin fungicide?",
    timestamp: "10:18 AM"
  },
  {
    id: "m4",
    sender: "expert",
    senderName: "Dr. Priya Sharma",
    text: "If it has only affected 5% of the leaves, try organic buttermilk spray (50ml/L) first. If it spreads to upper canopy, apply Azoxystrobin (1ml/L) early morning.",
    timestamp: "10:20 AM"
  }
];

export async function GET() {
  return NextResponse.json({
    messages: chatMessages,
    updatedAt: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sender, senderName, text, crop, disease } = body;

    if (!sender || !text) {
      return NextResponse.json({ error: "Sender and text are required" }, { status: 400 });
    }

    const timeString = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName: senderName || (sender === "expert" ? "Dr. Priya Sharma" : "Farmer"),
      text,
      timestamp: timeString,
      crop,
      disease
    };

    chatMessages.push(newMessage);

    return NextResponse.json({
      success: true,
      message: newMessage
    });
  } catch (err: any) {
    console.error("Chat API post error:", err);
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
  }
}
