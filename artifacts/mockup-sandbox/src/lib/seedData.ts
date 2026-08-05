import {
  Highway,
  MergeZone,
  SwitchServer,
  SensorDevice,
  TriangulationConfig,
  VehicleEvent,
  InputFormatConfig,
  SamplePayload,
  UserProfile,
  AuditLog
} from "../types/mergesafe";

export const INITIAL_HIGHWAYS: Highway[] = [
  { id: 1, name: "Interstate 20 — Texas", highwayId: "I20-TX", state: "Texas", description: "East-West corridor through Dallas/Fort Worth", isActive: true, createdDate: "2026-05-20T00:00:00Z" },
  { id: 2, name: "Interstate 35 — Texas", highwayId: "I35-TX", state: "Texas", description: "North-South corridor through Austin/San Antonio", isActive: true, createdDate: "2026-05-20T00:00:00Z" },
  { id: 3, name: "Interstate 10 — Texas", highwayId: "I10-TX", state: "Texas", description: "Gulf Coast corridor through Houston to El Paso", isActive: true, createdDate: "2026-05-20T00:00:00Z" },
  { id: 4, name: "Interstate 45 — Texas", highwayId: "I45-TX", state: "Texas", description: "Houston to Dallas North-South freeway", isActive: true, createdDate: "2026-05-20T00:00:00Z" },
];

export const INITIAL_MERGE_ZONES: MergeZone[] = [
  { id: 1, zoneName: "I20 Dallas West Merge", zoneId: "I20-Z001", highwayId: "I20-TX", mileMarker: 458.2, latitude: 32.7220, longitude: -96.9870, geofenceRadius: 600, status: "active", altitudeMeters: 120, createdDate: "2026-05-20T00:00:00Z" },
  { id: 2, zoneName: "I20 Grand Prairie Exchange", zoneId: "I20-Z002", highwayId: "I20-TX", mileMarker: 444.5, latitude: 32.7213, longitude: -97.0207, geofenceRadius: 500, status: "active", altitudeMeters: 140, createdDate: "2026-05-20T00:00:00Z" },
  { id: 3, zoneName: "I20 Arlington Merge", zoneId: "I20-Z003", highwayId: "I20-TX", mileMarker: 436.1, latitude: 32.7199, longitude: -97.1081, geofenceRadius: 450, status: "fault", altitudeMeters: 150, createdDate: "2026-05-20T00:00:00Z" },
  { id: 4, zoneName: "I35 Waco North Merge", zoneId: "I35-Z001", highwayId: "I35-TX", mileMarker: 330.8, latitude: 31.5497, longitude: -97.1467, geofenceRadius: 550, status: "active", altitudeMeters: 250, createdDate: "2026-05-20T00:00:00Z" },
  { id: 5, zoneName: "I35 Temple Bypass Zone", zoneId: "I35-Z002", highwayId: "I35-TX", mileMarker: 304.2, latitude: 31.0985, longitude: -97.3428, geofenceRadius: 500, status: "maintenance", altitudeMeters: 220, createdDate: "2026-05-20T00:00:00Z" },
  { id: 6, zoneName: "I35 Georgetown Diverge", zoneId: "I35-Z003", highwayId: "I35-TX", mileMarker: 261.5, latitude: 30.6330, longitude: -97.6775, geofenceRadius: 480, status: "active", altitudeMeters: 280, createdDate: "2026-05-20T00:00:00Z" },
  { id: 7, zoneName: "I10 Houston West Merge", zoneId: "I10-Z001", highwayId: "I10-TX", mileMarker: 758.1, latitude: 29.7604, longitude: -95.5144, geofenceRadius: 600, status: "active", altitudeMeters: 180, createdDate: "2026-05-20T00:00:00Z" },
  { id: 8, zoneName: "I10 Katy Freeway Merge", zoneId: "I10-Z002", highwayId: "I10-TX", mileMarker: 741.3, latitude: 29.7855, longitude: -95.7560, geofenceRadius: 520, status: "active", altitudeMeters: 190, createdDate: "2026-05-20T00:00:00Z" },
  { id: 9, zoneName: "I10 Beaumont Approach", zoneId: "I10-Z003", highwayId: "I10-TX", mileMarker: 859.2, latitude: 30.0860, longitude: -94.1018, geofenceRadius: 470, status: "inactive", altitudeMeters: 160, createdDate: "2026-05-20T00:00:00Z" },
  { id: 10, zoneName: "I45 Houston North Merge", zoneId: "I45-Z001", highwayId: "I45-TX", mileMarker: 52.5, latitude: 29.9511, longitude: -95.3677, geofenceRadius: 550, status: "active", altitudeMeters: 110, createdDate: "2026-05-20T00:00:00Z" },
  { id: 11, zoneName: "I45 Conroe Junction", zoneId: "I45-Z002", highwayId: "I45-TX", mileMarker: 85.1, latitude: 30.3119, longitude: -95.4561, geofenceRadius: 500, status: "active", altitudeMeters: 130, createdDate: "2026-05-20T00:00:00Z" },
  { id: 12, zoneName: "I45 Huntsville Interchange", zoneId: "I45-Z003", highwayId: "I45-TX", mileMarker: 116.8, latitude: 30.7235, longitude: -95.5507, geofenceRadius: 490, status: "fault", altitudeMeters: 140, createdDate: "2026-05-20T00:00:00Z" },
];

