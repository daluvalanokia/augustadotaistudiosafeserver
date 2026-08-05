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
  VehicleCategory
} from "../types/mergesafe";
import {
  INITIAL_HIGHWAYS,
  INITIAL_MERGE_ZONES,
  INITIAL_SWITCH_SERVERS,
  INITIAL_SENSORS,
  INITIAL_TRIANGULATION_CONFIGS,
  INITIAL_USER_PROFILES,
  INITIAL_EVENTS,
  INITIAL_INPUT_FORMATS,
  INITIAL_SAMPLE_PAYLOADS,
  INITIAL_AUDIT_LOGS
} from "../lib/seedData";
import {
  DatabaseStateSchema,
  IDataLayerLibrary,
  IngestResult,
  QueryFilterOptions
} from "./types";

const DLL_STORAGE_KEY = "mergesafe_dll_database_v3";
const CURRENT_DLL_VERSION = "1.2.0-DLL";

export class DataLayerLibrary implements IDataLayerLibrary {
  private dbState: DatabaseStateSchema;
  private isStorageAvailable: boolean = true;

  constructor() {
    this.dbState = this.initializeDatabase();
  }

  // --- PRIVATE DATABASE PERSISTENCE DRIVER ---
  private initializeDatabase(): DatabaseStateSchema {
    try {
      const raw = localStorage.getItem(DLL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.highways && Array.isArray(parsed.highways) && parsed.mergeZones) {
          return {
            version: CURRENT_DLL_VERSION,
            lastUpdated: new Date().toISOString(),
            ...parsed
          };
        }
      }
    } catch (err) {
      console.warn("[DataLayerLibrary] Failed reading local storage driver, reinitializing seed schema", err);
    }
    return this.createDefaultSeedSchema();
  }

  private createDefaultSeedSchema(): DatabaseStateSchema {
    return {
      version: CURRENT_DLL_VERSION,
      lastUpdated: new Date().toISOString(),
      highways: [...INITIAL_HIGHWAYS],
      mergeZones: [...INITIAL_MERGE_ZONES],
      switchServers: [...INITIAL_SWITCH_SERVERS],
      sensors: [...INITIAL_SENSORS],
      triangulationConfigs: [...INITIAL_TRIANGULATION_CONFIGS],
      events: [...INITIAL_EVENTS],
      inputFormats: [...INITIAL_INPUT_FORMATS],
      samplePayloads: [...INITIAL_SAMPLE_PAYLOADS],
      userProfiles: [...INITIAL_USER_PROFILES],
      auditLogs: [...INITIAL_AUDIT_LOGS]
    };
  }

  private persist(): void {
    try {
      this.dbState.lastUpdated = new Date().toISOString();
      localStorage.setItem(DLL_STORAGE_KEY, JSON.stringify(this.dbState));
    } catch (err) {
      console.error("[DataLayerLibrary] Storage Commit Error:", err);
      this.isStorageAvailable = false;
    }
  }

  // --- SYSTEM & MAINTENANCE APIS ---
  public getDbState(): DatabaseStateSchema {
    return this.dbState;
  }

  public resetToInitialSeed(): DatabaseStateSchema {
    this.dbState = this.createDefaultSeedSchema();
    this.addAuditLog("DLL_DataLayer", "ResetDatabase", "Executed full DLL database wipe and seed restoration");
    this.persist();
    return this.dbState;
  }

  public exportDatabaseBackup(): string {
    return JSON.stringify(this.dbState, null, 2);
  }

  public importDatabaseBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.highways || !parsed.mergeZones || !parsed.switchServers) {
        return { success: false, message: "Invalid DLL database payload: Missing required tables." };
      }
      this.dbState = {
        version: CURRENT_DLL_VERSION,
        lastUpdated: new Date().toISOString(),
        highways: parsed.highways || [],
        mergeZones: parsed.mergeZones || [],
        switchServers: parsed.switchServers || [],
        sensors: parsed.sensors || [],
        triangulationConfigs: parsed.triangulationConfigs || [],
        events: parsed.events || [],
        inputFormats: parsed.inputFormats || INITIAL_INPUT_FORMATS,
        samplePayloads: parsed.samplePayloads || INITIAL_SAMPLE_PAYLOADS,
        userProfiles: parsed.userProfiles || [],
        auditLogs: parsed.auditLogs || []
      };
      this.addAuditLog("DLL_DataLayer", "ImportBackup", "Imported external DLL JSON database state snapshot");
      this.persist();
      return { success: true, message: "DLL Database Backup imported successfully." };
    } catch (err: any) {
      return { success: false, message: `Backup Import Failed: ${err.message}` };
    }
  }

  // --- HIGHWAYS REPOSITORY ---
  public getHighways(highwayIdFilter?: string): Highway[] {
    if (!highwayIdFilter || highwayIdFilter === "ALL") {
      return this.dbState.highways;
    }
    return this.dbState.highways.filter((h) => h.highwayId === highwayIdFilter);
  }

  public getHighwayById(id: number): Highway | undefined {
    return this.dbState.highways.find((h) => h.id === id);
  }

  public saveHighway(highway: Partial<Highway>, currentUser?: UserProfile | null): Highway {
    let result: Highway;
    if (highway.id) {
      this.dbState.highways = this.dbState.highways.map((h) => {
        if (h.id === highway.id) {
          result = { ...h, ...highway };
          return result;
        }
        return h;
      });
      this.addAuditLog("HighwaysDAL", "Update", `Updated Highway Corridor ${highway.highwayId || highway.name}`, currentUser);
    } else {
      result = {
        id: Date.now(),
        name: highway.name || "New Highway Corridor",
        highwayId: highway.highwayId || `HWY-${Date.now().toString().slice(-4)}`,
        state: highway.state || "Georgia",
        description: highway.description || "",
        isActive: highway.isActive ?? true,
        createdDate: new Date().toISOString()
      };
      this.dbState.highways.push(result);
      this.addAuditLog("HighwaysDAL", "Create", `Created Highway Corridor ${result.highwayId}`, currentUser);
    }
    this.persist();
    return result!;
  }

  public deleteHighway(id: number, currentUser?: UserProfile | null): boolean {
    const target = this.getHighwayById(id);
    if (!target) return false;
    this.dbState.highways = this.dbState.highways.filter((h) => h.id !== id);
    this.addAuditLog("HighwaysDAL", "Delete", `Deleted Highway Corridor ${target.highwayId}`, currentUser);
    this.persist();
    return true;
  }

  // --- MERGE ZONES REPOSITORY ---
  public getMergeZones(highwayIdFilter?: string): MergeZone[] {
    if (!highwayIdFilter || highwayIdFilter === "ALL") {
      return this.dbState.mergeZones;
    }
    return this.dbState.mergeZones.filter((z) => z.highwayId === highwayIdFilter);
  }

  public getMergeZoneById(id: number): MergeZone | undefined {
    return this.dbState.mergeZones.find((z) => z.id === id);
  }

  public saveMergeZone(zone: Partial<MergeZone>, currentUser?: UserProfile | null): MergeZone {
    let result: MergeZone;
    if (zone.id) {
      this.dbState.mergeZones = this.dbState.mergeZones.map((z) => {
        if (z.id === zone.id) {
          result = { ...z, ...zone };
          return result;
        }
        return z;
      });
      this.addAuditLog("MergeZonesDAL", "Update", `Updated Merge Zone ${zone.zoneId || zone.zoneName}`, currentUser);
    } else {
      result = {
        id: Date.now(),
        zoneName: zone.zoneName || "New Merge Zone",
        zoneId: zone.zoneId || `MZ-${Date.now().toString().slice(-4)}`,
        highwayId: zone.highwayId || "I20-TX",
        mileMarker: zone.mileMarker || 100.0,
        latitude: zone.latitude || 33.4735,
        longitude: zone.longitude || -82.0105,
        geofenceRadius: zone.geofenceRadius || 500,
        status: zone.status || "active",
        altitudeMeters: zone.altitudeMeters || 120,
        createdDate: new Date().toISOString()
      };
      this.dbState.mergeZones.push(result);
      this.addAuditLog("MergeZonesDAL", "Create", `Created Merge Zone ${result.zoneId}`, currentUser);
    }
    this.persist();
    return result!;
  }

  public deleteMergeZone(id: number, currentUser?: UserProfile | null): boolean {
    const target = this.getMergeZoneById(id);
    if (!target) return false;
    this.dbState.mergeZones = this.dbState.mergeZones.filter((z) => z.id !== id);
    this.addAuditLog("MergeZonesDAL", "Delete", `Deleted Merge Zone ${target.zoneId}`, currentUser);
    this.persist();
    return true;
  }

  // --- SWITCH SERVERS REPOSITORY ---
  public getSwitchServers(highwayIdFilter?: string): SwitchServer[] {
    if (!highwayIdFilter || highwayIdFilter === "ALL") {
      return this.dbState.switchServers;
    }
    return this.dbState.switchServers.filter((s) => s.highwayId === highwayIdFilter);
  }

  public getSwitchServerById(id: number): SwitchServer | undefined {
    return this.dbState.switchServers.find((s) => s.id === id);
  }

  public saveSwitchServer(server: Partial<SwitchServer>, currentUser?: UserProfile | null): SwitchServer {
    let result: SwitchServer;
    if (server.id) {
      this.dbState.switchServers = this.dbState.switchServers.map((s) => {
        if (s.id === server.id) {
          result = { ...s, ...server };
          return result;
        }
        return s;
      });
      this.addAuditLog("SwitchServersDAL", "Update", `Updated Edge Switch Server ${server.serverId || server.serverName}`, currentUser);
    } else {
      result = {
        id: Date.now(),
        serverName: server.serverName || "New Edge Switch Node",
        serverId: server.serverId || `SRV-${Date.now().toString().slice(-4)}`,
        zoneId: server.zoneId || "I20-Z001",
        highwayId: server.highwayId || "I20-TX",
        ipAddress: server.ipAddress || "10.2.14.150",
        port: server.port || 8081,
        status: server.status || "online",
        firmwareVersion: server.firmwareVersion || "v3.3.0",
        uptimeSeconds: 1200,
        cpuPercent: 22.5,
        memoryPercent: 34.1,
        lastHeartbeat: new Date().toISOString(),
        altitudeMinMeters: server.altitudeMinMeters || 50,
        altitudeMaxMeters: server.altitudeMaxMeters || 250,
        altitudeWidthMeters: server.altitudeWidthMeters || 30,
        gpsLocation: server.gpsLocation || "33.4735, -82.0105",
        createdDate: new Date().toISOString()
      };
      this.dbState.switchServers.push(result);
      this.addAuditLog("SwitchServersDAL", "Create", `Created Edge Switch Server ${result.serverId}`, currentUser);
    }
    this.persist();
    return result!;
  }

  public deleteSwitchServer(id: number, currentUser?: UserProfile | null): boolean {
    const target = this.getSwitchServerById(id);
    if (!target) return false;
    this.dbState.switchServers = this.dbState.switchServers.filter((s) => s.id !== id);
    this.addAuditLog("SwitchServersDAL", "Delete", `Deleted Edge Switch Server ${target.serverId}`, currentUser);
    this.persist();
    return true;
  }

  // --- SENSOR DEVICES REPOSITORY ---
  public getSensors(highwayIdFilter?: string): SensorDevice[] {
    if (!highwayIdFilter || highwayIdFilter === "ALL") {
      return this.dbState.sensors;
    }
    return this.dbState.sensors.filter((s) => s.highwayId === highwayIdFilter);
  }

  public getSensorById(id: number): SensorDevice | undefined {
    return this.dbState.sensors.find((s) => s.id === id);
  }

  public saveSensor(sensor: Partial<SensorDevice>, currentUser?: UserProfile | null): SensorDevice {
    let result: SensorDevice;
    if (sensor.id) {
      this.dbState.sensors = this.dbState.sensors.map((s) => {
        if (s.id === sensor.id) {
          result = { ...s, ...sensor };
          return result;
        }
        return s;
      });
      this.addAuditLog("SensorsDAL", "Update", `Updated Sensor Device ${sensor.deviceId || sensor.deviceName}`, currentUser);
    } else {
      result = {
        id: Date.now(),
        deviceName: sensor.deviceName || "New LiDAR Sensor Node",
        deviceId: sensor.deviceId || `DEV-${Date.now().toString().slice(-4)}`,
        deviceType: sensor.deviceType || "radar",
        zoneId: sensor.zoneId || "I20-Z001",
        highwayId: sensor.highwayId || "I20-TX",
        mileMarker: sensor.mileMarker || 458.2,
        latitude: sensor.latitude || 33.4735,
        longitude: sensor.longitude || -82.0105,
        status: sensor.status || "online",
        firmwareVersion: sensor.firmwareVersion || "fw-2.14",
        altitudeMeters: sensor.altitudeMeters || 25,
        lastHeartbeat: new Date().toISOString(),
        createdDate: new Date().toISOString()
      };
      this.dbState.sensors.push(result);
      this.addAuditLog("SensorsDAL", "Create", `Created Sensor Device ${result.deviceId}`, currentUser);
    }
    this.persist();
    return result!;
  }

  public deleteSensor(id: number, currentUser?: UserProfile | null): boolean {
    const target = this.getSensorById(id);
    if (!target) return false;
    this.dbState.sensors = this.dbState.sensors.filter((s) => s.id !== id);
    this.addAuditLog("SensorsDAL", "Delete", `Deleted Sensor Device ${target.deviceId}`, currentUser);
    this.persist();
    return true;
  }

  // --- TRIANGULATION MATRIX REPOSITORY ---
  public getTriangulationConfigs(highwayIdFilter?: string): TriangulationConfig[] {
    if (!highwayIdFilter || highwayIdFilter === "ALL") {
      return this.dbState.triangulationConfigs;
    }
    return this.dbState.triangulationConfigs.filter((t) => t.highwayId === highwayIdFilter);
  }

  public getTriangulationByZoneId(zoneId: string): TriangulationConfig | undefined {
    return this.dbState.triangulationConfigs.find((t) => t.zoneId === zoneId);
  }

  public saveTriangulation(config: Partial<TriangulationConfig>, currentUser?: UserProfile | null): TriangulationConfig {
    let result: TriangulationConfig;
    if (config.id) {
      this.dbState.triangulationConfigs = this.dbState.triangulationConfigs.map((t) => {
        if (t.id === config.id) {
          result = { ...t, ...config };
          return result;
        }
        return t;
      });
      this.addAuditLog("TriangulationDAL", "Update", `Updated Triangulation Matrix for Zone ${config.zoneId}`, currentUser);
    } else {
      result = {
        id: Date.now(),
        zoneId: config.zoneId || "I20-Z001",
        highwayId: config.highwayId || "I20-TX",
        geofenceRadius: config.geofenceRadius || 500,
        isActive: config.isActive ?? true,
        switch1Label: config.switch1Label || "Node North",
        switch1ServerId: config.switch1ServerId || "SRV-1001",
        switch1Lat: config.switch1Lat || 33.475,
        switch1Lon: config.switch1Lon || -82.012,
        switch2Label: config.switch2Label || "Node East",
        switch2ServerId: config.switch2ServerId || "SRV-1002",
        switch2Lat: config.switch2Lat || 33.472,
        switch2Lon: config.switch2Lon || -82.008,
        switch3Label: config.switch3Label || "Node South",
        switch3ServerId: config.switch3ServerId || "SRV-1003",
        switch3Lat: config.switch3Lat || 33.471,
        switch3Lon: config.switch3Lon || -82.011,
        createdDate: new Date().toISOString()
      };
      this.dbState.triangulationConfigs.push(result);
      this.addAuditLog("TriangulationDAL", "Create", `Configured Triangulation Matrix for ${result.zoneId}`, currentUser);
    }
    this.persist();
    return result!;
  }

  // --- USER PROFILES REPOSITORY ---
  public getUserProfiles(): UserProfile[] {
    return this.dbState.userProfiles;
  }

  public getUserById(id: number): UserProfile | undefined {
    return this.dbState.userProfiles.find((u) => u.id === id);
  }

  public saveUserProfile(profile: Partial<UserProfile>, currentUser?: UserProfile | null): UserProfile {
    let result: UserProfile;
    if (profile.id) {
      this.dbState.userProfiles = this.dbState.userProfiles.map((u) => {
        if (u.id === profile.id) {
          result = { ...u, ...profile };
          return result;
        }
        return u;
      });
      this.addAuditLog("UserProfilesDAL", "Update", `Updated User Profile ${profile.fullName || profile.userId}`, currentUser);
    } else {
      result = {
        id: Date.now(),
        userId: profile.userId || `usr_${Date.now().toString().slice(-4)}`,
        fullName: profile.fullName || "New Traffic Specialist",
        userType: profile.userType || "operator",
        phone: profile.phone || "706-555-0199",
        address: profile.address || "Augusta, GA",
        highwayId: profile.highwayId || "I20-TX",
        highwayName: profile.highwayName || "Interstate 20 Corridor",
        notes: profile.notes || "",
        isActive: profile.isActive ?? true,
        failedLoginAttempts: 0,
        createdDate: new Date().toISOString()
      };
      this.dbState.userProfiles.push(result);
      this.addAuditLog("UserProfilesDAL", "Create", `Created User Profile ${result.userId}`, currentUser);
    }
    this.persist();
    return result!;
  }

  public deleteUserProfile(id: number, currentUser?: UserProfile | null): boolean {
    const target = this.getUserById(id);
    if (!target) return false;
    this.dbState.userProfiles = this.dbState.userProfiles.filter((u) => u.id !== id);
    this.addAuditLog("UserProfilesDAL", "Delete", `Deleted User Profile ${target.userId}`, currentUser);
    this.persist();
    return true;
  }

  // --- VEHICLE EVENTS REPOSITORY ---
  public getVehicleEvents(options?: QueryFilterOptions): VehicleEvent[] {
    let filtered = [...this.dbState.events];

    if (options) {
      if (options.highwayId && options.highwayId !== "ALL") {
        filtered = filtered.filter((e) => e.highwayId === options.highwayId);
      }
      if (options.zoneId) {
        filtered = filtered.filter((e) => e.zoneId === options.zoneId);
      }
      if (options.modeFilter && options.modeFilter !== "ALL") {
        filtered = filtered.filter((e) => e.vehicleMode === options.modeFilter);
      }
      if (options.airFlyCarOnly) {
        filtered = filtered.filter((e) => e.isAirFlyCar === "Y");
      }
      if (options.searchQuery?.trim()) {
        const q = options.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.vehicleId.toLowerCase().includes(q) ||
            e.zoneId.toLowerCase().includes(q) ||
            e.eventType.toLowerCase().includes(q) ||
            e.vehicleCategory.toLowerCase().includes(q)
        );
      }
      if (options.limit && options.limit > 0) {
        filtered = filtered.slice(0, options.limit);
      }
    }

    return filtered;
  }

  public ingestVehicleEvent(rawPayload: string, highwayIdContext: string = "I20-TX", currentUser?: UserProfile | null): IngestResult {
    try {
      const data = JSON.parse(rawPayload);
      const isAir =
        data.is_air_fly_car === "Y" ||
        data.vehicle_type === "air_express" ||
        data.vehicle_type === "eVTOL" ||
        data.vehicle_type === "drone" ||
        (data.altitude_m && Number(data.altitude_m) > 40);

      const newEvent: VehicleEvent = {
        id: Date.now(),
        eventType: data.event_type || (data.speed_mph > 85 ? "speeding" : "detection"),
        zoneId: data.zone_id || "I20-Z001",
        highwayId: data.highway_id || highwayIdContext,
        deviceId: data.device_id || "DEV-INGEST-01",
        vehicleId: data.vehicle_id || `VH-${Math.floor(Math.random() * 8999 + 1000)}`,
        speedMph: Number(data.speed_mph) || 65,
        latitude: Number(data.latitude) || 33.4735,
        longitude: Number(data.longitude) || -82.0105,
        altitudeMeters: Number(data.altitude_m) || (isAir ? 180 : 0),
        heading: Number(data.heading) || 90,
        vehicleMode: isAir ? "air" : "ground",
        vehicleCategory: (data.vehicle_type as VehicleCategory) || (isAir ? "air_express" : "sedan"),
        isAirFlyCar: data.is_air_fly_car === "Y" || data.vehicle_type === "air_express" ? "Y" : "N",
        payload: rawPayload,
        createdDate: new Date().toISOString()
      };

      this.dbState.events = [newEvent, ...this.dbState.events.slice(0, 249)];
      this.addAuditLog("EventsDAL", "IngestEvent", `Ingested telemetry payload for vehicle ${newEvent.vehicleId} (${newEvent.vehicleMode})`, currentUser);
      this.persist();

      return { success: true, message: `Successfully ingested vehicle event for ${newEvent.vehicleId}`, event: newEvent };
    } catch (err: any) {
      return { success: false, message: `Payload Parse Error: ${err.message}` };
    }
  }

  public recordSimulatedEvent(event: VehicleEvent): VehicleEvent {
    this.dbState.events = [event, ...this.dbState.events.slice(0, 249)];
    this.persist();
    return event;
  }

  // --- AUDIT TRAIL REPOSITORY ---
  public getAuditLogs(query?: string): AuditLog[] {
    if (!query?.trim()) {
      return this.dbState.auditLogs;
    }
    const q = query.toLowerCase();
    return this.dbState.auditLogs.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        a.controller.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }

  public addAuditLog(
    controller: string,
    action: string,
    summary: string,
    currentUser?: UserProfile | null,
    highwayIdContext: string = "I20-TX"
  ): AuditLog {
    const log: AuditLog = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      userId: currentUser ? currentUser.userId : "dll_core",
      fullName: currentUser ? currentUser.fullName : "DLL System Layer",
      highwayId: highwayIdContext,
      controller,
      action,
      summary,
      ipAddress: "127.0.0.1",
      createdDate: new Date().toISOString()
    };
    this.dbState.auditLogs = [log, ...this.dbState.auditLogs.slice(0, 149)];
    return log;
  }

  // --- CONFIGURATIONS ---
  public getInputFormats(): InputFormatConfig[] {
    return this.dbState.inputFormats;
  }

  public getSamplePayloads(): SamplePayload[] {
    return this.dbState.samplePayloads;
  }
}

// Singleton Export of the Data Layer Library (DLL)
export const dataLayerLibrary = new DataLayerLibrary();
