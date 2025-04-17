export const checkAccess = (module, action) => {
    return (req, res, next) => {
      const { role, permissions } = req.user;
  
      // للموظفين فقط
      if (["Admin", "Manager", "Staff"].includes(role)) {
        if (!permissions?.[module]?.[action]) {
          return res.status(403).json({
            message: `You don't have permission to ${action} ${module}`,
          });
        }
        return next();
      }
  
      // لو مش موظف (Client أو Nurse)
      if (role === "Client" || role === "Nurse") {
        return next(); // بنسمحله لأن دي API مشتركة
      }
  
      return res.status(403).json({ message: "Access denied." });
    };
  };
  