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
  SimulationStatus,
  VehicleCategory
} from "../types/mergesafe";
import { dataLayerLibrary, IDataLayerLibrary } from "../dal";

export interface MergeSafeDataState {
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
  currentUser: UserProfile | null;
  activeHighwayId: string;
  simulation: SimulationStatus;
  dalStatus: {
    initialized: boolean;
    version: string;
    lastCommit: string;
  };
}

class Store {
  private dal: IDataLayerLibrary = dataLayerLibrary;
  private state: MergeSafeDataState;
  private listeners: Set<() => void> = new Set();
  private simTimer: any = null;

  constructor() {
    this.state = this.buildStateFromDAL();
    if (this.state.simulation.isRunning) {
      this.startSimulation();
    }
  }

  private buildStateFromDAL(): MergeSafeDataState {
    const db = this.dal.getDbState();
    const userProfiles = this.dal.getUserProfiles();

    return {
      highways: db.highways,
      mergeZones: db.mergeZones,
      switchServers: db.switchServers,
      sensors: db.sensors,
      triangulationConfigs: db.triangulationConfigs,
      events: db.events,
      inputFormats: db.inputFormats,
      samplePayloads: db.samplePayloads,
      userProfiles: db.userProfiles,
      auditLogs: db.auditLogs,
      currentUser: userProfiles[0] || null,
      activeHighwayId: "I20-TX",
      simulation: {
        isRunning: true,
        highwayId: "I20-TX",
        speedMultiplier: 1,
        totalEventsGenerated: db.events.length,
        lastEventTime: new Date().toISOString()
      },
      dalStatus: {
        initialized: true,
        version: db.version,
        lastCommit: db.lastUpdated
      }
    };
  }

  public getState(): MergeSafeDataState {
    return this.state;
  }

