import { Activity, Battery, Bluetooth, BrainCircuit, Camera, CircuitBoard, CircleDot, Contact, Cpu, Expand, HardDrive, Layers, MapPin, MemoryStick, Monitor, Nfc, Palette, PlugZap, Radio, RefreshCw, Ruler, Scale, ScanFace, Shield, Signal, Smartphone, Sun, Usb, Video, Wifi, Zap, ZoomIn, ArrowRightLeft, Volume2, AppWindow } from 'lucide-react';

/** Field-specific icons; category fallback keeps unknown manufacturer fields meaningful. */
export function specIcon(label: string, category = ''): typeof Monitor {
  const field = label.toLowerCase();
  if (/reverse/.test(field)) return ArrowRightLeft;
  if (/wireless|magsafe|qi2/.test(field)) return Radio;
  if (/charging|wired/.test(field)) return PlugZap;
  if (/brightness/.test(field)) return Sun;
  if (/refresh/.test(field)) return RefreshCw;
  if (/resolution/.test(field)) return Expand;
  if (/size|dimension/.test(field)) return Ruler;
  if (/weight/.test(field)) return Scale;
  if (/protection|ip rating|resistance/.test(field)) return Shield;
  if (/material|front & back/.test(field)) return Layers;
  if (/finish|color/.test(field)) return Palette;
  if (/sim|card slot/.test(field)) return Contact;
  if (/operating|software/.test(field)) return AppWindow;
  if (/ram|memory/.test(field)) return MemoryStick;
  if (/storage|drive/.test(field)) return HardDrive;
  if (/neural/.test(field)) return BrainCircuit;
  if (/gpu/.test(field)) return CircuitBoard;
  if (/chip|cpu|processor/.test(field)) return Cpu;
  if (/telephoto|zoom/.test(field)) return ZoomIn;
  if (/ultra wide/.test(field) && !/band/.test(field)) return Expand;
  if (/selfie|front camera|face/.test(field)) return ScanFace;
  if (/video/.test(field)) return Video;
  if (/camera|fusion/.test(field)) return Camera;
  if (/lidar|sensor/.test(field)) return Activity;
  if (/battery/.test(field)) return Battery;
  if (/cellular|5g/.test(field)) return Signal;
  if (/wi-fi|wifi|connectivity/.test(field)) return Wifi;
  if (/bluetooth/.test(field)) return Bluetooth;
  if (/nfc/.test(field)) return Nfc;
  if (/usb/.test(field)) return Usb;
  if (/position|gps/.test(field)) return MapPin;
  if (/wideband/.test(field)) return Radio;
  if (/audio|speaker/.test(field)) return Volume2;
  if (/display|screen|contrast/.test(field)) return Monitor;
  if (/platform/.test(field)) return Cpu;
  if (/power/.test(field)) return Zap;
  if (/body|build/.test(field)) return Smartphone;
  return category ? specIcon(category) : CircleDot;
}
