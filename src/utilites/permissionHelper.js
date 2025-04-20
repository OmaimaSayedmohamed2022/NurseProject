export const generateFullPermissions = () => {
    const modules = [
      "patient", "nurse", "service", "session",
      "patientData", "setting", "notification",
      "emergency", "history","home","patientData"

    ];
  
    const fullAccess = {
      add: true,
      edit: true,
      delete: true,
      view: true
    };
  
    const permissions = {};
    for (let mod of modules) {
      permissions[mod] = { ...fullAccess };
    }
  
    return permissions;
  };
  