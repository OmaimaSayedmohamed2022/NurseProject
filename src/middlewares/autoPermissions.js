export const autoPermission = (moduleName) => {
    return (req, res, next) => {
      const methodToAction = {
        GET: "view",
        POST: "add",
        PUT: "edit",
        PATCH: "edit",
        DELETE: "delete",
      };
  
      const action = methodToAction[req.method];
      const { role, permissions } = req.user;
  
      // لو مش موظف (يعني Nurse أو Client)
      if (!["Admin", "Manager", "Staff"].includes(role)) {
        return res.status(403).json({ message: "Only staff have access to this route." });
      }
  
      // لو مفيش صلاحية
      if (!permissions?.[moduleName]?.[action]) {
        return res.status(403).json({ message: `Access denied: You can't ${action} ${moduleName}` });
      }
  
      next();
    };
  };
  