export const INITIAL_SWITCH_SERVERS: SwitchServer[] = [
  { id: 1, serverName: "I20-Z001 Switch A", serverId: "SRV-0001", zoneId: "I20-Z001", highwayId: "I20-TX", ipAddress: "10.2.14.102", port: 8081, status: "online", firmwareVersion: "v3.2.14", uptimeSeconds: 432000, cpuPercent: 34.2, memoryPercent: 48.1, lastHeartbeat: "2026-08-05T08:15:00Z", altitudeMinMeters: 50, altitudeMaxMeters: 150, altitudeWidthMeters: 30, gpsLocation: "32.7220, -96.9870", createdDate: "2026-05-20T00:00:00Z" },
  { id: 2, serverName: "I20-Z001 Switch B", serverId: "SRV-0002", zoneId: "I20-Z001", highwayId: "I20-TX", ipAddress: "10.2.14.103", port: 8082, status: "online", firmwareVersion: "v3.2.14", uptimeSeconds: 431000, cpuPercent: 28.9, memoryPercent: 42.5, lastHeartbeat: "2026-08-05T08:16:00Z", altitudeMinMeters: 50, altitudeMaxMeters: 150, altitudeWidthMeters: 30, gpsLocation: "32.7225, -96.9880", createdDate: "2026-05-20T00:00:00Z" },
  { id: 3, serverName: "I20-Z001 Switch C", serverId: "SRV-0003", zoneId: "I20-Z001", highwayId: "I20-TX", ipAddress: "10.2.14.104", port: 8083, status: "degraded", firmwareVersion: "v3.1.9", uptimeSeconds: 120000, cpuPercent: 78.5, memoryPercent: 82.0, lastHeartbeat: "2026-08-05T08:10:00Z", altitudeMinMeters: 50, altitudeMaxMeters: 150, altitudeWidthMeters: 30, gpsLocation: "32.7215, -96.9860", createdDate: "2026-05-20T00:00:00Z" },
  { id: 4, serverName: "I35-Z001 Switch A", serverId: "SRV-0004", zoneId: "I35-Z001", highwayId: "I35-TX", ipAddress: "10.3.28.110", port: 8081, status: "online", firmwareVersion: "v3.3.0", uptimeSeconds: 780000, cpuPercent: 42.1, memoryPercent: 55.4, lastHeartbeat: "2026-08-05T08:18:00Z", altitudeMinMeters: 200, altitudeMaxMeters: 400, altitudeWidthMeters: 60, gpsLocation: "31.5497, -97.1467", createdDate: "2026-05-20T00:00:00Z" },
  { id: 5, serverName: "I35-Z001 Switch B", serverId: "SRV-0005", zoneId: "I35-Z001", highwayId: "I35-TX", ipAddress: "10.3.28.111", port: 8082, status: "online", firmwareVersion: "v3.3.0", uptimeSeconds: 780000, cpuPercent: 39.8, memoryPercent: 53.0, lastHeartbeat: "2026-08-05T08:18:00Z", altitudeMinMeters: 200, altitudeMaxMeters: 400, altitudeWidthMeters: 60, gpsLocation: "31.5500, -97.1480", createdDate: "2026-05-20T00:00:00Z" },
  { id: 6, serverName: "I10-Z001 Switch A", serverId: "SRV-0006", zoneId: "I10-Z001", highwayId: "I10-TX", ipAddress: "10.1.45.150", port: 8081, status: "online", firmwareVersion: "v3.2.14", uptimeSeconds: 520000, cpuPercent: 51.0, memoryPercent: 61.2, lastHeartbeat: "2026-08-05T08:19:00Z", altitudeMinMeters: 100, altitudeMaxMeters: 250, altitudeWidthMeters: 45, gpsLocation: "29.7604, -95.5144", createdDate: "2026-05-20T00:00:00Z" },
];

