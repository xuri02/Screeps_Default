const max_hits = 100000;
let repair = {
    /** @param {Creep} creep
     *  @param {Spawn} spw
     **/
    run: function (creep, spw) {

        if (creep.store[RESOURCE_ENERGY] === 0) return;
        // creep.memory.init = 0;
        // delete creep.memory.targets
        // delete creep.memory.target;
        switch (creep.memory.init) {
            case  0:
                creep.memory.init = 1;
                break;
            case  1:
                /*const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => ((object.hits < max_hits) && (object.hits < object.hitsMax))
                });
                targets.sort((a, b) => a.hits - b.hits);
                creep.memory.targets = _.map(targets, (t) => {
                    return t.id;
                });
                
                let tar = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                    filter: object => ((object.hits < max_hits) && (object.hits < object.hitsMax))
                });
                */
                creep.memory.init = 2;
                creep.moveTo(spw.x - 8,spw.y+3);
                //break;
            case  2:
                //if (creep.memory.targets.length > 0) {
                    if (creep.memory.target === undefined) {
                        creep.memory.target = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                                        filter: object => ((object.hits < max_hits) && (object.hits < object.hitsMax))
                                    }).id;
                        
                        
                        
                        //creep.memory.targets.pop();
                    } else {
                        delete creep.memory.target;
                    }
                    creep.memory.init = 3;
                //} else {
                    //creep.memory.init = 1;
                    break;
                //}
            case  3:
                let target = Game.getObjectById(creep.memory.target);
                if (target !== undefined && target !== null && (target.hits !== target.hitsMax && target.hits < max_hits)) {
                    if (creep.repair(target) === ERR_NOT_IN_RANGE)
                        creep.moveTo(target);
                    else {
                        creep.moveTo(target.x - 2, target.y - 2);
                        //creep.say('🔧: ' + target.hits);
                    }
                } else {
                    delete creep.memory.target;
                    creep.memory.init = 2;
                }
                break;
            default:
                creep.memory.init = 0;
                break
        }
    },

    recycle: function (creep, spw) {
        if (spw.recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spw);
        }
    }
};
module.exports = repair;
