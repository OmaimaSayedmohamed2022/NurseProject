import mongoose from "mongoose";
import { historyPlugin } from "../utilites/historyPlugin.js";

const modulePermissionSchema = new mongoose.Schema({
  add: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  view: { type: Boolean, default: true }
}, { _id: false });

const permissionSchema = new mongoose.Schema({
  patient: modulePermissionSchema,
  nurse: modulePermissionSchema,
  service: modulePermissionSchema,
  session:modulePermissionSchema,
  patientData:modulePermissionSchema,
  setting:modulePermissionSchema,
  notification:modulePermissionSchema,
  emergency:modulePermissionSchema,
  history:modulePermissionSchema,
  home:modulePermissionSchema,
  patientData:modulePermissionSchema

 
}, { _id: false });

const adminSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Staff'],
    default: "Admin",
  },
  image: { type: String },
  permissions: permissionSchema
}, { timestamps: true });

adminSchema.plugin(historyPlugin, { moduleName: "Admin" });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