export const INITIAL_SENSORS: SensorDevice[] = [
  { id: 1, deviceName: "Lidar I20-Z001-1", deviceId: "DEV-0001", deviceType: "lidar", zoneId: "I20-Z001", highwayId: "I20-TX", mileMarker: 458.2, latitude: 32.7220, longitude: -96.9870, status: "online", firmwareVersion: "fw-2.12", altitudeMeters: 28, lastHeartbeat: "2026-08-05T08:18:00Z", createdDate: "2026-05-20T00:00:00Z" },
  { id: 2, deviceName: "Radar I20-Z001-2", deviceId: "DEV-0002", deviceType: "radar", zoneId: "I20-Z001", highwayId: "I20-TX", mileMarker: 458.3, latitude: 32.7222, longitude: -96.9865, status: "online", firmwareVersion: "fw-2.14", altitudeMeters: 35, lastHeartbeat: "2026-08-05T08:18:00Z", createdDate: "2026-05-20T00:00:00Z" },
  { id: 3, deviceName: "Camera I20-Z001-3", deviceId: "DEV-0003", deviceType: "camera", zoneId: "I20-Z001", highwayId: "I20-TX", mileMarker: 458.1, latitude: 32.7218, longitude: -96.9875, status: "online", firmwareVersion: "fw-1.80", altitudeMeters: 12, lastHeartbeat: "2026-08-05T08:17:00Z", createdDate: "2026-05-20T00:00:00Z" },
  { id: 4, deviceName: "Vehicle Tag Reader I20-Z001-4", deviceId: "DEV-0004", deviceType: "vehicle tag reader", zoneId: "I20-Z001", highwayId: "I20-TX", mileMarker: 458.25, latitude: 32.7221, longitude: -96.9868, status: "online", firmwareVersion: "fw-3.01", altitudeMeters: 6, lastHeartbeat: "2026-08-05T08:19:00Z", createdDate: "2026-05-20T00:00:00Z" },
  { id: 5, deviceName: "Radar I35-Z001-1", deviceId: "DEV-0005", deviceType: "radar", zoneId: "I35-Z001", highwayId: "I35-TX", mileMarker: 330.8, latitude: 31.5497, longitude: -97.1467, status: "online", firmwareVersion: "fw-2.14", altitudeMeters: 42, lastHeartbeat: "2026-08-05T08:19:00Z", createdDate: "2026-05-20T00:00:00Z" },
  { id: 6, deviceName: "Acoustic Sensor I10-Z001-1", deviceId: "DEV-0006", deviceType: "acoustic", zoneId: "I10-Z001", highwayId: "I10-TX", mileMarker: 758.1, latitude: 29.7604, longitude: -95.5144, status: "online", firmwareVersion: "fw-1.05", altitudeMeters: 15, lastHeartbeat: "2026-08-05T08:19:00Z", createdDate: "2026-05-20T00:00:00Z" },
];

export const INITIAL_TRIANGULATION_CONFIGS: TriangulationConfig[] = [
  {
    id: 1,
    zoneId: "I20-Z001",
    highwayId: "I20-TX",
    geofenceRadius: 600,
    isActive: true,
    switch1Label: "Switch A (North)",
    switch1ServerId: "SRV-0001",
    switch1Lat: 32.7240,
    switch1Lon: -96.9900,
    switch2Label: "Switch B (South-East)",
    switch2ServerId: "SRV-0002",
    switch2Lat: 32.7200,
    switch2Lon: -96.9840,
    switch3Label: "Switch C (West Edge)",
    switch3ServerId: "SRV-0003",
    switch3Lat: 32.7230,
    switch3Lon: -96.9840,
    createdDate: "2026-05-20T00:00:00Z"
  },
  {
    id: 2,
    zoneId: "I35-Z001",
    highwayId: "I35-TX",
    geofenceRadius: 550,
    isActive: true,
    switch1Label: "Switch A (Upper Corridor)",
    switch1ServerId: "SRV-0004",
    switch1Lat: 31.5517,
    switch1Lon: -97.1497,
    switch2Label: "Switch B (Bypass Node)",
    switch2ServerId: "SRV-0005",
    switch2Lat: 31.5477,
    switch2Lon: -97.1437,
    switch3Label: "Switch C (Diverge Monitor)",
    switch3ServerId: "SRV-0005",
    switch3Lat: 31.5507,
    switch3Lon: -97.1437,
    createdDate: "2026-05-20T00:00:00Z"
  }
];

