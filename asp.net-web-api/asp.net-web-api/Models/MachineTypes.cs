namespace asp.net_web_api.Models
{
    public enum MachineTypes
    {
        NONE = 0,
        CPM = 1,
        HOSSPITAL_BED = 2
    }

    public static class MachineTypesExtension
    {
        public static string GetMachineName(this MachineTypes machineType)
        {
            return machineType switch
            {
                MachineTypes.NONE => "Nincs gép",
                MachineTypes.CPM => "CPM gép",
                MachineTypes.HOSSPITAL_BED => "Kórházi ágy",
                _ => ""
            };
        }
    }
}
