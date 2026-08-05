export type UserRole = "admin" | "operator" | "technician" | "supervisor" | "viewer";

export type VehicleMode = "ground" | "air";

export type VehicleCategory = "sedan" | "suv" | "truck" | "motorcycle" | "van" | "air_urban" | "air_express" | "drone" | "eVTOL";

export interface Highway {
  id: number;
  name: string;
  highwayId: string;
  state: string;
  description: string;
  isActive: boolean;
  createdDate: string;
}

export interface MergeZone {
  id: number;
  zoneName: string;
  zoneId: string;
  highwayId: string;
  mileMarker: number;
  latitude: number;
  longitude: number;
  geofenceRadius: number;
  status: "active" | "warning" | "fault" | "maintenance" | "inactive";
  altitudeMeters: number;
  createdDate: string;
}

export interface SwitchServer {
  id: number;
  serverName: string;
  serverId: string;
  zoneId: string;
  highwayId: string;
  ipAddress: string;
  port: number;
  status: "online" | "degraded" | "offline" | "fault";
  firmwareVersion: string;
  uptimeSeconds: number;
  cpuPercent: number;
  memoryPercent: number;
  lastHeartbeat: string;
  altitudeMinMeters: number;
  altitudeMaxMeters: number;
  altitudeWidthMeters: number;
  gpsLocation: string;
  createdDate: string;
}

export interface SensorDevice {
  id: number;
  deviceName: string;
  deviceId: string;
  deviceType: "camera" | "lidar" | "radar" | "vehicle tag reader" | "acoustic";
  zoneId: string;
  highwayId: string;
  mileMarker: number;
  latitude: number;
  longitude: number;
  status: "online" | "warning" | "offline" | "fault";
  firmwareVersion: string;
  altitudeMeters: number;
  lastHeartbeat: string;
  createdDate: string;
}

export interface TriangulationConfig {
  id: number;
  zoneId: string;
  highwayId: string;
  geofenceRadius: number;
  isActive: boolean;
  switch1Label: string;
  switch1ServerId: string;
  switch1Lat: number;
  switch1Lon: number;
  switch2Label: string;
  switch2ServerId: string;
  switch2Lat: number;
  switch2Lon: string;
  switch3Label: string;
  switch3ServerId: string;
  switch3Lat: number;
  switch3Lon: number;
  createdDate: string;
}

export interface VehicleEvent {
  id: number;
  eventType: "detection" | "merge" | "conflict" | "speeding" | "fault" | "altitude_deviation";
  zoneId: string;
  highwayId: string;
  deviceId: string;
  vehicleId: string;
  speedMph: number;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  heading: number;
  direction?: string;
  vehicleMode: VehicleMode;
  vehicleCategory: VehicleCategory;
  isAirFlyCar: "Y" | "N";
  payload: string;
  createdDate: string;
}

export interface InputFormatConfig {
  id: number;
  formatName: string;
  sourceId: string;
  sourceType: "physical" | "satellite" | "telecom" | "tracker" | "tomtom";
  inputSource: string;
  description: string;
  enabledFieldsRaw: string;
  createdDate: string;
}

export interface SamplePayload {
  id: number;
  configId: number;
  sourceType: string;
  label: string;
  payload: string;
  isValid: boolean;
  createdDate: string;
}

export interface UserProfile {
  id: number;
  userId: string;
  fullName: string;
  userType: UserRole;
  phone: string;
  address?: string;
  highwayId: string;
  highwayName: string;
  notes: string;
  isActive: boolean;
  failedLoginAttempts: number;
  lockedUntil?: string | null;
  createdDate: string;
}

export interface AuditLog {
  id: number;
  userId: string;
  fullName: string;
  highwayId: string;
  controller: string;
  action: string;
  summary: string;
  ipAddress: string;
  createdDate: string;
}

export interface SimulationStatus {
  isRunning: boolean;
  highwayId: string;
  speedMultiplier: number;
  totalEventsGenerated: number;
  lastEventTime?: string;
}
