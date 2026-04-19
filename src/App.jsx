import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

const initialUsers = [
  { username: 'Theory', password: 'Theory_tm', role: 'Empleado', displayName: 'Theory', rank: 'Jefe del Taller' },
  { username: 'Mk', password: 'rblack', role: 'Empleado', displayName: 'Mk', rank: 'Jefe del Taller' },
  { username: 'Kursten', password: 'karstenkursten', role: 'Empleado', displayName: 'Kursten', rank: 'Aprendiz' },
  { username: 'paikuan', password: 'Vaquilla', role: 'Empleado', displayName: 'paikuan', rank: 'Mecanico Senior' },
  { username: 'MarkSG06', password: 'markwarrior_111', role: 'Empleado', displayName: 'MarkSG06', rank: 'Aprendiz' },
  { username: 'Kraw0', password: 'pawa019', role: 'Empleado', displayName: 'Kraw0', rank: 'Aprendiz' },
  { username: '8.izaannn', password: '8izan', role: 'Empleado', displayName: '8.izaannn', rank: 'Aprendiz' },
  { username: 'Dr4c0_152', password: 'Dr4c0_152', role: 'Empleado', displayName: 'Dr4c0_152', rank: 'Aprendiz' },
];

const rankRates = {
  Aprendiz: 300,
  'Mecanico oficial': 400,
  'Mecanico Senior': 500,
  Gerente: 600,
  'Jefe del Taller': 700,
};

