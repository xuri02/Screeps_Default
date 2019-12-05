const MINER = 'miner';
const BUILDER = 'builder';
const UPGRADE = 'upgrade';
const CARRYER = 'carry';
const ARCHITECT = 'architect';
const REPAIR = 'repair';
const LOOTER = 'lootcolector';
const SPAWNHELPER = 'spawnhelper';
const ATTACKE = 'attack';
const CARRYERS = 17; //(+1)
const MINERS = 7;
const BUILDERS = 4;
const UPGRADERS = 4;
const REPAIRS = 4;
const SPAENHELPERS = 2;

let spawner = {
    Init: function (Game, spw) {
        // spw.memory.VIP = [];
        // let towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        // towers.forEach(tower => spw.memory.VIP.push(tower.id));
        let architect = require(ARCHITECT);
        architect.run(spw.memory.init, spw);
        if (spw.memory.need_energy === undefined)
            spw.memory.need_energy = [];
        if (spw.memory.query === undefined)
            spw.memory.query = [];

        spw.memory.creeps_count_by_action = {
            miner: 0,
            carry: 0,
            upgrade: 0,
            builder: 0,
            lootcolector: 0,
            repair: 0,
            spawnhelper: 0,
            attack: 0
        };
        for (let it in Game.creeps) {
            let creep = Game.creeps[it];
            spw.memory.creeps_count_by_action[creep.memory.action] += 1;
        }
        console.log(spw.memory.creeps_count_by_action[SPAWNHELPER]);


        // let towers = spw.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        // towers.forEach((tower) => {
        //     if (!spw.memory.pets.includes(tower.id))
        //         spw.memory.need_energy.push(tower.id);
        // });

        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === CARRYER && creep.memory.pet != null);
        let pets = [];
        for (let c in carryers) {
            let ca = carryers[c];
            if (pets.includes(ca.memory.pet)) {
                console.log('removing duplicate: ' + ca.memory.pet);
                delete ca.memory.pet;
            } else {
                pets.push(ca.memory.pet);
            }
        }

        if (spw.memory._extentions && spw.memory._extentions[0] === 4) {
            //let cpu = Game.cpu.getUsed();
            let s = require('action.' + SPAWNHELPER);
            s.Build(undefined, spw, true, ++spw.memory._extentions[2], spw.memory._extentions[2]);
            if (spw.memory._extentions[2] > 16) {
                spw.memory._extentions[2] = -1;
            }
            //console.log(Game.cpu.getUsed() - cpu + ' '+spw.memory._extentions[2]);
        }

        switch (spw.memory.init) {
            case -1:
                break;
            case 0:
                let s = require('action.' + SPAWNHELPER);
                s.detectPos(undefined, spw);
                console.log('INIT: ' + spw.memory.init);
                break;
            case 1:
                console.log('INIT: ' + spw.memory.init);
                break;
            case 2:
                console.log('INIT: ' + spw.memory.init);
                break;
            case 3:
                console.log('INIT: ' + spw.memory.init);
                break;
            case 4:
                console.log('INIT: ' + spw.memory.init);
                break;
            case 5:
                console.log('INIT: ' + spw.memory.init);
                break;
            case 6:
                console.log('INIT: ' + spw.memory.init);
                break;
            case 7:
                console.log('INIT: ' + spw.memory.init);
                break;
            default:
                spw.memory.init = 0;
        }
        return;
    },

    Check: function (game, spw) {
        if (spw.memory.query && spw.memory.query.length > 0) {
            var c = Game.creeps[spw.memory.query.pop()];
            if (c) {
                spw.memory.need_energy.push(c.id);
            }
        }
        for (let name in spw.memory.creeps)
            if (!Game.creeps[name]) {
                if (name.includes('attack'))
                    spw.memory.creeps_count_by_action[ATTACKE] -= 1;
                delete spw.memory.creeps[name];
                console.log('✝: ' + name);
            }

        let carryers = _.filter(Game.creeps, (creep) => creep.memory.action === CARRYER && creep.memory.pet != null);
        spw.memory.pets = _.map(carryers, function (s) {
            return s.memory.pet;
        });

        if (!spw.spawning) {
            let energy = spw.room.energyAvailable;
            //console.log(energy);
            //if (energy < 250) return;
            if (energy < 150) return;
            spw.room.visual.text('⚡' + energy + '⚡',
                spw.pos.x - .7, spw.pos.y,
                {align: 'left', opacity: 1, color: '#ff00f5', font: .3});

            let c_UPGRADE = spw.memory.creeps_count_by_action[UPGRADE];
            let c_MINER = spw.memory.creeps_count_by_action[MINER];
            let c_CARRYER = spw.memory.creeps_count_by_action[CARRYER] - 1;
            let c_REPAIR = spw.memory.creeps_count_by_action[REPAIR];
            let c_LOOTER = spw.memory.creeps_count_by_action[LOOTER];
            let c_BUILDER = spw.memory.creeps_count_by_action[BUILDER];
            let c_SPAENHELPER = spw.memory.creeps_count_by_action[SPAWNHELPER];
            let c_ATTACKER = spw.memory.creeps_count_by_action[ATTACKE];

            if (c_MINER < MINERS && c_MINER < c_CARRYER) {
                let name = spw.SpawnCustomCreep(energy, MINER);
                spw.memory.creeps_count_by_action[MINER] += 1;
            } else if (c_UPGRADE < UPGRADERS && c_UPGRADE < c_CARRYER - 1) {
                let name = spw.SpawnCustomCreep(energy, UPGRADE);
                console.log("🔜: " + name);
                spw.memory.query.push(name);
                spw.memory.creeps_count_by_action[UPGRADE] += 1;
            } else if (c_SPAENHELPER < SPAENHELPERS && c_SPAENHELPER < c_CARRYER - 1) {
                let name = spw.SpawnCustomCreep(energy, SPAWNHELPER);
                spw.memory.creeps_count_by_action[SPAWNHELPER] += 1;
            } else if (c_CARRYER < CARRYERS) {
                spw.SpawnCustomCreep(energy, CARRYER, spw.memory.need_energy.length > 0 ? {pet: spw.memory.need_energy.shift()} : undefined);
                spw.memory.creeps_count_by_action[CARRYER] += 1;
            } else if (c_ATTACKER < 4 && c_ATTACKER < c_CARRYER) {
                spw.SpawnCustomCreep(energy, ATTACKE);
                spw.memory.creeps_count_by_action[ATTACKE] += 1;
            }/* else if (c_LOOTER < 1 && c_LOOTER < c_CARRYER && (spw.room.find(FIND_RUINS, {
                filter: (structure) => {
                    return structure.store[RESOURCE_ENERGY] > 0;
                }
            }).length > 0 || spw.room.find(FIND_TOMBSTONES, {
                filter: (structure) => {
                    return structure.ticksToDecay > 30;
                }
            }).length > 0)) {
                spw.SpawnCustomCreep(energy, LOOTER);
                spw.memory.creeps_count_by_action[LOOTER] += 1;
            }*/ else if (spw.room.find(FIND_CONSTRUCTION_SITES).length > 0 && c_BUILDER < BUILDERS) {
                let name = spw.SpawnCustomCreep(energy, BUILDER);
                console.log("🔜: " + name);
                spw.memory.query.push(name);
                spw.memory.creeps_count_by_action[BUILDER] += 1;
            } else if (c_REPAIR < REPAIRS && c_REPAIR < c_CARRYER) {
                let name = spw.SpawnCustomCreep(energy, REPAIR);
                console.log("🔜: " + name);
                spw.memory.query.push(name);
                spw.memory.creeps_count_by_action[REPAIR] += 1;
            }

        } else {
            spw.room.visual.text('🛠️' + Game.creeps[spw.spawning.name].memory.action,
                spw.pos.x + 1, spw.pos.y,
                {align: 'left', opacity: 0.7});
        }
    }
};
module.exports = spawner;