export const INITIAL_USER_PROFILES: UserProfile[] = [
  { id: 1, userId: "admin001", fullName: "System Administrator", userType: "admin", phone: "214-555-0100", highwayId: "I20-TX", highwayName: "Interstate 20 — Texas", notes: "Primary system admin", isActive: true, failedLoginAttempts: 0, createdDate: "2026-05-20T00:00:00Z" },
  { id: 2, userId: "op001", fullName: "Maria Gonzalez", userType: "operator", phone: "817-555-0210", highwayId: "I20-TX", highwayName: "Interstate 20 — Texas", notes: "Day shift operator", isActive: true, failedLoginAttempts: 0, createdDate: "2026-05-20T00:00:00Z" },
  { id: 3, userId: "op002", fullName: "James Thompson", userType: "operator", phone: "214-555-0312", highwayId: "I35-TX", highwayName: "Interstate 35 — Texas", notes: "Night shift operator", isActive: true, failedLoginAttempts: 0, createdDate: "2026-05-20T00:00:00Z" },
  { id: 4, userId: "tech001", fullName: "Carlos Rivera", userType: "technician", phone: "512-555-0401", highwayId: "I35-TX", highwayName: "Interstate 35 — Texas", notes: "Field technician", isActive: true, failedLoginAttempts: 0, createdDate: "2026-05-20T00:00:00Z" },
  { id: 5, userId: "sup001", fullName: "Angela Kim", userType: "supervisor", phone: "713-555-0550", highwayId: "I10-TX", highwayName: "Interstate 10 — Texas", notes: "Regional supervisor", isActive: true, failedLoginAttempts: 0, createdDate: "2026-05-20T00:00:00Z" },
  { id: 6, userId: "view001", fullName: "Robert Davis", userType: "viewer", phone: "832-555-0611", highwayId: "I45-TX", highwayName: "Interstate 45 — Texas", notes: "Read-only viewer", isActive: true, failedLoginAttempts: 0, createdDate: "2026-05-20T00:00:00Z" },
];

export const INITIAL_EVENTS: VehicleEvent[] = [
  { id: 1, eventType: "detection", zoneId: "I20-Z001", highwayId: "I20-TX", deviceId: "DEV-0001", vehicleId: "AFC-8812", speedMph: 125, latitude: 32.7220, longitude: -96.9870, altitudeMeters: 185, heading: 90, vehicleMode: "air", vehicleCategory: "air_express", isAirFlyCar: "Y", payload: '{"vehicle_type":"air_express","altitude_m":185,"battery":88}', createdDate: "2026-08-05T08:14:00Z" },
  { id: 2, eventType: "merge", zoneId: "I20-Z001", highwayId: "I20-TX", deviceId: "DEV-0002", vehicleId: "VEH-4821", speedMph: 68, latitude: 32.7218, longitude: -96.9868, altitudeMeters: 0, heading: 85, vehicleMode: "ground", vehicleCategory: "sedan", isAirFlyCar: "N", payload: '{"vehicle_type":"sedan","lane":2}', createdDate: "2026-08-05T08:12:00Z" },
  { id: 3, eventType: "conflict", zoneId: "I20-Z001", highwayId: "I20-TX", deviceId: "DEV-0001", vehicleId: "eVTOL-902", speedMph: 110, latitude: 32.7223, longitude: -96.9872, altitudeMeters: 240, heading: 180, vehicleMode: "air", vehicleCategory: "eVTOL", isAirFlyCar: "N", payload: '{"conflict_type":"proximity_warning","min_distance_m":12.5}', createdDate: "2026-08-05T08:10:00Z" },
  { id: 4, eventType: "speeding", zoneId: "I35-Z001", highwayId: "I35-TX", deviceId: "DEV-0005", vehicleId: "VEH-9012", speedMph: 92, latitude: 31.5497, longitude: -97.1467, altitudeMeters: 0, heading: 10, vehicleMode: "ground", vehicleCategory: "truck", isAirFlyCar: "N", payload: '{"vehicle_type":"truck","speed_limit":70}', createdDate: "2026-08-05T08:05:00Z" },
  { id: 5, eventType: "detection", zoneId: "I10-Z001", highwayId: "I10-TX", deviceId: "DEV-0006", vehicleId: "DRONE-104", speedMph: 45, latitude: 29.7604, longitude: -95.5144, altitudeMeters: 95, heading: 270, vehicleMode: "air", vehicleCategory: "drone", isAirFlyCar: "N", payload: '{"purpose":"surveillance_patrol"}', createdDate: "2026-08-05T08:01:00Z" },
];