const initialProductsByCategory = {
  'Mejoras avanzadas': [
    { name: 'Tracción total (AWD)', normal: 920, convenio: 900 },
    { name: 'Tracción trasera (RWD)', normal: 600, convenio: 470 },
    { name: 'Tracción delantera (FWD)', normal: 600, convenio: 550 },
    { name: 'Neumáticos slick', normal: 700, convenio: 600 },
    { name: 'Neumáticos semi-slick', normal: 700, convenio: 650 },
    { name: 'Neumáticos offroad', normal: 700, convenio: 650 },
    { name: 'Frenos cerámicos', normal: 700, convenio: 650 },
    { name: 'Controlador de luces', normal: 900, convenio: 820 },
    { name: 'Kit de stancing', normal: 1000, convenio: 850 },
    { name: 'Piezas estéticas', normal: 800, convenio: 750 },
    { name: 'Kit de pintura', normal: 1000, convenio: 900 },
    { name: 'Juego de llantas', normal: 1200, convenio: 900 },
    { name: 'Kit de humo de ruedas', normal: 600, convenio: 500 },
    { name: 'Kit de extras', normal: 700, convenio: 600 },
    { name: 'Kit de limpieza', normal: 300, convenio: 220 },
    { name: 'Kit de reparación', normal: 1000, convenio: 850 },
    { name: 'Cinta americana', normal: 400, convenio: 300 },
    { name: 'Piezas de rendimiento', normal: 650, convenio: 600 },
    { name: 'Tablet de mecánico', normal: 0 },
    { name: 'Caja de cambios manual', normal: 600, convenio: 500 },
    { name: 'Motor I4', normal: 16000, },
    { name: 'Motor V6', normal: 25000 },
    { name: 'Motor V8', normal: 40000 },
    { name: 'Motor V12', normal: 60000 },
    { name: 'Turbo', normal: 15000 },
    { name: 'Motor eléctrico', normal: 20000 },
    { name: 'Batería eléctrica', normal: 7000 },
    { name: 'Refrigerante EV', normal: 5000 },
  ],
  Reparaciones: [
    { name: 'Reparación básica', normal: 600, convenio: 400 },
    { name: 'Kit reparación', normal: 1500, convenio: 1200 },
    { name: 'Kit limpieza', normal: 950, convenio: 700 },
    { name: 'Aceite de motor', normal: 150, convenio: 125 },
    { name: 'Neumáticos (repuesto)', normal: 200, convenio: 180 },
    { name: 'Embrague', normal: 170, convenio: 150 },
    { name: 'Filtro de aire', normal: 190, convenio: 170 },
    { name: 'Piezas de suspensión', normal: 230, convenio: 200 },
    { name: 'Bujía', normal: 400, convenio: 380 },
    { name: 'Pastillas de freno', normal: 220, convenio: 200 },
  ],
  Sedans: [
    { name: 'Albany Primo', normal: 4500 },
    { name: 'Albany Primo Custom', normal: 13000 },
    { name: 'Albany Washington', normal: 6500 },
    { name: 'Benefactor Glendale', normal: 3000 },
    { name: 'Benefactor Glendale Custom', normal: 11000 },
    { name: 'Benefactor Schafter', normal: 14500 },
    { name: 'Cheval Fugitive', normal: 18000 },
    { name: 'Cheval Surge', normal: 18000 },
    { name: 'Lampadati Cinquemila', normal: 95000 },
    { name: 'Declasse Asea', normal: 2200 },
    { name: 'Declasse Impaler SZ', normal: 80000 },
    { name: 'Declasse Premier', normal: 11000 },
    { name: 'Dundreary Regina', normal: 6500 },
    { name: 'Enus Cognoscenti', normal: 20500 },
    { name: 'Enus Cognoscenti 55', normal: 20000 },
    { name: 'Enus Deity', normal: 130000 },
    { name: 'Enus Jubilee', normal: 360000 },
    { name: 'Enus Stafford', normal: 27000 },
    { name: 'Enus Super Diamond', normal: 15500 },
    { name: 'Gallivanter Baller ST', normal: 115000 },
    { name: 'Karin Asterope', normal: 10000 },
    { name: 'Karin Asterope GZ', normal: 70000 },
    { name: 'Karin Intruder', normal: 10000 },
    { name: 'Obey I-Wagen', normal: 180000 },
    { name: 'Obey Tailgater', normal: 20000 },
    { name: 'Obey Tailgater S', normal: 60000 },
    { name: 'Pfister Astron', normal: 120000 },
    { name: 'Pfister Comet S2 Cabrio', normal: 130000 },
    { name: 'Ubermacht Oracle', normal: 20000 },
    { name: 'Ubermacht Rhinehart', normal: 80000 },
    { name: 'Vapid Stanier', normal: 17000 },
    { name: 'Vulcar Ingot', normal: 4500 },
    { name: 'Vulcar Warrener', normal: 3500 },
    { name: 'Vulcar Warrener HKR', normal: 27000 },
    { name: 'Willard Eudora', normal: 15500 },
    { name: 'Zirconium Stratum', normal: 13500 }
  ],

  Motos: [
    { name: 'WMC Sovereign', normal: 7200 },
    { name: 'Maibatsu Manchez', normal: 7500 },
    { name: 'Maibatsu Manchez Scout', normal: 12500 },
    { name: 'Maibatsu Manchez Scout Classic', normal: 13500 },
    { name: 'Maibatsu Sanchez', normal: 4800 },
    { name: 'Maibatsu Sanchez Livery', normal: 4800 },
    { name: 'Nagasaki BF400', normal: 20000 },
    { name: 'Nagasaki Carbon RS', normal: 20000 },
    { name: 'Nagasaki Chimera', normal: 19000 },
    { name: 'Nagasaki Shinobi', normal: 75000 },
    { name: 'Nagasaki Stryder', normal: 44000 },
    { name: 'Pegassi Bati 801', normal: 36500 },
    { name: 'Pegassi Bati 801RR', normal: 36500 },
    { name: 'Pegassi Esskey', normal: 11000 },
    { name: 'Pegassi Faggio', normal: 1700 },
    { name: 'Pegassi Faggio Mod', normal: 2200 },
    { name: 'Pegassi Faggio Sport', normal: 1800 },
    { name: 'Pegassi FCR 1000', normal: 4500 },
    { name: 'Pegassi FCR 1000 Custom', normal: 17000 },
    { name: 'Pegassi Ruffian', normal: 22000 },
    { name: 'Pegassi Vortex', normal: 28000 },
    { name: 'Principe Diabolus', normal: 27000 },
    { name: 'Principe Diabolus Custom', normal: 50000 },
    { name: 'Principe Lectro', normal: 25000 },
    { name: 'Principe Nemesis', normal: 18000 },
    { name: 'Shitzu Defiler', normal: 27000 },
    { name: 'Shitzu Hakuchou', normal: 47000 },
    { name: 'Shitzu Hakuchou Drag', normal: 72000 },
    { name: 'Shitzu PCJ-600', normal: 13500 },
    { name: 'Shitzu Vader', normal: 6500 },
    { name: 'Western Cliffhanger', normal: 26000 },
    { name: 'Western Daemon Custom', normal: 21000 },
    { name: 'Western Gargoyle', normal: 29000 },
    { name: 'Western Powersurge', normal: 6200 },
    { name: 'Western Rat Bike', normal: 2800 },
    { name: 'Western Reever', normal: 22000 },
    { name: 'Western Wolfsbane', normal: 12500 },
    { name: 'Western Zombie Bobber', normal: 25000 },
    { name: 'Western Zombie Chopper', normal: 24000 },
    { name: 'WMC Bagger', normal: 12000 },
    { name: 'WMC Daemon', normal: 12500 },
    { name: 'WMC Nightblade', normal: 21000 },
    { name: 'Dinka Akuma', normal: 64000 },
    { name: 'Dinka Double-T', normal: 36000 },
    { name: 'Dinka Enduro', normal: 5000 },
    { name: 'Dinka Thrust', normal: 20000 },
    { name: 'Dinka Vindicator', normal: 48000 },
    { name: 'LCC Avarus', normal: 18000 },
    { name: 'LCC Hexer', normal: 14500 },
    { name: 'LCC Sanctus', normal: 32000 },
    { name: 'LCC Innovation', normal: 30000 }
  ],
  Vans: [
    { name: 'BF Surfer', normal: 8200 },
    { name: 'BF Surfer Custom', normal: 13500 },
    { name: 'Bravado Bison', normal: 16500 },
    { name: 'Bravado Paradise', normal: 8200 },
    { name: 'Bravado Rumpo Custom', normal: 18000 },
    { name: 'Bravado Youga', normal: 7200 },
    { name: 'Bravado Youga Classic', normal: 13000 },
    { name: 'Bravado Youga Classic 4x4', normal: 13500 },
    { name: 'Declasse Burrito', normal: 3600 },
    { name: 'Declasse Burrito Custom', normal: 10500 },
    { name: 'Declasse Moonbeam', normal: 12000 },
    { name: 'Declasse Moonbeam Custom', normal: 13500 },
    { name: 'Vapid Bobcat XL Open', normal: 12000 },
    { name: 'Vapid Minivan', normal: 6400 },
    { name: 'Vapid Minivan Custom', normal: 9200 },
    { name: 'Vapid Speedo', normal: 9000 },
    { name: 'Vapid Speedo Custom', normal: 13500 },
    { name: 'Zirconium Journey', normal: 6000 },
    { name: 'Zirconium Journey II', normal: 6400 }
  ],
  'Off-Road': [
    { name: 'Annis BF Injection', normal: 8000 },
    { name: 'Annis Bifta', normal: 14000 },
    { name: 'Annis Blazer', normal: 6800 },
    { name: 'Annis Blazer Sport', normal: 8400 },
    { name: 'Annis Brawler', normal: 36000 },
    { name: 'Annis Dubsta 6x6', normal: 30000 },
    { name: 'Annis Dune Buggy', normal: 12500 },
    { name: 'Annis Hellion', normal: 34000 },
    { name: 'Canis Freecrawler', normal: 22000 },
    { name: 'Canis Kalahari', normal: 12500 },
    { name: 'Canis Kamacho', normal: 82000 },
    { name: 'Canis Mesa', normal: 11000 },
    { name: 'Canis Mesa Merryweather', normal: 50000 },
    { name: 'Canis Terminus', normal: 144000 },
    { name: 'Declasse Draugur', normal: 115000 },
    { name: 'Declasse Rancher XL', normal: 22000 },
    { name: 'Declasse Walton L35', normal: 128000 },
    { name: 'Declasse Yosemite Rancher', normal: 65000 },
    { name: 'Dinka Verus', normal: 18000 },
    { name: 'Karin Everon', normal: 75000 },
    { name: 'Maibatsu MonstroCiti', normal: 44000 },
    { name: 'Maxwell Vagrant', normal: 62000 },
    { name: 'Nagasaki Blazer Aqua', normal: 36000 },
    { name: 'Nagasaki Blazer Hot Rod', normal: 6400 },
    { name: 'Nagasaki Outlaw', normal: 27000 },
    { name: 'Vapid Caracara 4X4', normal: 105000 },
    { name: 'Vapid Rebel', normal: 18000 },
    { name: 'Vapid Riata', normal: 285000 },
    { name: 'Vapid Sandking SWB', normal: 34000 },
    { name: 'Vapid Sandking XL', normal: 22000 },
    { name: 'Vapid Winky', normal: 9000 }
  ],
  Compactos: [
    { name: 'Benefactor Panto', normal: 2800 },
    { name: 'Bf Club', normal: 7000 },
    { name: 'Bf Weevil', normal: 8000 },
    { name: 'Bollokan Prairie', normal: 22000 },
    { name: 'Declasse Rhapsody', normal: 9000 },
    { name: 'Dinka Blista', normal: 12000 },
    { name: 'Dinka Blista Compact', normal: 16000 },
    { name: 'Dinka Blista Go Go Monkey', normal: 13000 },
    { name: 'Dinka Blista Kanjo', normal: 11000 },
    { name: 'Grotti Brioso 300', normal: 11000 },
    { name: 'Grotti Brioso 300 Widebody', normal: 95000 },
    { name: 'Grotti Brioso R/A', normal: 18000 },
    { name: 'Karin Boor', normal: 20000 },
    { name: 'Karin Dilettante', normal: 8500 },
    { name: 'Maxwell Asbo', normal: 3500 },
    { name: 'Weeny Issi', normal: 6500 },
    { name: 'Weeny Issi Classic', normal: 4500 },
    { name: 'Weeny Issi Sport', normal: 75000 }
  ],

  Bicletas: [
    { name: 'BMX', normal: 150 },
    { name: 'Cruiser', normal: 480 },
    { name: 'Endurex Race Bike', normal: 660 },
    { name: 'Fixter', normal: 210 },
    { name: 'Scorcher', normal: 260 },
    { name: 'Tri-Cycles Race Bike', normal: 490 },
    { name: 'Whippet Race Bike', normal: 480 },
    { name: 'Coil Inductor', normal: 4500 },
    { name: 'Coil Junk Energy Inductor', normal: 4500 }
  ],
  Coupes: [
    { name: 'Classique Broadway', normal: 22000 },
    { name: 'Declasse Tahoma Coupe', normal: 15000 },
    { name: 'Dewbauchee Champion', normal: 160000 },
    { name: 'Dewbauchee Exemplar', normal: 48000 },
    { name: 'Dinka Kanjo SJ', normal: 15000 },
    { name: 'Dinka Postlude', normal: 70000 },
    { name: 'Enus Cognoscenti Cabrio', normal: 54000 },
    { name: 'Enus Windsor', normal: 48000 },
    { name: 'Enus Windsor Drop', normal: 48000 },
    { name: 'Fathom FR36', normal: 125000 },
    { name: 'Karin Futo', normal: 28000 },
    { name: 'Karin Previon', normal: 20000 },
    { name: 'Lampadati Felon', normal: 28000 },
    { name: 'Lampadati Felon GT', normal: 33000 },
    { name: 'Ocelot F620', normal: 36000 },
    { name: 'Ocelot Jackal', normal: 28000 },
    { name: 'Ubermacht Oracle XS', normal: 38000 },
    { name: 'Ubermacht Sentinel', normal: 45000 },
    { name: 'Ubermacht Sentinel Classic', normal: 68000 },
    { name: 'Ubermacht Sentinel XS', normal: 52000 },
    { name: 'Ubermacht Zion', normal: 32000 },
    { name: 'Ubermacht Zion Cabrio', normal: 38000 }
  ],
  SUVs: [
    { name: 'Albany Cavalcade', normal: 12500 },
    { name: 'Albany Cavalcade II', normal: 15000 },
    { name: 'Albany Cavalcade XL', normal: 125000 },
    { name: 'Benefactor Dubsta', normal: 17000 },
    { name: 'Benefactor Dubsta Luxury', normal: 17500 },
    { name: 'Benefactor Serrano', normal: 42000 },
    { name: 'Benefactor XLS', normal: 15500 },
    { name: 'Bravado Dorado', normal: 105000 },
    { name: 'Bravado Gresley', normal: 22000 },
    { name: 'Canis Castigator', normal: 122000 },
    { name: 'Canis Seminole', normal: 18000 },
    { name: 'Canis Seminole Frontier', normal: 12000 },
    { name: 'Declasse Granger', normal: 20000 },
    { name: 'Declasse Granger 3600LX', normal: 58000 },
    { name: 'Dundreary Landstalker', normal: 11000 },
    { name: 'Dundreary Landstalker XL', normal: 24000 },
    { name: 'Emperor Habanero', normal: 18000 },
    { name: 'Enus Huntley S', normal: 22000 },
    { name: 'Fathom FQ2', normal: 16500 },
    { name: 'Gallivanter Baller ST', normal: 20000 },
    { name: 'Gallivanter Baller II', normal: 13500 },
    { name: 'Gallivanter Baller LE', normal: 40000 },
    { name: 'Gallivanter Baller LWB', normal: 45000 },
    { name: 'Gallivanter Baller ST-D', normal: 130000 },
    { name: 'Karin BeeJay XL', normal: 17000 },
    { name: 'Karin Vivanite', normal: 122000 },
    { name: 'Lampadati Novak', normal: 70000 },
    { name: 'Mammoth Patriot', normal: 18000 },
    { name: 'Mil-Spec Patriot Military', normal: 200000 },
    { name: 'Obey Rocoto', normal: 28000 },
    { name: 'Pegassi Toros', normal: 90000 },
    { name: 'Ubermacht Rebla GTS', normal: 70000 },
    { name: 'Vapid Aleutian', normal: 140000 },
    { name: 'Vapid Contender', normal: 32000 },
    { name: 'Vapid Radius', normal: 16000 }
  ],
  Muscle: [
    { name: 'Albany Brigham', normal: 75000 },
    { name: 'Albany Buccaneer', normal: 20000 },
    { name: 'Albany Buccaneer Rider', normal: 22000 },
    { name: 'Albany Hermes', normal: 56000 },
    { name: 'Albany Manana', normal: 15000 },
    { name: 'Albany Manana Custom', normal: 22000 },
    { name: 'Albany Virgo', normal: 22000 },
    { name: 'Bf Weevil Custom', normal: 78000 },
    { name: 'Bravado Buffalo EVX', normal: 165000 },
    { name: 'Bravado Buffalo STX', normal: 160000 },
    { name: 'Bravado Classic Gauntlet', normal: 65000 },
    { name: 'Bravado Gauntlet', normal: 26000 },
    { name: 'Bravado Classic Gauntlet Custom', normal: 95000 },
    { name: 'Bravado Gauntlet Hellfire', normal: 80000 },
    { name: 'Bravado Greenwood', normal: 85000 },
    { name: 'Cheval Picador', normal: 20000 },
    { name: 'Declasse Drift Tampa', normal: 68000 },
    { name: 'Declasse Impaler LX', normal: 112000 },
    { name: 'Declasse Sabre GT Turbo', normal: 21000 },
    { name: 'Declasse Sabre GT Turbo Custom', normal: 24000 },
    { name: 'Declasse Stallion', normal: 30000 },
    { name: 'Declasse Tampa', normal: 22000 },
    { name: 'Declasse Tulip', normal: 68000 },
    { name: 'Declasse Tulip M-100', normal: 68000 },
    { name: 'Declasse Vamos', normal: 27000 },
    { name: 'Declasse Vigero', normal: 68000 },
    { name: 'Declasse Vigero ZX', normal: 95000 },
    { name: 'Declasse Vigero ZX Convertible', normal: 100000 },
    { name: 'Declasse Voodoo', normal: 16000 },
    { name: 'Declasse Yosemite', normal: 17500 },
    { name: 'Declasse Yosemite Drift', normal: 48000 },
    { name: 'Declasse Vigro Classic', normal: 20000 },
    { name: 'Declasse Virgo Custom Classic', normal: 22000 },
    { name: 'Imponte Beater Dukes', normal: 40000 },
    { name: 'Imponte Dukes', normal: 21000 },
    { name: 'Imponte Nightshade', normal: 60000 },
    { name: 'Imponte Phoenix', normal: 56000 },
    { name: 'Imponte Ruiner', normal: 26000 },
    { name: 'Imponte Ruiner ZZ-8', normal: 72000 },
    { name: 'Invetero Coquette BlackFin', normal: 60000 },
    { name: 'Ratoader Ratoader2', normal: 20000 },
    { name: 'Schyster Deviant', normal: 60000 },
    { name: 'Vapid Blade', normal: 21000 },
    { name: 'Vapid Chino', normal: 8000 },
    { name: 'Vapid Chino Luxe', normal: 12000 },
    { name: 'Vapid Clique', normal: 18000 },
    { name: 'Vapid Clique Wagon', normal: 82000 },
    { name: 'Vapid Dominator', normal: 54000 },
    { name: 'Vapid Dominator ASP', normal: 85000 },
    { name: 'Vapid Dominator GT', normal: 170000 },
    { name: 'Vapid Dominator GTT', normal: 65000 },
    { name: 'Vapid Dominator GTX', normal: 60000 },
    { name: 'Vapid Ellie', normal: 38000 },
    { name: 'Vapid Hustler', normal: 80000 },
    { name: 'Vapid Impaler', normal: 80000 },
    { name: 'Vapid Lost Slam Van', normal: 75000 },
    { name: 'Vapid Slam Van', normal: 27000 },
    { name: 'Vapid Slam Van Custom', normal: 15500 },
    { name: 'Willard Faction', normal: 18000 },
    { name: 'Willard Faction Custom Donk', normal: 32000 },
    { name: 'Willard Faction Rider', normal: 20000 }
  ],
  Super: [
    { name: 'Overflod Zeno', normal: 500000 },
    { name: 'Pegassi Ignus', normal: 420000 }
  ],
  'Sport Classic': [
    { name: 'Albany Franken Stange', normal: 70000 },
    { name: 'Albany Roosevelt', normal: 60000 },
    { name: 'Albany Roosevelt Valor', normal: 52000 },
    { name: 'Annis Savestra', normal: 55000 },
    { name: 'Benefactor Stirling GT', normal: 90000 },
    { name: 'Bollokan Envisage', normal: 148000 },
    { name: 'Declasse Mamba', normal: 110000 },
    { name: 'Declasse Tornado', normal: 22000 },
    { name: 'Declasse Tornado Convertible', normal: 24000 },
    { name: 'Declasse Tornado Custom', normal: 24000 },
    { name: 'Dewbauchee Rapid GT classic', normal: 72000 },
    { name: 'Grotti GT500', normal: 100000 },
    { name: 'Grotti Stinger', normal: 42000 },
    { name: 'Grotti Stinger GT', normal: 60000 },
    { name: 'Grotti Turismo Classic', normal: 170000 },
    { name: 'Invetero Coquette Classic', normal: 128000 },
    { name: 'Karin 190z', normal: 72000 },
    { name: 'Lampadati Casco', normal: 80000 },
    { name: 'Lampadati Michelli GT', normal: 32000 },
    { name: 'Lampadati Pigalle', normal: 75000 },
    { name: 'Lampadati Viseris', normal: 162000 },
    { name: 'Ocelot Ardent', normal: 35000 },
    { name: 'Ocelot Swinger', normal: 170000 },
    { name: 'Pegassi Infernus Classic', normal: 190000 },
    { name: 'Pegassi Monroe', normal: 90000 },
    { name: 'Pegassi Torero', normal: 140000 },
    { name: 'Rune Cheburek', normal: 9000 },
    { name: 'Truffade Z-Type', normal: 210000 },
    { name: 'Ubermacht Zion Classic', normal: 40000 },
    { name: 'Vapid Peyote', normal: 26000 },
    { name: 'Vapid Peyote Custom', normal: 42000 },
    { name: 'Vapid Peyote Gasser', normal: 36000 },
    { name: 'Vapid Retinue', normal: 35000 },
    { name: 'Vapid Retinue MKII', normal: 40000 },
    { name: 'Vapid Fagaloa', normal: 12000 },
    { name: 'Vulcar Nebula', normal: 25000 },
    { name: 'Vulcar Nebula Turbo', normal: 80000 },
    { name: 'Weeny Dynasty', normal: 28000 }
  ],
  Deportivos: [
    { name: 'Annis 300R', normal: 65000 },
    { name: 'Maibatsu Itai GTO Stinger TT', normal: 250000 },
    { name: 'Penaud La Coureuse', normal: 155000 },
    { name: 'Toundra Panthere', normal: 78000 },
    { name: 'Weeny Issi Rally', normal: 67000 }
  ],
};

