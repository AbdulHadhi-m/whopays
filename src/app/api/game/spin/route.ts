import { NextRequest, NextResponse } from "next/server";
import clientPromise, { getMockDb } from "@/lib/mongodb";

// GET: Fetch recent spins (limit to 10)
export async function GET() {
  try {
    const client = await clientPromise;
    if (client) {
      const db = client.db("whopays");
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
    }));

  return NextResponse.json({ history: sortedHistory, success: true });
}

// POST: Trigger a new server spin and log it
export async function POST(req: NextRequest) {
  try {
    const { participants } = await req.json();

    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return NextResponse.json(
        { error: "At least 2 participants are required to make a choice!", success: false },
        { status: 400 }
      );
    }

    // Server-side secure random pick
    const selectedIndex = Math.floor(Math.random() * participants.length);
    const winnerName = participants[selectedIndex];

    const spinData = {
      participants,
      winner: winnerName,
      createdAt: new Date(),
    };

    // Try MongoDB
    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db("whopays");
        const result = await db.collection("spins").insertOne(spinData);
        return NextResponse.json({
          id: result.insertedId.toString(),
          selectedIndex,
          winner: winnerName,
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
      participants,
      winner: winnerName,
      createdAt: new Date(),
    };
    mockDb.push(newMockItem);

    return NextResponse.json({
      id: newMockItem.id,
      selectedIndex,
      winner: winnerName,
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
