import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getMockDb } from "@/lib/mongodb";

// GET: Fetch recent spins (limit to 10)
export async function GET() {
  try {
    const client = await clientPromise;
    if (client) {
      const db = client.db("whopay");
      const spins = await db
        .collection("spins")
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();

      // Format for client-side state
      const history = spins.map((spin) => ({
        id: spin._id.toString(),
        participants: spin.participants,
        winner: spin.winner,
        createdAt: spin.createdAt.toISOString(),
        type: spin.type || "spin",
        dice1: spin.dice1,
        dice2: spin.dice2,
      }));

      return NextResponse.json({ history, success: true });
    }
  } catch (err) {
    console.error("MongoDB GET error:", err);
  }

  // Fallback to mock in-memory DB
  const mockDb = getMockDb();
  const sortedHistory = [...mockDb]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)
    .map((item) => ({
      id: item.id,
      participants: item.participants,
      winner: item.winner,
      createdAt: item.createdAt.toISOString(),
      type: item.type || "spin",
      dice1: (item as any).dice1,
      dice2: (item as any).dice2,
    }));

  return NextResponse.json({ history: sortedHistory, success: true });
}

// POST: Trigger a new server spin and log it
export async function POST(req: NextRequest) {
  try {
    const { participants, type = "spin" } = await req.json();

    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return NextResponse.json(
        { error: "At least 2 participants are required to make a choice!", success: false },
        { status: 400 }
      );
    }

    let selectedIndex: number;
    let winnerName: string;
    let dice1: number | undefined;
    let dice2: number | undefined;

    if (type === "dice") {
      dice1 = Math.floor(Math.random() * 6) + 1;
      dice2 = Math.floor(Math.random() * 6) + 1;
      selectedIndex = (dice1 + dice2) % participants.length;
      winnerName = participants[selectedIndex];
    } else {
      selectedIndex = Math.floor(Math.random() * participants.length);
      winnerName = participants[selectedIndex];
    }

    const spinData: any = {
      type,
      participants,
      winner: winnerName,
      createdAt: new Date(),
    };

    if (type === "dice") {
      spinData.dice1 = dice1;
      spinData.dice2 = dice2;
    }

    // Try MongoDB
    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db("whopay");
        const result = await db.collection("spins").insertOne(spinData);
        return NextResponse.json({
          id: result.insertedId.toString(),
          selectedIndex,
          winner: winnerName,
          dice1,
          dice2,
          type,
          success: true,
        });
      }
    } catch (dbErr) {
      console.error("MongoDB POST save error:", dbErr);
    }

    // Local Mock DB Fallback
    const mockDb = getMockDb();
    const newMockItem = {
      id: `mock-${Date.now()}`,
      type,
      participants,
      winner: winnerName,
      createdAt: new Date(),
      dice1,
      dice2,
    };
    mockDb.push(newMockItem);

    return NextResponse.json({
      id: newMockItem.id,
      selectedIndex,
      winner: winnerName,
      dice1,
      dice2,
      type,
      success: true,
    });
  } catch (err) {
    console.error("Global API POST error:", err);
    return NextResponse.json(
      { error: "Internal Server Error during spin", success: false },
      { status: 500 }
    );
  }
}
