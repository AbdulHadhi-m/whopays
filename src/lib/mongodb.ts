import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Mock database storage for in-memory fallback
interface SpinHistoryItem {
  id: string;
  participants: string[];
  winner: string;
  createdAt: Date;
  type?: string;
}

// Global in-memory storage to persist session data during dev mode when DB is not connected
const globalRef = global as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
  mockDb: SpinHistoryItem[];
};

if (!globalRef.mockDb) {
  globalRef.mockDb = [
    {
      id: "mock-1",
      participants: ["Skibidi", "Gyatt", "Rizzler", "Fanum"],
      winner: "Gyatt",
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    },
    {
      id: "mock-2",
      participants: ["Alpha", "Beta", "Sigma", "Chad"],
      winner: "Sigma",
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    },
    {
      id: "mock-3",
      participants: ["Cap", "NoCap", "Slay", "Sus", "Bussin"],
      winner: "Cap",
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    }
  ];
}

export const getMockDb = () => globalRef.mockDb;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!globalRef._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalRef._mongoClientPromise = client.connect();
    }
    clientPromise = globalRef._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  console.warn(
    "⚠️ WARNING: MONGODB_URI is not defined in your environment variables. Using high-fidelity in-memory mock database fallback."
  );
}

export default clientPromise;
