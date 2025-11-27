export function getMachineNameByMachineId(id){
    switch(id){
        case 1:
            return "CPM Gép";
        case 2:
            return "Kórházi ágy";
        default:
            return "Nincs gép";
    }
}