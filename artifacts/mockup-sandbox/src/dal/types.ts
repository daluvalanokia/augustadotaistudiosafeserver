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
  AuditLog,
  SimulationStatus
} from "../types/mergesafe";

export interface DatabaseStateSchema {
  version: string;
  lastUpdated: string;
  highways: Highway[];
  mergeZones: MergeZone[];
  switchServers: SwitchServer[];
  sensors: SensorDevice[];
  triangulationConfigs: TriangulationConfig[];
  events: VehicleEvent[];
  inputFormats: InputFormatConfig[];
  samplePayloads: SamplePayload[];
  userProfiles: UserProfile[];
  auditLogs: AuditLog[];
}

export interface IngestResult {
  success: boolean;
  message: string;
  event?: VehicleEvent;
}

export interface QueryFilterOptions {
  highwayId?: string;
  zoneId?: string;
  searchQuery?: string;
  modeFilter?: "ALL" | "air" | "ground";
  airFlyCarOnly?: boolean;
  limit?: number;
}

export interface IDataLayerLibrary {
  // Initialization & System
  getDbState(): DatabaseStateSchema;
  resetToInitialSeed(): DatabaseStateSchema;
  exportDatabaseBackup(): string;
  importDatabaseBackup(jsonString: string): { success: boolean; message: string };

  // Highways Repository
  getHighways(highwayIdFilter?: string): Highway[];
  getHighwayById(id: number): Highway | undefined;
  saveHighway(highway: Partial<Highway>, currentUser?: UserProfile | null): Highway;
  deleteHighway(id: number, currentUser?: UserProfile | null): boolean;

  // Merge Zones Repository
  getMergeZones(highwayIdFilter?: string): MergeZone[];
  getMergeZoneById(id: number): MergeZone | undefined;
  saveMergeZone(zone: Partial<MergeZone>, currentUser?: UserProfile | null): MergeZone;
  deleteMergeZone(id: number, currentUser?: UserProfile | null): boolean;

  // Switch Servers Repository
  getSwitchServers(highwayIdFilter?: string): SwitchServer[];
  getSwitchServerById(id: number): SwitchServer | undefined;
  saveSwitchServer(server: Partial<SwitchServer>, currentUser?: UserProfile | null): SwitchServer;
  deleteSwitchServer(id: number, currentUser?: UserProfile | null): boolean;

  // Sensor Devices Repository
  getSensors(highwayIdFilter?: string): SensorDevice[];
  getSensorById(id: number): SensorDevice | undefined;
  saveSensor(sensor: Partial<SensorDevice>, currentUser?: UserProfile | null): SensorDevice;
  deleteSensor(id: number, currentUser?: UserProfile | null): boolean;

  // Triangulation Matrix Repository
  getTriangulationConfigs(highwayIdFilter?: string): TriangulationConfig[];
  getTriangulationByZoneId(zoneId: string): TriangulationConfig | undefined;
  saveTriangulation(config: Partial<TriangulationConfig>, currentUser?: UserProfile | null): TriangulationConfig;

  // User Profiles Repository
  getUserProfiles(): UserProfile[];
  getUserById(id: number): UserProfile | undefined;
  saveUserProfile(profile: Partial<UserProfile>, currentUser?: UserProfile | null): UserProfile;
  deleteUserProfile(id: number, currentUser?: UserProfile | null): boolean;

  // Vehicle Events Repository (Telemetry & Ingest)
  getVehicleEvents(options?: QueryFilterOptions): VehicleEvent[];
  ingestVehicleEvent(rawPayload: string, highwayIdContext?: string, currentUser?: UserProfile | null): IngestResult;
  recordSimulatedEvent(event: VehicleEvent): VehicleEvent;

  // Audit Trail Repository
  getAuditLogs(query?: string): AuditLog[];
  addAuditLog(controller: string, action: string, summary: string, currentUser?: UserProfile | null, highwayIdContext?: string): AuditLog;

  // Input Formats & Samples
  getInputFormats(): InputFormatConfig[];
  getSamplePayloads(): SamplePayload[];
}