  public getDAL(): IDataLayerLibrary {
    return this.dal;
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private syncAndNotify() {
    const db = this.dal.getDbState();
    this.state = {
      ...this.state,
      highways: db.highways,
      mergeZones: db.mergeZones,
      switchServers: db.switchServers,
      sensors: db.sensors,
      triangulationConfigs: db.triangulationConfigs,
      events: db.events,
      inputFormats: db.inputFormats,
      samplePayloads: db.samplePayloads,
      userProfiles: db.userProfiles,
      auditLogs: db.auditLogs,
      dalStatus: {
        initialized: true,
        version: db.version,
        lastCommit: db.lastUpdated
      }
    };
    this.listeners.forEach((fn) => fn());
  }

  public resetToSeed() {
    this.dal.resetToInitialSeed();
    this.syncAndNotify();
  }

  public setActiveHighway(highwayId: string) {
    this.state.activeHighwayId = highwayId;
    this.dal.addAuditLog("Portal", "SelectHighway", `Selected active highway context: ${highwayId}`, this.state.currentUser, highwayId);
    this.syncAndNotify();
  }

  public setCurrentUser(user: UserProfile | null) {
    this.state.currentUser = user;
    if (user) {
      this.dal.addAuditLog("Portal", "Login", `User ${user.fullName} logged in`, user, this.state.activeHighwayId);
    } else {
      this.dal.addAuditLog("Portal", "Logout", `User session ended`, null, this.state.activeHighwayId);
    }
    this.syncAndNotify();
  }

  public addAudit(controller: string, action: string, summary: string) {
    this.dal.addAuditLog(controller, action, summary, this.state.currentUser, this.state.activeHighwayId);
    this.syncAndNotify();
  }

  // --- CRUD Highway via DLL ---
  public saveHighway(highway: Partial<Highway>) {
    this.dal.saveHighway(highway, this.state.currentUser);
    this.syncAndNotify();
  }

  public deleteHighway(id: number) {
    this.dal.deleteHighway(id, this.state.currentUser);
    this.syncAndNotify();
  }

  // --- CRUD Merge Zone via DLL ---
  public saveMergeZone(zone: Partial<MergeZone>) {
    if (!zone.highwayId) zone.highwayId = this.state.activeHighwayId;
    this.dal.saveMergeZone(zone, this.state.currentUser);
    this.syncAndNotify();
  }

  public deleteMergeZone(id: number) {
    this.dal.deleteMergeZone(id, this.state.currentUser);
    this.syncAndNotify();
  }

  // --- CRUD Switch Server via DLL ---
  public saveSwitchServer(server: Partial<SwitchServer>) {
    if (!server.highwayId) server.highwayId = this.state.activeHighwayId;
    this.dal.saveSwitchServer(server, this.state.currentUser);
    this.syncAndNotify();
  }

  public deleteSwitchServer(id: number) {
    this.dal.deleteSwitchServer(id, this.state.currentUser);
    this.syncAndNotify();
  }

  // --- CRUD Sensors via DLL ---
  public saveSensor(sensor: Partial<SensorDevice>) {
    if (!sensor.highwayId) sensor.highwayId = this.state.activeHighwayId;
    this.dal.saveSensor(sensor, this.state.currentUser);
    this.syncAndNotify();
  }

  public deleteSensor(id: number) {
    this.dal.deleteSensor(id, this.state.currentUser);
    this.syncAndNotify();
  }

  // --- CRUD Triangulation via DLL ---
  public saveTriangulation(config: Partial<TriangulationConfig>) {
    if (!config.highwayId) config.highwayId = this.state.activeHighwayId;
    this.dal.saveTriangulation(config, this.state.currentUser);
    this.syncAndNotify();
  }

  // --- CRUD Users via DLL ---
  public saveUserProfile(profile: Partial<UserProfile>) {
    this.dal.saveUserProfile(profile, this.state.currentUser);
    this.syncAndNotify();
  }

  public deleteUserProfile(id: number) {
    this.dal.deleteUserProfile(id, this.state.currentUser);
    this.syncAndNotify();
  }

  // --- INGEST API SANDBOX via DLL ---
  public ingestEventPayload(rawPayload: string): { success: boolean; message: string; event?: VehicleEvent } {
    const result = this.dal.ingestVehicleEvent(rawPayload, this.state.activeHighwayId, this.state.currentUser);
    this.syncAndNotify();
    return result;
  }

  // --- SIMULATION ENGINE via DLL ---
  public toggleSimulation(running?: boolean) {
    const nextState = running !== undefined ? running : !this.state.simulation.isRunning;
    this.state.simulation.isRunning = nextState;
    if (nextState) {
      this.startSimulation();
      this.dal.addAuditLog("Traffic", "StartSimulation", "Started real-time traffic and AirFlyCar telemetry stream", this.state.currentUser, this.state.activeHighwayId);
    } else {
      this.stopSimulation();
      this.dal.addAuditLog("Traffic", "StopSimulation", "Paused real-time traffic simulation", this.state.currentUser, this.state.activeHighwayId);
    }
    this.syncAndNotify();
  }

  private startSimulation() {
    if (this.simTimer) clearInterval(this.simTimer);
    this.simTimer = setInterval(() => {
      this.generateSimulatedEvent();
    }, 3000);
  }

  private stopSimulation() {
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
  }

  private generateSimulatedEvent() {
    const activeHighway = this.state.activeHighwayId === "ALL" ? "I20-TX" : this.state.activeHighwayId;
    const availableZones = this.dal.getMergeZones(activeHighway);
    const zone = availableZones.length > 0 ? availableZones[Math.floor(Math.random() * availableZones.length)] : this.dal.getMergeZones()[0];

    if (!zone) return;

    const isAir = Math.random() > 0.45;
    const airCategories: VehicleCategory[] = ["air_express", "eVTOL", "drone", "air_urban"];
    const groundCategories: VehicleCategory[] = ["sedan", "suv", "truck", "van", "motorcycle"];

    const category = isAir
      ? airCategories[Math.floor(Math.random() * airCategories.length)]
      : groundCategories[Math.floor(Math.random() * groundCategories.length)];

    const isAirFlyCar = category === "air_express" || (isAir && Math.random() > 0.5);
    const speed = isAir ? Math.floor(Math.random() * 80 + 90) : Math.floor(Math.random() * 40 + 45);
    const altitude = isAir ? Math.floor(Math.random() * 320 + 80) : 0;

    const eventTypes: VehicleEvent["eventType"][] = ["detection", "detection", "merge", "detection", Math.random() > 0.8 ? "conflict" : "speeding"];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const vehicleId = isAir ? `AFC-${Math.floor(Math.random() * 899 + 100)}` : `VH-${Math.floor(Math.random() * 8999 + 1000)}`;

    const lat = zone.latitude + (Math.random() * 0.01 - 0.005);
    const lon = zone.longitude + (Math.random() * 0.01 - 0.005);

    const newEvent: VehicleEvent = {
      id: Date.now(),
      eventType,
      zoneId: zone.zoneId,
      highwayId: zone.highwayId,
      deviceId: `DEV-${Math.floor(Math.random() * 6 + 1).toString().padStart(4, "0")}`,
      vehicleId,
      speedMph: speed,
      latitude: Number(lat.toFixed(4)),
      longitude: Number(lon.toFixed(4)),
      altitudeMeters: altitude,
      heading: Math.floor(Math.random() * 360),
      vehicleMode: isAir ? "air" : "ground",
      vehicleCategory: category,
      isAirFlyCar: isAirFlyCar ? "Y" : "N",
      payload: JSON.stringify({
        simulated: true,
        vehicle_type: category,
        altitude_m: altitude,
        timestamp: new Date().toISOString()
      }),
      createdDate: new Date().toISOString()
    };

    this.dal.recordSimulatedEvent(newEvent);
    this.state.simulation.totalEventsGenerated += 1;
    this.state.simulation.lastEventTime = newEvent.createdDate;
    this.syncAndNotify();
  }
}

export const store = new Store();