export const INITIAL_INPUT_FORMATS: InputFormatConfig[] = [
  { id: 1, formatName: "Standard Loop Detector Feed", sourceId: "SRC-PHY-001", sourceType: "physical", inputSource: "https://feeds.airways.net/physical/stream/1", description: "Standard physical loop detector telemetry stream", enabledFieldsRaw: "vehicle_id,timestamp,speed_mph,lane", createdDate: "2026-05-20T00:00:00Z" },
  { id: 2, formatName: "AirFlyCar High-Altitude Telemetry", sourceId: "SRC-SAT-002", sourceType: "satellite", inputSource: "https://feeds.airways.net/airflycar/stream/2", description: "GPS and ADS-B transmitter payload for AirFlyCars", enabledFieldsRaw: "vehicle_id,timestamp,speed_mph,latitude,longitude,altitude_m,is_air_fly_car", createdDate: "2026-05-20T00:00:00Z" },
  { id: 3, formatName: "Cellular V2X Protocol v4", sourceId: "SRC-TEL-003", sourceType: "telecom", inputSource: "https://feeds.airways.net/telecom/v2x/3", description: "Ultra-low latency 5G C-V2X vehicle message stream", enabledFieldsRaw: "vehicle_id,timestamp,speed_mph,altitude_m,event_type", createdDate: "2026-05-20T00:00:00Z" },
  { id: 4, formatName: "TomTom Live Traffic Feed", sourceId: "SRC-TOM-004", sourceType: "tomtom", inputSource: "https://api.tomtom.com/traffic/services/4", description: "TomTom regional traffic flow and incident data", enabledFieldsRaw: "vehicle_id,latitude,longitude,speed_mph", createdDate: "2026-05-20T00:00:00Z" },
];

export const INITIAL_SAMPLE_PAYLOADS: SamplePayload[] = [
  { id: 1, configId: 1, sourceType: "physical", label: "Loop Detector Sample A", payload: '{"vehicle_id":"VEH-4821","timestamp":"2026-05-20T09:32:11Z","speed_mph":67,"latitude":32.7767,"longitude":-96.9870,"altitude_m":0,"lane":2}', isValid: true, createdDate: "2026-05-20T00:00:00Z" },
  { id: 2, configId: 2, sourceType: "satellite", label: "AirFlyCar ADS-B Stream", payload: '{"vehicle_id":"AFC-8812","timestamp":"2026-05-20T10:11:05Z","speed_mph":135,"latitude":32.7220,"longitude":-96.9870,"altitude_m":185,"is_air_fly_car":"Y","vehicle_type":"air_express"}', isValid: true, createdDate: "2026-05-20T00:00:00Z" },
  { id: 3, configId: 3, sourceType: "telecom", label: "5G V2X Incident Packet", payload: '{"vehicle_id":"eVTOL-902","timestamp":"2026-05-20T11:44:22Z","speed_mph":110,"altitude_m":240,"event_type":"conflict","conflict_type":"proximity_warning"}', isValid: true, createdDate: "2026-05-20T00:00:00Z" },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 1, userId: "admin001", fullName: "System Administrator", highwayId: "I20-TX", controller: "Portal", action: "Login", summary: "User logged into MergeSafe Portal", ipAddress: "127.0.0.1", createdDate: "2026-08-05T08:00:00Z" },
  { id: 2, userId: "admin001", fullName: "System Administrator", highwayId: "I20-TX", controller: "Triangulation", action: "UpdateConfig", summary: "Updated triangulation node Switch A coordinates for Zone I20-Z001", ipAddress: "127.0.0.1", createdDate: "2026-08-05T08:05:00Z" },
  { id: 3, userId: "op001", fullName: "Maria Gonzalez", highwayId: "I20-TX", controller: "Sensors", action: "Calibrate", summary: "Triggered LiDAR device DEV-0001 recalibration", ipAddress: "10.2.14.45", createdDate: "2026-08-05T08:10:00Z" },
];