const convenioData = {
  Badulaques: [],
  Talleres: [],
  Ocio: [],
  Servicios: ['LSPD'],['LSSM'],
  Organizaciones: [],
};

const categories = ['Reparaciones', 'Mejoras avanzadas', 'Sedans', 'Motos', 'Vans', 'Off-Road', 'Compactos', 'Bicletas', 'Coupes', 'SUVs', 'Muscle', 'Super', 'Sport Classic', 'Deportivos'];
const nav = ['Inicio', 'Dashboard', 'Productos & Ventas', 'Registros', 'Beneficios'];
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1495148788124356764/4ki9N586sLuCy20zCM7UX4Grnxm9N2aP6pnJViI14-6tC-qg5XZnl4Ee0rUnr80gV9E6';

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top right, rgba(234,179,8,0.08), transparent 28%), radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 24%), linear-gradient(180deg, #060606 0%, #040404 100%)',
    color: '#fff',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  app: { display: 'flex', minHeight: '100vh' },

  sidebar: {
    width: 306,
    background: 'linear-gradient(180deg, #040404 0%, #050505 100%)',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    padding: '20px 16px',
    boxSizing: 'border-box',
    boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.03)',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '4px 8px 0',
    marginBottom: 18,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    overflow: 'hidden',
    background: '#000',
    flexShrink: 0,
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
  },

  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  navWrap: {
    marginTop: 22,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  navButton: {
    width: '100%',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 22,
    padding: '16px 18px',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 800,
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.01)',
    color: '#f4f4f5',
    boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
  },

  navButtonActive: {
    background: 'linear-gradient(90deg, #facc15 0%, #bdbdbd 100%)',
    color: '#000',
    boxShadow: '0 0 0 2px rgba(255,255,255,0.9) inset, 0 0 24px rgba(234,179,8,.22)',
  },

  sideAction: {
    width: '100%',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 22,
    padding: '15px 18px',
    fontSize: 18,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
  },

  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 28px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'linear-gradient(180deg, rgba(8,8,8,0.96) 0%, rgba(5,5,5,0.96) 100%)',
  },

  content: {
    padding: 26,
    overflowY: 'auto',
    height: 'calc(100vh - 89px)',
    boxSizing: 'border-box',
  },

  title: {
    fontSize: 66,
    fontWeight: 900,
    margin: 0,
    lineHeight: 0.95,
    letterSpacing: '-0.05em',
    textAlign: 'center',
  },

  subtitle: {
    color: '#a1a1aa',
    fontSize: 26,
    marginTop: 8,
    textAlign: 'center',
  },

  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 0.9fr',
    gap: 18,
  },

  card: {
    borderRadius: 34,
    background: 'linear-gradient(180deg, rgba(12,12,12,0.98) 0%, rgba(7,7,7,0.98) 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: 24,
    boxSizing: 'border-box',
    boxShadow: '0 24px 50px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.03)',
  },

  darkCard: {
    borderRadius: 32,
    background: 'linear-gradient(180deg, rgba(7,7,7,0.98) 0%, rgba(3,3,3,0.98) 100%)',
    padding: 30,
    boxSizing: 'border-box',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 24px 50px rgba(0,0,0,0.34)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  buttonBig: {
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 32,
    padding: 36,
    minHeight: 238,
    fontSize: 30,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 24px 50px rgba(0,0,0,0.25)',
  },

  tableWrap: {
    overflow: 'hidden',
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,0.06)',
    marginTop: 18,
    background: '#090909',
  },

  tableScroller: {
    maxHeight: 420,
    overflow: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  th: {
    position: 'sticky',
    top: 0,
    background: '#2b2b31',
    padding: '18px 20px',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 900,
    zIndex: 1,
  },

  td: {
    padding: '18px 20px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    fontSize: 18,
  },

  productsPanel: {
    borderRadius: 34,
    background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(7,7,7,0.98) 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: 28,
    boxSizing: 'border-box',
    boxShadow: '0 26px 60px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.03)',
  },

  productsTitle: {
    fontSize: 76,
    lineHeight: 0.95,
    fontWeight: 900,
    margin: 0,
    letterSpacing: '-0.05em',
  },

  productsDesc: {
    marginTop: 22,
    maxWidth: 760,
    color: '#a1a1aa',
    fontSize: 26,
    lineHeight: 1.45,
  },

  productsCount: {
    fontSize: 28,
    lineHeight: 1.15,
    fontWeight: 900,
    textAlign: 'right',
    minWidth: 140,
  },

  productsTableWrap: {
    marginTop: 34,
    overflow: 'hidden',
    borderRadius: 34,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'linear-gradient(180deg, rgba(14,14,16,0.98) 0%, rgba(8,8,8,0.98) 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
  },

  productsTableScroller: { maxHeight: 630, overflow: 'auto' },

  productsHeadCell: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    padding: '20px 28px',
    textAlign: 'left',
    fontSize: 24,
    fontWeight: 900,
    color: '#f4f4f5',
    background: 'linear-gradient(90deg, rgba(46,46,52,0.98) 0%, rgba(34,34,38,0.98) 100%)',
  },

  productsCell: {
    padding: '20px 28px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    fontSize: 20,
    verticalAlign: 'top',
  },

  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 },

  categoryBtn: {
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 28,
    padding: '28px 18px',
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    background: 'linear-gradient(180deg, #232323 0%, #171717 100%)',
    cursor: 'pointer',
    boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'linear-gradient(180deg, #2b2b2b 0%, #232323 100%)',
    color: '#fff',
    padding: '16px 18px',
    fontSize: 19,
    outline: 'none',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
  },

  textarea: {
    width: '100%',
    minHeight: 160,
    boxSizing: 'border-box',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'linear-gradient(180deg, #2b2b2b 0%, #232323 100%)',
    color: '#fff',
    padding: '16px 18px',
    fontSize: 19,
    outline: 'none',
    resize: 'vertical',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
  },

  formBtn: {
    width: '100%',
    border: 'none',
    borderRadius: 20,
    padding: '18px 20px',
    background: 'linear-gradient(180deg, #facc15 0%, #eab308 100%)',
    color: '#000',
    fontSize: 24,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 16px 34px rgba(234,179,8,.22)',
  },

  badge: {
    borderRadius: 18,
    padding: '12px 18px',
    fontSize: 20,
    fontWeight: 800,
    boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
  },

  listCard: {
    borderRadius: 26,
    background: 'linear-gradient(180deg, #20356d 0%, #182852 100%)',
    padding: 20,
    boxShadow: '0 18px 40px rgba(0,0,0,0.2)',
  },

  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },

  statCard: {
    borderRadius: 24,
    background: 'linear-gradient(180deg, #202020 0%, #171717 100%)',
    padding: 24,
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 16px 34px rgba(0,0,0,0.22)',
  },

  greenBox: {
    marginTop: 18,
    borderRadius: 26,
    background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
    color: '#fff',
    padding: 24,
    boxShadow: '0 20px 40px rgba(34,197,94,0.18)',
  },
};


