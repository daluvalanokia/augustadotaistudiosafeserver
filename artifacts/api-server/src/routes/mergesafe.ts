import { Router, Request, Response } from "express";

const router = Router();

// Mock in-memory state for API server endpoints mirroring the DLL schema
const dbState = {
  highways: [
    { id: 1, name: "Interstate 20 Corridor", highwayId: "I20-TX", state: "Texas/Georgia", description: "Primary East-West Air & Ground Corridor", isActive: true }
  ],
  mergeZones: [
    { id: 101, zoneName: "Augusta Air-Ground Interchange Alpha", zoneId: "I20-Z001", highwayId: "I20-TX", mileMarker: 458.2, latitude: 33.4735, longitude: -82.0105, geofenceRadius: 500, status: "active", altitudeMeters: 120 }
  ],
  switchServers: [
    { id: 201, serverName: "Augusta Edge Node 01", serverId: "SRV-1001", zoneId: "I20-Z001", highwayId: "I20-TX", ipAddress: "10.2.14.150", port: 8081, status: "online" }
  ],
  sensors: [
    { id: 301, deviceName: "LiDAR Array 01", deviceId: "DEV-1001", deviceType: "lidar", zoneId: "I20-Z001", highwayId: "I20-TX", mileMarker: 458.2, latitude: 33.4735, longitude: -82.0105, status: "online" }
  ],
  events: [] as any[]
};

// Highways Controller
router.get("/highways", (_req: Request, res: Response) => {
  res.json({ success: true, data: dbState.highways });
});

// Merge Zones Controller
router.get("/merge-zones", (_req: Request, res: Response) => {
  res.json({ success: true, data: dbState.mergeZones });
});

// Switch Servers Controller
router.get("/switch-servers", (_req: Request, res: Response) => {
  res.json({ success: true, data: dbState.switchServers });
});

// Sensors Controller
router.get("/sensors", (_req: Request, res: Response) => {
  res.json({ success: true, data: dbState.sensors });
});

// Telemetry Ingest Controller
router.post("/events/ingest", (req: Request, res: Response) => {
  const payload = req.body;
  const newEvent = {
    id: Date.now(),
    receivedAt: new Date().toISOString(),
    payload
  };
  dbState.events.push(newEvent);
  res.status(201).json({ success: true, message: "Telemetry ingested server-side", event: newEvent });
});

export default router;