const dateTimeNow = () => new Date().toISOString();
const pad = (n) => String(n).padStart(2, '0');
const formatDate = (iso) => {
  if (!iso) return '--';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '--';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const formatTime = (iso) => {
  if (!iso) return '--:--';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '--:--';
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const currency = (n) => {
  if (n === null || n === undefined || n === '') return '—';
  const num = Number(n);
  if (!Number.isFinite(num)) return '—';
  return `$${num.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};
const diffMinutes = (start, end) => {
  const a = new Date(start);
  const b = new Date(end);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  return Math.max(0, Math.floor((b - a) / 60000));
};
const formatMinutes = (mins) => `${Math.floor(mins / 60)}h ${mins % 60}m`;
const formatHoursLong = (mins) => `${Math.floor(mins / 60)} h ${mins % 60} min`;

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function runSelfTests() {
  console.assert(typeof dateTimeNow() === 'string', 'dateTimeNow debe devolver string');
  console.assert(currency(4500) === '$4.500', 'currency debe usar formato GTA');
  console.assert(diffMinutes('2026-04-18T10:00:00.000Z', '2026-04-18T11:30:00.000Z') === 90, 'diffMinutes incorrecto');
}
runSelfTests();

async function sendEventRegistrationToDiscord({ participant, event, note, createdBy, rank, time }) {
  if (!DISCORD_WEBHOOK_URL) return { ok: false, skipped: true };
  const payload = {
    username: 'Bennys Original',
    embeds: [
      {
        title: 'Nueva inscripción de evento',
        color: 15844367,
        fields: [
          { name: 'Participante', value: participant || '—', inline: true },
          { name: 'Evento', value: event || '—', inline: true },
          { name: 'Registrado por', value: createdBy || '—', inline: true },
          { name: 'Rango', value: rank || '—', inline: true },
          { name: 'Fecha', value: new Date(time).toLocaleString('es-ES'), inline: true },
          { name: 'Observación', value: note?.trim() ? note : 'Sin observaciones', inline: false },
        ],
      },
    ],
  };
  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return { ok: response.ok, skipped: false };
}

async function sendSaleToDiscord({ product, amount, employee, rank, category, time }) {
  if (!DISCORD_WEBHOOK_URL) return { ok: false, skipped: true };

  const payload = {
    username: 'Bennys Original',
    content: `💰 Nueva venta registrada por ${employee || '—'}`,
    embeds: [
      {
        title: 'Nueva venta registrada',
        color: 5763719,
        fields: [
          { name: 'Producto', value: String(product || '—'), inline: true },
          { name: 'Monto', value: String(currency(amount)), inline: true },
          { name: 'Categoría', value: String(category || '—'), inline: true },
          { name: 'Empleado', value: String(employee || '—'), inline: true },
          { name: 'Rango', value: String(rank || '—'), inline: true },
          { name: 'Fecha', value: String(new Date(time).toLocaleString('es-ES')), inline: true },
        ],
      },
    ],
  };

  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    return { ok: false, skipped: false, error: errorText };
  }

  return { ok: true, skipped: false };
}

function StatCard({ title, value, subtitle, valueClass }) {
  return (
    <div style={styles.statCard}>
      <div style={{ fontSize: 28, fontWeight: 800 }}>{title}</div>
      {subtitle ? <div style={{ color: '#a1a1aa', marginTop: 6, fontSize: 18 }}>{subtitle}</div> : null}
      <div style={{ marginTop: 16, fontSize: 46, fontWeight: 900, ...(valueClass || {}) }}>{value}</div>
    </div>
  );
}

export default function BennysOriginalDashboard() {
  const [users] = useState(initialUsers);
  const [session, setSession] = useState(() => loadLS('bennys_session', null));
  const [activeNav, setActiveNav] = useState('Inicio');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('Reparaciones');
  const [selectedConvenio, setSelectedConvenio] = useState('Servicios');
  const [sales, setSales] = useState(() => loadLS('bennys_sales', []));
  const [shifts, setShifts] = useState(() => loadLS('bennys_shifts', []));
  const [eventRegistrations, setEventRegistrations] = useState(() => loadLS('bennys_events', []));
  const [plates, setPlates] = useState(() => {
    const saved = loadLS('bennys_plates', []);
    if (!Array.isArray(saved)) return [];
    return saved
      .map((item) => {
        if (typeof item === 'string') return { plate: item, count: 1, product: '' };
        return {
          plate: item?.plate || item?.Placa || '',
          count: Number(item?.count || item?.Veces || 1),
          product: item?.product || item?.Producto || '',
        };
      })
      .filter((item) => item.plate);
  });
  const [saleForm, setSaleForm] = useState({ product: '', amount: '', source: '' });
  const [eventForm, setEventForm] = useState({ participant: '', event: '', note: '' });
  const [plateInput, setPlateInput] = useState('231');
  const [plateProductInput, setPlateProductInput] = useState('');
  const [eventStatus, setEventStatus] = useState('');
  const [saleStatus, setSaleStatus] = useState('');

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => localStorage.setItem('bennys_session', JSON.stringify(session)), [session]);
  useEffect(() => localStorage.setItem('bennys_sales', JSON.stringify(sales)), [sales]);
  useEffect(() => localStorage.setItem('bennys_shifts', JSON.stringify(shifts)), [shifts]);
  useEffect(() => localStorage.setItem('bennys_events', JSON.stringify(eventRegistrations)), [eventRegistrations]);
  useEffect(() => localStorage.setItem('bennys_plates', JSON.stringify(plates)), [plates]);

  const currentShift = useMemo(() => {
    if (!session?.username) return null;
    return [...shifts].reverse().find((s) => s.nombre === session.username && !s.end) || null;
  }, [shifts, session]);

  const visibleProducts = useMemo(() => initialProductsByCategory[selectedCategory] || [], [selectedCategory]);
  const workedMinutes = useMemo(() => {
    if (!session?.username) return 0;
    return shifts
      .filter((s) => s.nombre === session.username)
      .reduce((acc, s) => acc + diffMinutes(s.start, s.end || dateTimeNow()), 0);
  }, [shifts, session]);

  const salesTotal = useMemo(() => sales.reduce((acc, s) => acc + Number(s.amount || 0), 0), [sales]);
  const salesCommission = useMemo(() => salesTotal * 0.2, [salesTotal]);
  const currentRank = session?.rank || 'Aprendiz';
  const hourlyRate = rankRates[currentRank] || 300;
  const subtotalHoras = useMemo(() => (workedMinutes / 60) * hourlyRate, [workedMinutes, hourlyRate]);
  const bonoApertura = currentShift ? 300 : 0;
  const bonoEvento = eventRegistrations.length * 50;
  const payrollTotal = subtotalHoras + salesCommission + bonoApertura + bonoEvento;
  const salesVisible = useMemo(() => [...sales].sort((a, b) => new Date(b.time) - new Date(a.time)), [sales]);

  const shiftRows = useMemo(
    () =>
      [...shifts]
        .sort((a, b) => new Date(b.start) - new Date(a.start))
        .map((s) => ({
          ...s,
          fecha: formatDate(s.start),
          entrada: formatTime(s.start),
          salida: s.end ? formatTime(s.end) : '--:--',
          horas: formatMinutes(diffMinutes(s.start, s.end || dateTimeNow())),
        })),
    [shifts]
  );

  const convenioEntries = useMemo(
    () => Object.entries(convenioData).map(([cat, list]) => ({ cat, count: `${list.length} locales`, active: cat === selectedConvenio })),
    [selectedConvenio]
  );

  const salesRanking = useMemo(() => {
    const totals = {};
    sales.forEach((sale) => {
      const employeeName = sale.employee || 'Sin asignar';
      totals[employeeName] = (totals[employeeName] || 0) + Number(sale.amount || 0);
    });
    return Object.entries(totals)
      .map(([name, total]) => ({ name, total }))
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [sales]);

  const hoursRanking = useMemo(() => {
    const totals = {};
    shifts
      .filter((shift) => !!shift.end)
      .forEach((shift) => {
        const minutes = diffMinutes(shift.start, shift.end);
        const displayName = users.find((u) => u.username === shift.nombre)?.displayName || shift.nombre;
        totals[displayName] = (totals[displayName] || 0) + minutes;
      });

    return Object.entries(totals)
      .map(([name, totalMinutes]) => ({ name, totalMinutes }))
      .filter((item) => item.totalMinutes > 0)
      .sort((a, b) => b.totalMinutes - a.totalMinutes)
      .slice(0, 5);
  }, [shifts, users]);

  const workerOfTheWeek = useMemo(() => {
    if (salesRanking.length === 0 && hoursRanking.length === 0) return 'Sin datos';

    const scoreMap = {};
    const maxSales = salesRanking[0]?.total || 0;
    const maxHours = hoursRanking[0]?.totalMinutes || 0;

    salesRanking.forEach((item) => {
      const salesScore = maxSales > 0 ? item.total / maxSales : 0;
      scoreMap[item.name] = {
        name: item.name,
        sales: item.total,
        hours: scoreMap[item.name]?.hours || 0,
        score: (scoreMap[item.name]?.score || 0) + salesScore,
      };
    });

    hoursRanking.forEach((item) => {
      const hoursScore = maxHours > 0 ? item.totalMinutes / maxHours : 0;
      scoreMap[item.name] = {
        name: item.name,
        sales: scoreMap[item.name]?.sales || 0,
        hours: item.totalMinutes,
        score: (scoreMap[item.name]?.score || 0) + hoursScore,
      };
    });

    const best = Object.values(scoreMap).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.sales !== a.sales) return b.sales - a.sales;
      return b.hours - a.hours;
    })[0];

    return best?.name || 'Sin datos';
  }, [salesRanking, hoursRanking]);

  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find((u) => u.username === loginForm.username && u.password === loginForm.password);
    if (!found) {
      setLoginError('Usuario o contraseña incorrectos');
      return;
    }
    setLoginError('');
    setSession({ username: found.username, role: found.role, displayName: found.displayName, rank: found.rank, loginAt: dateTimeNow() });
  };

  const handleClockIn = () => {
    if (!session?.username || currentShift) return;
    setShifts((prev) => [...prev, { id: Date.now(), nombre: session.username, start: dateTimeNow(), end: null }]);
  };

  const handleClockOut = () => {
    if (!currentShift) return;
    setShifts((prev) => prev.map((s) => (s.id === currentShift.id ? { ...s, end: dateTimeNow() } : s)));
  };

  const pickPrice = (product, price, label) => {
    if (price === null || price === undefined || !Number.isFinite(Number(price))) return;
    setSaleForm({ product: product.name, amount: String(price), source: `${label} seleccionado` });
  };

  const handleAddSale = async () => {
    const amount = Number(saleForm.amount);
    if (!saleForm.product.trim() || !Number.isFinite(amount) || amount <= 0) return;

    const newSale = {
      id: Date.now(),
      name: saleForm.product.trim(),
      time: dateTimeNow(),
      amount,
      employee: session.displayName,
    };

    setSales((prev) => [newSale, ...prev]);
    setSaleForm({ product: '', amount: '', source: '' });

    try {
      const result = await sendSaleToDiscord({
        product: newSale.name,
        amount: newSale.amount,
        employee: session?.displayName || 'Sistema',
        rank: session?.rank || '—',
        category: selectedCategory,
        time: newSale.time,
      });

      if (result.skipped) {
        setSaleStatus('Venta guardada. Falta poner el webhook de Discord.');
      } else if (result.ok) {
        setSaleStatus('Venta enviada a Discord correctamente.');
      } else {
        setSaleStatus('Venta guardada, pero Discord devolvió un error.');
      }
    } catch {
      setSaleStatus('Venta guardada, pero no se pudo enviar a Discord.');
    }
  };

  const handleEventRegistration = async () => {
    if (!eventForm.participant.trim() || !eventForm.event.trim()) return;
    const newEntry = {
      id: Date.now(),
      participant: eventForm.participant.trim(),
      event: eventForm.event.trim(),
      note: eventForm.note.trim(),
      time: dateTimeNow(),
    };
    setEventRegistrations((prev) => [newEntry, ...prev]);
    setEventForm({ participant: '', event: '', note: '' });

    try {
      const result = await sendEventRegistrationToDiscord({
        participant: newEntry.participant,
        event: newEntry.event,
        note: newEntry.note,
        createdBy: session?.displayName || 'Sistema',
        rank: session?.rank || '—',
        time: newEntry.time,
      });
      if (result.skipped) setEventStatus('Inscripción guardada. Falta poner el webhook de Discord.');
      else if (result.ok) setEventStatus('Inscripción enviada a Discord correctamente.');
      else setEventStatus('Inscripción guardada, pero Discord devolvió un error.');
    } catch {
      setEventStatus('Inscripción guardada, pero no se pudo enviar a Discord.');
    }
  };

  const handlePlateRegister = () => {
    const clean = plateInput.trim();
    const cleanProduct = plateProductInput.trim();
    if (!/^\d{3}$/.test(clean)) return;

    setPlates((prev) => {
      const existingIndex = prev.findIndex((p) => p.plate === clean);
      if (existingIndex >= 0) {
        return prev.map((p, index) =>
          index === existingIndex
            ? {
              ...p,
              count: Number(p.count || 0) + 1,
              product: cleanProduct || p.product || '',
            }
            : p
        );
      }
      return [{ plate: clean, count: 1, product: cleanProduct }, ...prev];
    });

    setPlateInput('');
    setPlateProductInput('');
  };

  const exportPlates = () => {
    const summarySheetData = [
      { Campo: 'Usuario actual', Valor: session?.displayName || '' },
      { Campo: 'Total de placas', Valor: plates.length },
      { Campo: 'Total ventas', Valor: currency(salesTotal) },
      { Campo: 'Horas trabajadas', Valor: formatHoursLong(workedMinutes) },
      { Campo: 'Total nómina', Valor: currency(payrollTotal) },
      { Campo: 'Exportado el', Valor: new Date().toLocaleString('es-ES') },
    ];

    const platesSheetData = plates.map((item, index) => ({
      ID: index + 1,
      Placa: item.plate,
      Veces: Number(item.count || 0),
      Producto: item.product || '',
      Estado: 'Activa'
    }));

    const historySheetData = shiftRows.map((row, index) => ({
      ID: index + 1,
      Nombre: row.nombre,
      Fecha: row.fecha,
      Entrada: row.entrada,
      Salida: row.salida,
      Horas: row.horas
    }));

    const salesSheetData = sales.map((sale, index) => ({
      ID: index + 1,
      Producto: sale.name,
      Monto: sale.amount,
      Empleado: sale.employee,
      Fecha: new Date(sale.time).toLocaleString('es-ES')
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summarySheetData), 'Resumen');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(platesSheetData), 'Placas');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(historySheetData), 'Fichajes');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(salesSheetData), 'Ventas');
    XLSX.writeFile(workbook, `bennys-completo-${formatDate(dateTimeNow())}.xlsx`);
  };

  const exportSalesOnly = () => {
    const salesSheetData = sales.map((sale, index) => ({
      ID: index + 1,
      Producto: sale.name,
      Monto: Number(sale.amount || 0),
      Empleado: sale.employee || '',
      Fecha: new Date(sale.time).toLocaleString('es-ES'),
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      salesSheetData.length > 0
        ? salesSheetData
        : [{ ID: '', Producto: 'No hay ventas', Monto: '', Empleado: '', Fecha: '' }]
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
    XLSX.writeFile(workbook, 'bennys-ventas.xlsx', { compression: true });
  };

  const exportVisibleSales = () => {
    const visibleSheetData = salesVisible.slice(0, 20).map((sale, index) => ({
      ID: index + 1,
      Producto: sale.name,
      Monto: Number(sale.amount || 0),
      Empleado: sale.employee || '',
      Fecha: new Date(sale.time).toLocaleString('es-ES'),
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      visibleSheetData.length > 0
        ? visibleSheetData
        : [{ ID: '', Producto: 'No hay ventas visibles', Monto: '', Empleado: '', Fecha: '' }]
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas visibles');
    XLSX.writeFile(workbook, 'bennys-ventas-visibles.xlsx', { compression: true });
  };

  const resetDemo = () => {
    localStorage.removeItem('bennys_sales');
    localStorage.removeItem('bennys_shifts');
    localStorage.removeItem('bennys_events');
    localStorage.removeItem('bennys_plates');
    localStorage.removeItem('bennys_session');
    window.location.reload();
  };

  const categoryButtonStyle = (category, index) => {
    const isActive = selectedCategory === category;
    if (!isActive) return styles.categoryBtn;
    const colors = [
      'linear-gradient(90deg, #3b82f6 0%, #38bdf8 100%)',
      'linear-gradient(90deg, #f97316 0%, #ef4444 100%)',
      '#eab308',
      '#eab308',
      '#4ade80',
      '#ec4899',
      '#eab308',
      '#38bdf8',
      '#eab308',
      '#eab308',
      '#eab308',
      '#eab308',
      '#eab308',
      '#a855f7',
    ];
    return { ...styles.categoryBtn, background: colors[index] || '#eab308', boxShadow: '0 0 20px rgba(234,179,8,.22)' };
  };

  if (!session) {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 680, borderRadius: 32, border: '1px solid rgba(255,255,255,.1)', background: 'linear-gradient(180deg, #0f0f11 0%, #050505 100%)', padding: 32, boxSizing: 'border-box', boxShadow: '0 0 80px rgba(0,0,0,.7)' }}>
          <div style={{ ...styles.logo, width: 144, height: 144, margin: '0 auto 28px', boxShadow: '0 0 50px rgba(234,179,8,.08)', border: '1px solid rgba(255,255,255,.1)' }}>
            <img src="/public/logo-meca.png" alt="Bennys Logo" style={styles.logoImg} />
          </div>
          <h1 style={{ textAlign: 'center', fontSize: 58, margin: 0, fontWeight: 900 }}>Bennys Original</h1>
          <div style={{ textAlign: 'center', fontSize: 28, color: '#a1a1aa', marginTop: 12 }}>Sistema de Gestión de Personal</div>
          <form onSubmit={handleLogin} style={{ marginTop: 36, display: 'grid', gap: 22 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 10, fontWeight: 800, fontSize: 22 }}>Usuario</label>
              <input value={loginForm.username} onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))} style={styles.input} placeholder="Ingrese su usuario" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 10, fontWeight: 800, fontSize: 22 }}>Contraseña</label>
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} style={styles.input} placeholder="Ingrese su contraseña" />
            </div>
            {loginError ? <div style={{ color: '#f87171', fontSize: 18, fontWeight: 700 }}>{loginError}</div> : null}
            <button style={{ ...styles.formBtn, boxShadow: '0 0 35px rgba(234,179,8,.25)' }}>Iniciar Sesión</button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.app}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>
            <div style={styles.logo}>
              <img src="/logo-meca.png" alt="Bennys Logo" style={styles.logoImg} />
            </div>
            <div>
              <div style={{ fontSize: 34, fontWeight: 900 }}>Bennys Original</div>
              <div style={{ color: '#a1a1aa', fontSize: 19 }}>Sistema de Gestión</div>
            </div>
          </div>

          <div style={styles.navWrap}>
            {nav.map((item) => {
              const active = activeNav === item;
              return (
                <button key={item} onClick={() => setActiveNav(item)} style={active ? { ...styles.navButton, ...styles.navButtonActive } : styles.navButton}>
                  {item}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 28, display: 'grid', gap: 12 }}>
            <button style={{ ...styles.sideAction, background: 'linear-gradient(90deg, #450a0a 0%, #7f1d1d 100%)', color: '#fca5a5' }} onClick={() => setSession(null)}>
              Cerrar Sesión
            </button>
            {session?.username === 'Theory' && (
              <button
                style={{ ...styles.sideAction, background: '#18181b', color: '#d4d4d8' }}
                onClick={resetDemo}
              >
                Reiniciar demo
              </button>
            )}
          </div>
        </aside>

        <main style={styles.main}>
          <header style={styles.header}>
            <div>
              <div style={{ color: '#a1a1aa', fontSize: 18 }}>Bienvenido/a</div>
              <div style={{ fontSize: 38, fontWeight: 800 }}>{session.displayName}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: '#18181b', borderRadius: 16, padding: '12px 18px', color: '#d4d4d8', fontSize: 18 }}>
                {currentTime.toLocaleDateString('es-ES')} · {currentTime.toLocaleTimeString('es-ES')}
              </div>
              <div style={{ ...styles.badge, background: 'linear-gradient(90deg, #eab308 0%, #737373 100%)', color: '#000' }}>{session.role}</div>
            </div>
          </header>

          <div style={styles.content}>
            {activeNav === 'Inicio' && (
              <section style={{ display: 'grid', gap: 28 }}>
                <div>
                  <h2 style={styles.title}>Panel de Control</h2>
                  <div style={styles.subtitle}>Gestiona tu jornada laboral</div>
                </div>

                <div style={styles.grid3}>
                  <button
                    onClick={handleClockIn}
                    disabled={!!currentShift}
                    style={{
                      ...styles.buttonBig,
                      background: currentShift ? 'rgba(21,128,61,.5)' : '#4ade80',
                      color: '#fff',
                      opacity: currentShift ? 0.7 : 1,
                      cursor: currentShift ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 44, marginBottom: 16 }}>↪</div>
                    Fichar Entrada
                  </button>

                  <button
                    onClick={handleClockOut}
                    disabled={!currentShift}
                    style={{
                      ...styles.buttonBig,
                      background: currentShift ? '#3f3f46' : '#27272a',
                      color: currentShift ? '#fff' : '#a1a1aa',
                      cursor: currentShift ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <div style={{ fontSize: 44, marginBottom: 16 }}>↩</div>
                    Fichar Salida
                  </button>

                  <div style={styles.darkCard}>
                    <div style={{ color: '#fef9c3', fontSize: 24 }}>Horas del periodo actual</div>
                    <div style={{ marginTop: 18, color: '#facc15', fontSize: 64, fontWeight: 300 }}>{formatMinutes(workedMinutes)}</div>
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={{ fontSize: 44, fontWeight: 800 }}>Registro de Fichajes</div>
                  <div style={{ color: '#a1a1aa', fontSize: 22, marginTop: 6 }}>Resumen reciente de entradas y salidas del personal</div>
                  <div style={styles.tableWrap}>
                    <div style={styles.tableScroller}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Nombre</th>
                            <th style={styles.th}>Fecha</th>
                            <th style={styles.th}>Entrada</th>
                            <th style={styles.th}>Salida</th>
                            <th style={styles.th}>Horas Totales</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shiftRows.length === 0 ? (
                            <tr>
                              <td style={styles.td} colSpan={5}>No hay fichajes todavía</td>
                            </tr>
                          ) : (
                            shiftRows.map((r) => (
                              <tr key={r.id}>
                                <td style={styles.td}>{r.nombre}</td>
                                <td style={styles.td}>{r.fecha}</td>
                                <td style={styles.td}>{r.entrada}</td>
                                <td style={styles.td}>{r.salida}</td>
                                <td style={styles.td}>{r.horas}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeNav === 'Dashboard' && (
              <section style={{ display: 'grid', gap: 28 }}>
                <div>
                  <h2 style={styles.title}>Dashboard</h2>
                  <div style={styles.subtitle}>Vista general del rendimiento del equipo</div>
                </div>

                <div style={{ ...styles.card, background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)' }}>
                  <div style={{ fontSize: 42, fontWeight: 900 }}>Trabajador de la Semana</div>
                  <div style={{ marginTop: 10, fontSize: 22, color: '#ffedd5' }}>Nombre y foto del mejor desempeño actual</div>
                  <div style={{ marginTop: 24, borderRadius: 24, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.12)', padding: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ width: 112, height: 112, borderRadius: '50%', border: '4px solid rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e5e7eb', color: '#000', fontSize: 36, fontWeight: 900 }}>
                      {workerOfTheWeek?.slice(0, 1).toUpperCase() || 'B'}
                    </div>
                    <div>
                      <div style={{ display: 'inline-block', borderRadius: 999, padding: '10px 16px', background: 'rgba(255,255,255,.14)', fontSize: 18, fontWeight: 700 }}>Reconocimiento destacado</div>
                      <div style={{ marginTop: 12, fontSize: 54, fontWeight: 900 }}>{workerOfTheWeek}</div>
                      <div style={{ marginTop: 6, fontSize: 24, color: '#ffedd5' }}>
                        {workerOfTheWeek === 'Sin datos' ? 'Aún no hay datos suficientes para mostrar un destacado' : 'Gracias por tu esfuerzo y dedicación'}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ ...styles.card, background: 'linear-gradient(90deg, #164e63 0%, #1d4ed8 100%)' }}>
                    <div style={{ fontSize: 40, fontWeight: 900 }}>Ranking de Ventas</div>
                    <div style={{ marginTop: 8, fontSize: 22, color: '#e4e4e7' }}>Top 5 empleados por ventas registradas</div>
                    <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
                      {salesRanking.length === 0 ? (
                        <div style={{ borderRadius: 22, background: 'rgba(255,255,255,.12)', padding: 22, fontSize: 20 }}>No hay ranking de ventas todavía</div>
                      ) : (
                        salesRanking.map((item, index) => (
                          <div key={item.name} style={{ borderRadius: 22, background: 'rgba(255,255,255,.12)', padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eab308', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20 }}>{index + 1}</div>
                              <div>
                                <div style={{ fontSize: 26, fontWeight: 800 }}>{item.name}</div>
                                <div style={{ color: '#d4d4d8', fontSize: 18 }}>Total vendido</div>
                              </div>
                            </div>
                            <div style={{ color: '#4ade80', fontSize: 34, fontWeight: 900 }}>{currency(item.total)}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div style={{ ...styles.card, background: 'linear-gradient(90deg, #312e81 0%, #581c87 100%)' }}>
                    <div style={{ fontSize: 40, fontWeight: 900 }}>Ranking de Horas</div>
                    <div style={{ marginTop: 8, fontSize: 22, color: '#e4e4e7' }}>Top 5 empleados por horas registradas</div>
                    <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
                      {hoursRanking.length === 0 ? (
                        <div style={{ borderRadius: 22, background: 'rgba(255,255,255,.12)', padding: 22, fontSize: 20 }}>No hay ranking de horas todavía</div>
                      ) : (
                        hoursRanking.map((item, index) => (
                          <div key={item.name} style={{ borderRadius: 22, background: 'rgba(255,255,255,.12)', padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eab308', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20 }}>{index + 1}</div>
                              <div>
                                <div style={{ fontSize: 26, fontWeight: 800 }}>{item.name}</div>
                                <div style={{ color: '#d4d4d8', fontSize: 18 }}>Total acumulado</div>
                              </div>
                            </div>
                            <div style={{ color: '#4ade80', fontSize: 34, fontWeight: 900 }}>{formatHoursLong(item.totalMinutes)}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeNav === 'Productos & Ventas' && (
              <section style={{ display: 'grid', gridTemplateColumns: '1.7fr 0.8fr', gap: 24 }}>
                <div style={styles.card}>
                  <h2 style={styles.title}>Productos & Ventas</h2>
                  <div style={styles.subtitle}>Gestiona el catálogo y registra ventas</div>
                  <div style={styles.categoryGrid}>
                    {categories.map((c, i) => (
                      <button key={c} onClick={() => setSelectedCategory(c)} style={categoryButtonStyle(c, i)}>
                        {c}
                      </button>
                    ))}
                  </div>

                  <div style={styles.productsPanel}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 22 }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={styles.productsTitle}>Productos -<br />{selectedCategory}</h3>
                        <div style={styles.productsDesc}>Pulsa un precio de la guía o el nombre del producto y se cargará en el formulario de venta.</div>
                      </div>
                      <div style={styles.productsCount}>{visibleProducts.length}<br />productos</div>
                    </div>

                    <div style={styles.productsTableWrap}>
                      <div style={styles.productsTableScroller}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={styles.productsHeadCell}>Producto</th>
                              <th style={styles.productsHeadCell}>Precio<br />Normal</th>
                              <th style={styles.productsHeadCell}>Precio<br />Convenio</th>
                              <th style={styles.productsHeadCell}>Precio<br />Oferta</th>
                            </tr>
                          </thead>
                          <tbody>
                            {visibleProducts.length === 0 ? (
                              <tr>
                                <td style={styles.productsCell} colSpan={4}>No hay productos todavía</td>
                              </tr>
                            ) : (
                              visibleProducts.map((p) => (
                                <tr key={`${selectedCategory}-${p.name}`}>
                                  <td
                                    style={{ ...styles.productsCell, cursor: 'pointer', fontWeight: 900, fontSize: 22, lineHeight: 1.25, color: '#fafafa' }}
                                    onClick={() => setSaleForm({ product: p.name, amount: String(p.oferta ?? p.convenio ?? p.normal ?? ''), source: 'Producto seleccionado' })}
                                  >
                                    {p.name}
                                  </td>
                                  <td
                                    style={{ ...styles.productsCell, cursor: 'pointer', fontSize: 22, color: '#fde68a' }}
                                    onClick={() => pickPrice(p, p.normal, 'Precio normal')}
                                  >
                                    {currency(p.normal)}
                                  </td>
                                  <td
                                    style={{ ...styles.productsCell, cursor: 'pointer', fontSize: 22, color: '#9ca3af' }}
                                    onClick={() => pickPrice(p, p.convenio, 'Precio convenio')}
                                  >
                                    {currency(p.convenio)}
                                  </td>
                                  <td
                                    style={{ ...styles.productsCell, cursor: 'pointer', fontSize: 22, color: '#22c55e', fontWeight: 900 }}
                                    onClick={() => pickPrice(p, p.oferta, 'Precio oferta')}
                                  >
                                    {currency(p.oferta)}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                  <div style={{
                    borderRadius: 32,
                    padding: 28,
                    background: 'linear-gradient(180deg,#0b0b0b 0%, #050505 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 24px 50px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.03)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1 }}>
                        Mis<br />Últimas<br />Ventas
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 800, textAlign: 'right' }}>
                        {salesVisible.length}<br />visibles
                      </div>
                    </div>

                    <div style={{ marginTop: 20, color: '#9ca3af', fontSize: 20 }}>
                      {salesVisible.length === 0 ? 'No hay ventas todavía' : ''}
                    </div>

                    {salesVisible.length > 0 ? (
                      <div style={{ marginTop: 18, display: 'grid', gap: 12, maxHeight: 260, overflow: 'auto', paddingRight: 4 }}>
                        {salesVisible.slice(0, 6).map((sale) => (
                          <div key={sale.id} style={styles.listCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontSize: 22, fontWeight: 800 }}>{sale.name}</div>
                                <div style={{ marginTop: 6, color: '#d4d4d8', fontSize: 16 }}>{String(sale.time).replace('T', ' ').slice(0, 19)}</div>
                              </div>
                              <div style={{ color: '#4ade80', fontSize: 28, fontWeight: 900 }}>{currency(sale.amount)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 26 }}>Total:</span>
                        <span style={{ fontSize: 48, fontWeight: 900, color: '#22c55e' }}>{currency(salesTotal)}</span>
                      </div>

                      <div style={{ marginTop: 14, color: '#9ca3af', fontSize: 18 }}>
                        Última actualización visible: {currentTime.toLocaleString('es-ES')}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    borderRadius: 32,
                    padding: 28,
                    background: 'linear-gradient(180deg,#0b0b0b 0%, #050505 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 24px 50px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.03)'
                  }}>
                    <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.05 }}>Registrar<br />Venta</div>
                    <div style={{ marginTop: 16, color: '#9ca3af', fontSize: 20, lineHeight: 1.5 }}>
                      Selecciona un precio desde la tabla o escribe el monto manualmente.
                    </div>

                    <div style={{ marginTop: 24, display: 'grid', gap: 18 }}>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Producto</div>
                        <input
                          style={styles.input}
                          value={saleForm.product}
                          onChange={(e) => setSaleForm((p) => ({ ...p, product: e.target.value }))}
                          placeholder="Nombre del producto"
                        />
                      </div>

                      <div>
                        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Monto</div>
                        <input
                          style={styles.input}
                          value={saleForm.amount}
                          onChange={(e) => setSaleForm((p) => ({ ...p, amount: e.target.value }))}
                          placeholder="0"
                        />
                      </div>

                      <div style={{ fontSize: 18, fontWeight: 800, textDecoration: 'underline', lineHeight: 1.5 }}>
                        {saleForm.source || 'Aún no has seleccionado un precio de la guía.'}
                      </div>

                      <button style={styles.formBtn} onClick={handleAddSale}>
                        + Registrar Venta
                      </button>

                      {saleStatus ? <div style={{ color: '#d4d4d8', fontSize: 18, fontWeight: 700 }}>{saleStatus}</div> : null}

                      <div style={{ display: 'grid', gap: 10 }}>
                        <button style={{ ...styles.sideAction, background: '#27272a', color: '#fff' }} onClick={exportSalesOnly}>
                          Exportar ventas
                        </button>
                        <button style={{ ...styles.sideAction, background: '#1f2937', color: '#fff' }} onClick={exportVisibleSales}>
                          Exportar visibles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeNav === 'Registros' && (
              <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
                <div style={styles.card}>
                  <h2 style={styles.title}>Registros</h2>
                  <div style={styles.subtitle}>Gestión de eventos y seguridad</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                    <div style={{ ...styles.card, background: '#111' }}>
                      <div style={{ borderRadius: '20px 20px 0 0', background: 'linear-gradient(90deg, #eab308 0%, #737373 100%)', padding: '18px 20px', fontSize: 34, fontWeight: 900 }}>
                        Inscripción de Eventos
                      </div>
                      <div style={{ padding: 20, display: 'grid', gap: 18 }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: 10, fontSize: 20, fontWeight: 700 }}>Nombre del Participante</label>
                          <input
                            style={styles.input}
                            value={eventForm.participant}
                            onChange={(e) => setEventForm((p) => ({ ...p, participant: e.target.value }))}
                            placeholder="Nombre completo"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: 10, fontSize: 20, fontWeight: 700 }}>Evento</label>
                          <input
                            style={styles.input}
                            value={eventForm.event}
                            onChange={(e) => setEventForm((p) => ({ ...p, event: e.target.value }))}
                            placeholder="Escribe el nombre del evento"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: 10, fontSize: 20, fontWeight: 700 }}>Observación</label>
                          <textarea
                            style={styles.textarea}
                            value={eventForm.note}
                            onChange={(e) => setEventForm((p) => ({ ...p, note: e.target.value }))}
                            placeholder="Notas adicionales..."
                          />
                        </div>
                        <button style={styles.formBtn} onClick={handleEventRegistration}>Enviar Inscripción</button>
                        {eventStatus ? <div style={{ color: '#d4d4d8', fontSize: 18, fontWeight: 700 }}>{eventStatus}</div> : null}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: 24 }}>
                      <div style={{ ...styles.card, background: '#111' }}>
                        <div style={{ borderRadius: '20px 20px 0 0', background: 'linear-gradient(90deg, #450a0a 0%, #991b1b 100%)', padding: '18px 20px', fontSize: 34, fontWeight: 900 }}>
                          Registro Policial
                        </div>
                        <div style={{ padding: 20, display: 'grid', gap: 18 }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: 10, fontSize: 20, fontWeight: 700 }}>Número de Placa</label>
                            <input
                              style={styles.input}
                              value={plateInput}
                              onChange={(e) => setPlateInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                              placeholder="231"
                            />
                            <div style={{ marginTop: 8, color: '#a1a1aa', fontSize: 18 }}>Formato: 231</div>
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: 10, fontSize: 20, fontWeight: 700 }}>Producto</label>
                            <input
                              style={styles.input}
                              value={plateProductInput}
                              onChange={(e) => setPlateProductInput(e.target.value)}
                              placeholder="Producto"
                            />
                          </div>
                          <button style={styles.formBtn} onClick={handlePlateRegister}>Registrar Placa</button>
                        </div>
                      </div>

                      <div style={{ ...styles.card, background: '#1e1e1e' }}>
                        <div style={{ fontSize: 24, color: '#d4d4d8' }}>Total de Placas Registradas</div>
                        <div style={{ marginTop: 10, fontSize: 70, fontWeight: 900 }}>{plates.length}</div>
                      </div>

                      <div style={{ ...styles.card, background: '#111' }}>
                        <div style={{ fontSize: 38, fontWeight: 900, marginBottom: 16 }}>Últimas Placas Registradas</div>
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
                          {session?.username === 'Theory' && (
                            <>
                              <button style={{ ...styles.sideAction, width: 'auto', background: '#27272a', color: '#fff' }} onClick={exportPlates}>Exportar Excel</button>
                              <button style={{ ...styles.sideAction, width: 'auto', background: '#27272a', color: '#fff' }} onClick={exportPlates}>Historial</button>
                            </>
                          )}
                        </div>
                        <div style={{ maxHeight: 170, overflow: 'auto', display: 'grid', gap: 12 }}>
                          {plates.length === 0 ? (
                            <div style={{ color: '#a1a1aa', fontSize: 20 }}>No hay placas registradas</div>
                          ) : (
                            plates.map((item, i) => (
                              <div
                                key={`${item.plate}-${i}`}
                                style={{ borderRadius: 16, background: '#18181b', padding: '14px 16px', fontSize: 20, fontWeight: 700 }}
                              >
                                Placa {item.plate} · Veces: {item.count}{item.product ? ` · Producto: ${item.product}` : ''}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeNav === 'Beneficios' && (
              <section style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.9fr', gap: 24 }}>
                <div style={{ display: 'grid', gap: 24 }}>
                  <div style={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 18 }}>
                      <div>
                        <div style={{ fontSize: 48, fontWeight: 900 }}>Resumen de Nómina</div>
                        <div style={{ marginTop: 8, fontSize: 20, color: '#a1a1aa' }}>Resumen actualizado de horas, ventas y bonos</div>
                      </div>
                      <div style={{ ...styles.badge, background: currentShift ? '#14532d' : '#7f1d1d', color: currentShift ? '#86efac' : '#fca5a5' }}>{currentShift ? 'Turno abierto' : 'Turno cerrado'}</div>
                    </div>
                    <div style={{ marginBottom: 18, fontSize: 20, color: '#d4d4d8' }}>Este resumen toma horas en vivo, ventas y bonos guardados en pagos.</div>
                    <div style={styles.statGrid}>
                      <StatCard title="Horas Trabajadas" subtitle="Tiempo acumulado del turno e historial" value={formatHoursLong(workedMinutes)} />
                      <StatCard title="Pago por hora" subtitle={`Configuración actual aplicada · ${currentRank}`} value={currency(hourlyRate)} />
                      <StatCard title="Comisión por ventas" subtitle="Basado en tus ventas visibles" value={currency(salesCommission)} valueClass={{ color: '#4ade80' }} />
                      <StatCard title="Subtotal horas" subtitle="Horas × pago por hora" value={currency(subtotalHoras)} />
                      <StatCard title="Bono apertura" subtitle="Bonificación configurada" value={currency(bonoApertura)} />
                      <StatCard title="Bono evento" subtitle="Bonificación por actividad" value={currency(bonoEvento)} />
                    </div>
                    <div style={styles.greenBox}>
                      <div style={{ fontSize: 24, fontWeight: 800 }}>Total a cobrar</div>
                      <div style={{ marginTop: 12, fontSize: 72, fontWeight: 900 }}>{currency(payrollTotal)}</div>
                    </div>
                    <div style={{ marginTop: 18, color: '#a1a1aa', fontSize: 18 }}>Configuración de pagos actualizada: {currentTime.toLocaleString('es-ES')}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                  <div style={styles.card}>
                    <div style={{ fontSize: 48, fontWeight: 900 }}>Convenios Disponibles</div>
                    <div style={{ marginTop: 8, fontSize: 20, color: '#a1a1aa' }}>Categorías y locales visibles sin doble scroll</div>
                    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      {convenioEntries.map((item) => (
                        <button key={item.cat} onClick={() => setSelectedConvenio(item.cat)} style={{ ...styles.categoryBtn, textAlign: 'left', background: item.active ? '#eab308' : '#202020', color: item.active ? '#000' : '#fff' }}>
                          <div style={{ fontSize: 28, fontWeight: 900 }}>{item.cat}</div>
                          <div style={{ marginTop: 6, fontSize: 20, color: item.active ? 'rgba(0,0,0,.75)' : '#d4d4d8' }}>{item.count}</div>
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 40, fontWeight: 900 }}>Locales - {selectedConvenio}</div>
                      <div style={{ borderRadius: 999, background: '#27272a', padding: '12px 18px', fontSize: 22, fontWeight: 800 }}>{convenioData[selectedConvenio].length} locales</div>
                    </div>
                    <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
                      {convenioData[selectedConvenio].length === 0 ? (
                        <div style={{ color: '#a1a1aa', fontSize: 20 }}>No hay locales disponibles</div>
                      ) : (
                        convenioData[selectedConvenio].map((local) => (
                          <div key={local} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 22, background: '#1b1b1b', padding: '18px 20px' }}>
                            <span style={{ fontSize: 28, fontWeight: 800 }}>{local}</span>
                            <span style={{ borderRadius: 999, background: '#14532d', color: '#86efac', padding: '8px 16px', fontSize: 22, fontWeight: 900 }}>SI</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


